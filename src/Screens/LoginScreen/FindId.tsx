import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CommonStyle from "../../styles/CommonStyle";
import { findIdApiCall } from "../../services/_private/FindId/FindIdApi";

export default function FindId() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    found: boolean;
    maskedId?: string;
  } | null>(null);

  const handleSubmit = async () => {
    if (!name || !email) {
      alert("이름과 이메일을 입력해주세요.");
      return;
    }

    setLoading(true);
    try {
      const response = await findIdApiCall(name, email);
      if (response && response.success === true && response.data?.membId) {
        setResult({ found: true, maskedId: response.data.membId });
      } else {
        setResult({ found: false });
      }
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
    resultBox: {
      padding: "20px",
      backgroundColor: CommonStyle.colors.background,
      borderRadius: CommonStyle.Radius.input,
      marginBottom: "20px",
    },
    resultId: {
      fontSize: "20px",
      fontWeight: "900",
      color: CommonStyle.colors.mainNavy,
      marginTop: "8px",
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
        <h1 style={styles.title}>아이디 찾기</h1>

        {result ? (
          result.found ? (
            <div style={styles.resultBox}>
              <p style={styles.subtitle}>회원님의 아이디입니다.</p>
              <p style={styles.resultId}>{result.maskedId}</p>
            </div>
          ) : (
            <p style={styles.subtitle}>
              일치하는 회원 정보를 찾을 수 없습니다.
              <br />
              이름과 이메일을 다시 확인해주세요.
            </p>
          )
        ) : (
          <>
            <p style={styles.subtitle}>
              가입 시 입력한 이름과 이메일을 입력해주세요.
            </p>
            <input
              type="text"
              placeholder="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={styles.input}
            />
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
              {loading ? "확인 중..." : "아이디 찾기"}
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
