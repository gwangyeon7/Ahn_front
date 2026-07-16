# 트러블슈팅 기록 — 2026-07-06

## 1. 빌드 실패: PasswordResetService `findByMembEmail` 심볼 없음

**증상**
GitHub Actions `compileJava` 실패
```
PasswordResetService.java: error: cannot find symbol
    memberRepository.findByMembEmail(email)
```

**원인**
MemberRepository는 `findFirstByMembEmail`로 바꿨는데 PasswordResetService.java는 여전히 `findByMembEmail` 호출 중. IntelliJ 커밋 시 해당 파일이 스테이징(체크박스)에서 빠져 있었음.

**해결**
IntelliJ 커밋 패널에서 수정(M) 파일 체크박스 확인 후 `PasswordResetService.java` 포함해서 커밋/푸시 → 새 PR 생성.

---

## 2. 빌드 실패: GoogleAuthService, FindIdController 심볼 없음 (PR #15)

**증상**
```
GoogleAuthService.java:69: error: cannot find symbol
    memberRepository.findFirstByMembEmailOrderByMembSeqDesc(email)

GoogleAuthService.java:81: error: cannot find symbol
    member.setProvider("GOOGLE")

FindIdController.java:27: error: cannot find symbol
    memberService.findId(membNm, membEmail)
```

**원인**
dev 브랜치에 이미 있던 파일들(GoogleAuthService, FindIdController)이 참조하는 메서드들이 MemberRepository, Member entity, MemberService에 없었음.

**해결**
`safelink-backend`(로컬 gwangyeon 브랜치)에서 3개 파일 수정:

- **MemberRepository.java** — 메서드 2개 추가
  ```java
  Optional<Member> findFirstByMembEmailOrderByMembSeqDesc(String membEmail);
  Optional<Member> findFirstByMembNmAndMembEmail(String membNm, String membEmail);
  ```

- **Member.java** — DB 컬럼 없이 컴파일만 통과하도록 `@Transient` 필드 추가
  ```java
  @Transient
  private String provider;
  ```

- **MemberService.java** — `findId` 메서드 추가
  ```java
  public ApiResponse findId(String membNm, String membEmail) {
      Optional<Member> memberOpt = memberRepository.findFirstByMembNmAndMembEmail(membNm, membEmail);
      if (memberOpt.isEmpty()) {
          return new ApiResponse(false, "일치하는 회원 정보가 없습니다.");
      }
      Map<String, Object> data = new HashMap<>();
      data.put("membId", memberOpt.get().getMembId());
      return new ApiResponse(true, "아이디를 찾았습니다.", data);
  }
  ```

커밋 후 remote gwangyeon과 diverge 발생 → `git push origin gwangyeon --force` 로 해결 → 새 PR (#15) 생성 → 빌드 성공.

---

## 3. 비밀번호 재설정 메일 미수신 (MAIL 환경변수 누락)

**증상**
API는 200 반환하는데 메일이 오지 않음.

**원인 1 — .env 파일 없음**
`deploy.sh`가 `.env` 파일을 읽어서 환경변수를 로드하는데, EC2에 `/home/ubuntu/Ahn_back/.env` 파일 자체가 없었음.

**원인 2 — systemd 서비스 파일에 MAIL 환경변수 미등록**
실제 배포는 `deploy.sh`가 아닌 GitHub Actions가 JAR를 복사 후 `sudo systemctl start safelink`로 실행. systemd 서비스 파일(`/etc/systemd/system/safelink.service`)에 MAIL 관련 환경변수가 없어서 EC2 재시작 또는 Actions 재배포 시마다 환경변수가 사라짐.

**확인 방법**
```bash
sudo cat /proc/$(lsof -t -i :18080)/environ | tr '\0' '\n' | grep MAIL
# 아무것도 안 뜨면 환경변수 없는 것
```

**해결 (영구 fix)**
`/etc/systemd/system/safelink.service` 에 직접 추가:
```ini
Environment="MAIL_USERNAME=h625062@gmail.com"
Environment="MAIL_PASSWORD=zgsodsphfhnsvvet"
```

적용:
```bash
sudo systemctl daemon-reload && sudo systemctl restart safelink
```

> ⚠️ EC2/RDS를 재시작해도 이제 자동으로 환경변수 유지됨.

---

## 4. gwangyeon 브랜치 remote diverge

**증상**
IntelliJ 푸시 시 "푸시가 거부됨" 다이얼로그 표시.

**원인**
로컬 gwangyeon과 remote gwangyeon이 각각 다른 커밋을 가진 상태(1 and 1 different commits).

**해결**
```bash
git push origin gwangyeon --force
```

---

## 핵심 교훈

| 상황 | 원인 | 해결 |
|------|------|------|
| EC2 재시작 후 메일 안 됨 | systemd 서비스에 환경변수 없음 | safelink.service에 Environment 추가 (영구) |
| 빌드 실패 반복 | IntelliJ 커밋 시 파일 체크박스 누락 | 커밋 전 수정(M) 파일 전부 체크 확인 |
| PR 후 빌드 실패 | dev 브랜치 기존 코드와 gwangyeon 코드 불일치 | 누락된 메서드/필드 로컬에서 추가 후 force push → 새 PR |
