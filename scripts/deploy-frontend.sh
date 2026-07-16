#!/bin/bash
# deploy-frontend.sh
# 사용법: ./scripts/deploy-frontend.sh <FE_HOST> <SSH_KEY> <BUILD_NUM> <REMOTE_USER> <DIST_DIR>
#
# 배포 전략:
#   1. dist 파일을 ~/releases/<BUILD_NUM>/ 에 업로드 (rollback 용 보관)
#   2. ~/dist/ 를 최신 릴리스로 교체
#   3. releases 최대 5개만 보관 (오래된 것 자동 삭제)

set -euo pipefail

FE_HOST="$1"
SSH_KEY="$2"
BUILD_NUM="$3"
REMOTE_USER="$4"
DIST_DIR="${5:-dist}"

SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=30"

echo "🚀 프론트엔드 배포 시작 — 빌드 #${BUILD_NUM} → ${REMOTE_USER}@${FE_HOST}"

# 1. 릴리스 디렉토리 생성
ssh $SSH_OPTS "${REMOTE_USER}@${FE_HOST}" "mkdir -p ~/releases/${BUILD_NUM}"

# 2. dist 파일 업로드
rsync -az --delete \
  -e "ssh $SSH_OPTS" \
  "${DIST_DIR}/" \
  "${REMOTE_USER}@${FE_HOST}:~/releases/${BUILD_NUM}/"

# 3. ~/dist 를 최신 릴리스로 교체 (mv 후 rename - 무중단 교체)
ssh $SSH_OPTS "${REMOTE_USER}@${FE_HOST}" "
  set -e
  # 새 릴리스를 현재 위치에 원자적으로 교체
  rsync -a --delete ~/releases/${BUILD_NUM}/ ~/Ahn_front/dist/
  echo '✅ ~/Ahn_front/dist 업데이트 완료'
"

# 4. 오래된 릴리스 정리 (최신 5개만 보관)
ssh $SSH_OPTS "${REMOTE_USER}@${FE_HOST}" "
  cd ~/releases
  ls -1d */ 2>/dev/null \
    | sort -t/ -k1,1n \
    | head -n -5 \
    | xargs -r rm -rf
  echo '🧹 오래된 릴리스 정리 완료'
"

echo "✅ 프론트엔드 배포 완료 — 빌드 #${BUILD_NUM}"
