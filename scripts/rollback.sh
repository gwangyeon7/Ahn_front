#!/bin/bash
# rollback.sh
# 사용법: ./scripts/rollback.sh <frontend|backend> <HOST> <SSH_KEY> <REMOTE_USER> <TARGET_BUILD_NUM>
#
# ~/releases/<TARGET_BUILD_NUM>/ 에 저장된 릴리스로 되돌림.

set -euo pipefail

TARGET="$1"     # frontend 또는 backend
HOST="$2"
SSH_KEY="$3"
REMOTE_USER="$4"
BUILD_NUM="$5"  # 롤백할 빌드 번호

SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=30"
SERVICE_NAME="safelink"

echo "⏪ Rollback 시작 — ${TARGET} → 빌드 #${BUILD_NUM} @ ${REMOTE_USER}@${HOST}"

if [ "$TARGET" = "frontend" ]; then
  ssh $SSH_OPTS "${REMOTE_USER}@${HOST}" "
    set -e
    RELEASE_DIR=~/releases/${BUILD_NUM}
    if [ ! -d \"\$RELEASE_DIR\" ]; then
      echo '❌ 릴리스 #${BUILD_NUM} 가 없습니다: '\$RELEASE_DIR
      exit 1
    fi
    rsync -a --delete \"\$RELEASE_DIR/\" ~/dist/
    echo '✅ 프론트엔드 롤백 완료 → 빌드 #${BUILD_NUM}'
  "

elif [ "$TARGET" = "backend" ]; then
  ssh $SSH_OPTS "${REMOTE_USER}@${HOST}" "
    set -e
    RELEASE_DIR=~/releases/${BUILD_NUM}
    WAR_FILE=\$(ls \"\$RELEASE_DIR\"/*.war 2>/dev/null | head -n 1)
    if [ -z \"\$WAR_FILE\" ]; then
      echo '❌ 릴리스 #${BUILD_NUM} 의 war 파일을 찾을 수 없습니다'
      exit 1
    fi

    # 앱 중지
    if systemctl is-active --quiet ${SERVICE_NAME} 2>/dev/null; then
      sudo systemctl stop ${SERVICE_NAME}
    else
      PID=\$(lsof -ti:18080 || true)
      [ -n \"\$PID\" ] && kill \$PID && sleep 3
    fi

    # war 교체
    cp \"\$WAR_FILE\" ~/app.war
    echo '✅ war 교체 완료 → 빌드 #${BUILD_NUM}'

    # 앱 시작
    if systemctl is-enabled --quiet ${SERVICE_NAME} 2>/dev/null; then
      sudo systemctl start ${SERVICE_NAME}
    else
      nohup java -jar ~/app.war --server.port=18080 > ~/app.log 2>&1 &
      echo \"PID: \$!\"
    fi
  "

else
  echo "❌ 알 수 없는 TARGET: $TARGET (frontend 또는 backend 중 하나여야 함)"
  exit 1
fi

echo "✅ Rollback 완료 — ${TARGET} 빌드 #${BUILD_NUM}"
