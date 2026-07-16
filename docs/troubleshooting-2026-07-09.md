# 트러블슈팅 기록 — 2026-07-09

## 1. AWS RDS → EC2 로컬 MariaDB 마이그레이션 (비용 최적화)

**배경**
AWS 무료 티어 만료 및 RDS 비용 과다 발생(~$47/월). EC2 내부에 MariaDB를 직접 설치하여 RDS를 대체함.

**작업 내용**

1. RDS에서 전체 DB 덤프
```bash
mysqldump -h <RDS_ENDPOINT> -u Ahnjungyeon -p safelinkdb > backup.sql
```

2. EC2에 MariaDB 설치 및 복원
```bash
sudo apt install mariadb-server -y
mysql -u root -p -e "CREATE DATABASE safelinkdb; CREATE USER 'Ahnjungyeon'@'localhost' IDENTIFIED BY 'roqudtls'; GRANT ALL ON safelinkdb.* TO 'Ahnjungyeon'@'localhost';"
mysql -u Ahnjungyeon -p safelinkdb < backup.sql
```

3. systemd 서비스 파일의 DB 연결 정보 변경
```ini
Environment="SPRING_DATASOURCE_URL=jdbc:mariadb://localhost:3306/safelinkdb?useSSL=false&serverTimezone=Asia/Seoul&allowPublicKeyRetrieval=true"
```

**결과**
- RDS 비용 제거, EC2 t2.micro 단일 서버로 운영
- 8개 테이블 전체 무중단 이전 완료
- DBeaver SSH 터널로 로컬 MariaDB 원격 모니터링 연결

---

## 2. SBOM 취약점 분석 파이프라인 FAILED 원인 분석 및 수정

**증상**
파일 업로드 후 분석 상태가 항상 `FAILED`로 반환됨.

**원인 파악 과정**

`analyzeFileInBackground()`에서 예외를 catch하고 상태만 `FAILED`로 변경하고 있어 실제 에러가 로그에 출력되지 않았음.

```java
// 수정 전 — 에러 원인 알 수 없음
} catch (Exception e) {
    updateFileStatus(fileSeq, "FAILED");
}
```

에러 로깅 추가 후 실제 원인 확인:
```
WARN current database is invalid error=the vulnerability database was built 1 week ago (max allowed age is 5 days)
ERROR unable to download db: write /home/ubuntu/.cache/grype/db/...: no space left on device
```

**원인**
- Grype 취약점 DB가 5일 초과 (만료)
- EC2 루트 디스크 사용률 98% → 새 DB 다운로드 불가

**해결**

1. 임시 파일 정리 후 Grype DB 갱신
```bash
sudo rm -rf /tmp/sbom-extract-* /tmp/sbom-uploads/* /tmp/syft-sbom-*
rm -rf ~/.cache/grype/db/*
grype db update
```

2. Grype DB 자동 갱신 크론잡 등록 (매일 새벽 3시)
```bash
crontab -e
# 추가:
0 3 * * * /usr/local/bin/grype db update
```

3. ProcessBuilder에 syft/grype 절대 경로 지정 (PATH 의존 제거)
```java
// 수정 전
new ProcessBuilder("syft", ...)
// 수정 후
new ProcessBuilder("/usr/local/bin/syft", ...)
```

**결과**
ZIP 파일 업로드 → Syft SBOM 생성 → Grype CVE 분석 → DB 저장 파이프라인 정상 동작 확인.

---

## 3. 배포 누락 파일로 인한 API 404 (FindIdController)

**증상**
아이디 찾기 API `/api/find-id` 가 404 반환. DB에는 정상 데이터 존재.

**원인 파악 과정**

1. DB 직접 쿼리 → 데이터 정상 확인
```sql
SELECT memb_id, memb_nm, memb_email FROM memb_mg WHERE memb_nm='안정연' AND memb_email='h625062@gmail.com';
-- 4건 반환
```

2. 백엔드 직접 curl → 404 확인
```bash
curl -X POST http://localhost:18080/api/find-id -H "Content-Type: application/json" \
  -d '{"membNm":"안정연","membEmail":"h625062@gmail.com"}'
# {"status":404,"error":"Not Found"}
```

3. JAR 내 클래스 확인
```bash
jar tf /home/ubuntu/app.jar | grep FindId
# 아무것도 출력되지 않음 → JAR에 클래스 미포함
```

**원인**
`FindIdController.java`가 EC2 서버에 직접 작성되어 있었으나 GitHub에 커밋되지 않음. GitHub Actions는 GitHub 저장소 코드 기준으로 빌드하므로 해당 파일이 JAR에서 누락됨.

**해결**
로컬 저장소에 `FindIdController.java` 추가 → 커밋/푸시 → PR → 머지 → 재배포.

**결과**
`jar tf app.jar | grep FindId` 로 클래스 포함 확인 후 API 정상 동작.

**교훈**
EC2 서버에 직접 소스 수정 시 반드시 GitHub에도 동일하게 커밋해야 함. CI/CD 환경에서는 서버의 로컬 소스가 아닌 저장소 코드가 배포 기준이 됨.

---

## 핵심 교훈

| 상황 | 원인 | 해결 |
|------|------|------|
| RDS 비용 과다 | 인스턴스 상시 가동 과금 | EC2 내부 MariaDB로 대체 |
| 파일 분석 FAILED | 예외 로깅 없음 + Grype DB 만료 | 에러 로깅 추가 + DB 자동 갱신 크론잡 |
| API 404 (아이디 찾기) | EC2 직접 작성 파일이 GitHub 미반영 | CI/CD 환경에서 서버 직접 수정 금지 |
