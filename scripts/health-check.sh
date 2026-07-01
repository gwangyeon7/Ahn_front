#!/bin/bash
# health-check.sh
# 사용법: ./scripts/health-check.sh <URL> <RETRY_COUNT> <INTERVAL_SEC>
#
# URL 이 HTTP 200 을 반환할 때까지 재시도.
# RETRY_COUNT 번 모두 실패하면 non-zero 종료 → 파이프라인 실패 처리

set -euo pipefail

URL="$1"
RETRY_COUNT="${2:-10}"
INTERVAL="${3:-5}"

echo "🔍 헬스 체크: $URL (최대 ${RETRY_COUNT}회, ${INTERVAL}초 간격)"

for i in $(seq 1 "$RETRY_COUNT"); do
  HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "$URL" || echo "000")
  if [ "$HTTP_STATUS" = "200" ]; then
    echo "✅ 헬스 체크 통과 (${i}회차) — HTTP $HTTP_STATUS"
    exit 0
  fi
  echo "⏳ ${i}/${RETRY_COUNT} — HTTP $HTTP_STATUS, ${INTERVAL}초 후 재시도..."
  sleep "$INTERVAL"
done

echo "❌ 헬스 체크 실패 — ${RETRY_COUNT}회 시도 후 응답 없음: $URL"
exit 1
