import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonStyle from "../../styles/CommonStyle";
import { requestPasswordReset } from "../../services/_private/PasswordReset/PasswordResetApi";

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      alert("이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      await requestPasswordReset(email);
      // 보안상 가입 여부와 무관하게 항상 동일한 안내를 보여줌
      setSubmitted(true);
    } catch (error) {
      alert("요청 처리 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: CommonStyle.colors.background,
      fontFamily: "sans-serif",
    },
    card: {
      width: "100%",
      maxWidth: "400px",
      padding: "50px 40px",
      backgroundColor: CommonStyle.colors.white,
      borderRadius: CommonStyle.Radius.card,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      textAlign: "center" as const,
    },
    title: {
      fontSize: "28px",
      fontWeight: "900",
      color: CommonStyle.colors.mainNavy,
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "14px",
      color: CommonStyle.colors.textGray,
      marginBottom: "30px",
      lineHeight: 1.5,
    },
    input: {
      width: "100%",
      padding: "16px",
      marginBottom: "12px",
      backgroundColor: CommonStyle.colors.white,
      border: `1px solid ${CommonStyle.colors.border}`,
      borderRadius: CommonStyle.Radius.input,
      color: CommonStyle.colors.mainNavy,
      fontSize: "16px",
      outline: "none",
      boxSizing: "border-box" as const,
    },
    button: {
      width: "100%",
      padding: "16px",
      backgroundColor: CommonStyle.colors.mainNavy,
      color: "white",
      border: "none",
      borderRadius: CommonStyle.Radius.button,
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      marginTop: "10px",
    },
    backLink: {
      marginTop: "24px",
      fontSize: "14px",
      color: CommonStyle.colors.textGray,
      cursor: "pointer",
      display: "block",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>비밀번호 재설정</h1>

        {submitted ? (
          <p style={styles.subtitle}>
            입력하신 이메일로 비밀번호 재설정 링크를 보냈습니다.
            <br />
            메일함(스팸 메일함 포함)을 확인해주세요.
          </p>
        ) : (
          <>
            <p style={styles.subtitle}>
              가입하신 이메일 주소를 입력하시면
              <br />
              재설정 링크를 보내드려요.
            </p>
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
            />
            <button
              style={{ ...styles.button, opacity: loading ? 0.6 : 1 }}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "전송 중..." : "재설정 링크 보내기"}
            </button>
          </>
        )}

        <span style={styles.backLink} onClick={() => navigate("/login")}>
          로그인으로 돌아가기
        </span>
      </div>
    </div>
  );
}
