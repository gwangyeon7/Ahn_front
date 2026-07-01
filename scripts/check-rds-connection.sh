#!/bin/bash
# check-rds-connection.sh
# 사용법: ./scripts/check-rds-connection.sh <BE_HOST> <SSH_KEY> <REMOTE_USER> <RDS_HOST> <RDS_PORT> <RDS_USER> <RDS_PASSWORD>
#
# 백엔드 EC2 에서 RDS 로 TCP 연결이 가능한지 확인.
# mysql 클라이언트가 있으면 "SELECT 1" 까지 검증.

set -euo pipefail

BE_HOST="$1"
SSH_KEY="$2"
REMOTE_USER="$3"
RDS_HOST="$4"
RDS_PORT="${5:-3306}"
RDS_USER="$6"
RDS_PASSWORD="$7"

SSH_OPTS="-i $SSH_KEY -o StrictHostKeyChecking=no -o ConnectTimeout=30"

echo "🔍 RDS 연결 확인 — ${BE_HOST} → ${RDS_HOST}:${RDS_PORT}"

ssh $SSH_OPTS "${REMOTE_USER}@${BE_HOST}" "
  set -e
  RDS_HOST='${RDS_HOST}'
  RDS_PORT='${RDS_PORT}'
  RDS_USER='${RDS_USER}'
  RDS_PASSWORD='${RDS_PASSWORD}'

  # 1. TCP 포트 연결 확인
  echo '⏳ TCP 연결 확인 중...'
  if timeout 10 bash -c \"echo > /dev/tcp/\$RDS_HOST/\$RDS_PORT\" 2>/dev/null; then
    echo '✅ TCP 연결 성공'
  else
    echo '❌ TCP 연결 실패 — RDS 보안그룹 또는 네트워크 확인 필요'
    exit 1
  fi

  # 2. MySQL 클라이언트로 SELECT 1 확인 (설치돼 있을 때만)
  if command -v mysql >/dev/null 2>&1; then
    echo '⏳ MySQL SELECT 1 확인 중...'
    RESULT=\$(mysql -h \"\$RDS_HOST\" -P \"\$RDS_PORT\" -u \"\$RDS_USER\" -p\"\$RDS_PASSWORD\" \
      --connect-timeout=10 -e 'SELECT 1 AS ok;' --skip-column-names 2>/dev/null || echo 'FAIL')
    if [ \"\$RESULT\" = '1' ]; then
      echo '✅ DB 쿼리 성공 (SELECT 1 = 1)'
    else
      echo '⚠️  TCP 는 열려있지만 DB 인증/쿼리 실패 (자격증명 또는 DB명 확인)'
      exit 1
    fi
  else
    echo 'ℹ️  mysql 클라이언트 없음 — TCP 확인만 수행'
  fi
"

echo "✅ RDS 연결 확인 완료"
