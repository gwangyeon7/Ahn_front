#!/bin/bash
# deploy-backend.sh
# 사용법: ./scripts/deploy-backend.sh <BE_HOST> <SSH_KEY> <BUILD_NUM> <REMOTE_USER> <WAR_FILE>
#
# 배포 전략:
#   1. war 파일을 ~/releases/<BUILD_NUM>/ 에 업로드
#   2. 기존 앱 중지 (systemd 서비스 or 직접 프로세스 kill)
#   3. ~/app.war 를 최신 war 로 교체
#   4. 앱 시작

set -euo pipefail

BE_HOST="$1"
SSH_KEY="$2"
BUILD_NUM="$3"
REMOTE_USER="$4"
WAR_FILE="$5"

WAR_BASENAME=$(basename "$WAR_FILE")
SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=30"
SERVICE_NAME="safelink"          # systemd 서비스명 (없으면 직접 프로세스로 폴백)
APP_DIR="/home/${REMOTE_USER}"
DEPLOY_WAR="${APP_DIR}/app.war"

echo "🚀 백엔드 배포 시작 — 빌드 #${BUILD_NUM} → ${REMOTE_USER}@${BE_HOST}"

# 1. 릴리스 디렉토리 생성 및 war 업로드
ssh $SSH_OPTS "${REMOTE_USER}@${BE_HOST}" "mkdir -p ~/releases/${BUILD_NUM}"
rsync -az \
  -e "ssh $SSH_OPTS" \
  "${WAR_FILE}" \
  "${REMOTE_USER}@${BE_HOST}:~/releases/${BUILD_NUM}/${WAR_BASENAME}"

echo "📦 war 업로드 완료"

# 2. 앱 중지 → war 교체 → 앱 시작
ssh $SSH_OPTS "${REMOTE_USER}@${BE_HOST}" "
  set -e

  # --- 앱 중지 ---
  if systemctl is-active --quiet ${SERVICE_NAME} 2>/dev/null; then
    echo '🛑 systemd 서비스 중지: ${SERVICE_NAME}'
    sudo systemctl stop ${SERVICE_NAME}
  else
    # systemd 서비스가 없으면 포트 18080 프로세스 직접 kill
    PID=\$(lsof -ti:18080 || true)
    if [ -n \"\$PID\" ]; then
      echo \"🛑 PID \$PID (포트 18080) 종료\"
      kill \$PID
      sleep 3
    else
      echo 'ℹ️  실행 중인 앱 프로세스 없음 (최초 배포)'
    fi
  fi

  # --- war 교체 ---
  cp ~/releases/${BUILD_NUM}/${WAR_BASENAME} ${DEPLOY_WAR}
  echo '✅ ${DEPLOY_WAR} 교체 완료'

  # --- 앱 시작 ---
  if systemctl is-enabled --quiet ${SERVICE_NAME} 2>/dev/null; then
    echo '▶️  systemd 서비스 시작: ${SERVICE_NAME}'
    sudo systemctl start ${SERVICE_NAME}
  else
    echo '▶️  직접 실행 (nohup java -jar)'
    nohup java -jar ${DEPLOY_WAR} \
      --server.port=18080 \
      > ~/app.log 2>&1 &
    echo \"PID: \$!\"
  fi
"

# 3. 오래된 릴리스 정리 (최신 5개만 보관)
ssh $SSH_OPTS "${REMOTE_USER}@${BE_HOST}" "
  cd ~/releases 2>/dev/null || exit 0
  ls -1d */ 2>/dev/null \
    | sort -t/ -k1,1n \
    | head -n -5 \
    | xargs -r rm -rf
  echo '🧹 오래된 릴리스 정리 완료'
"

echo "✅ 백엔드 배포 완료 — 빌드 #${BUILD_NUM}"
