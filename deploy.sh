#!/bin/bash

echo "🚀 1단계: 프로젝트 빌드를 시작합니다..."
npm run build

echo "📦 2단계: 빌드된 파일을 AWS 서버로 전송합니다..."
# 파트너님의 실제 키 경로와 서버 주소를 그대로 넣었습니다.
scp -i ~/Downloads/safelink-key.pem -r ./dist ubuntu@13.125.11.130:/home/ubuntu/

echo "✅ 배포가 완료되었습니다! 이제 사이트를 확인해보세요."
