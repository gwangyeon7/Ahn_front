import React, { useState } from "react";
import CommonStyle from "../../styles/CommonStyle";
import { useNavigate } from "react-router-dom";
import { signUpApiCall } from "../../services/_private/SignUp/SignUpApi";

export default function SignUp() {
  const navigate = useNavigate();
  // 입력값 상태 관리
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    name: "",
    email: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSignUp = async () => {
    // 간단한 유효성 검사
    // formData거 가져다 쓴다
    const { id, password, name, email } = formData;
    if (!id || !password || !name || !email) {
      alert("모든 정보를 입력해주세요.");
      return;
    }

    try {
      const result = await signUpApiCall({ id, password, name, email });

      if (result && result.status === "success") {
        alert("회원가입이 완료되었습니다! 로그인 해주세요.");
        navigate("/login"); // 성공 시 로그인 페이지로 이동
      } else {
        alert(result.message || "회원가입 실패");
      }
    } catch (error) {
      alert("예기치 못한 오류가 발생했습니다.");
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
      maxWidth: "450px", // 로그인보다 살짝 넓게 설정
      padding: "50px 40px",
      backgroundColor: CommonStyle.colors.white,
      borderRadius: CommonStyle.Radius.card,
      boxShadow: "0 10px 25px rgba(0, 0, 0, 0.05)",
      textAlign: "center" as const,
    },
    title: {
      fontSize: "32px",
      fontWeight: "900",
      color: CommonStyle.colors.mainNavy,
      marginBottom: "10px",
    },
    subtitle: {
      fontSize: "14px",
      color: CommonStyle.colors.textGray,
      marginBottom: "30px",
    },
    input: {
      width: "100%",
      padding: "14px",
      marginBottom: "10px",
      backgroundColor: CommonStyle.colors.white,
      border: `1px solid ${CommonStyle.colors.border}`,
      borderRadius: CommonStyle.Radius.input,
      fontSize: "15px",
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
      marginTop: "20px",
    },
    backLink: {
      marginTop: "20px",
      fontSize: "14px",
      color: CommonStyle.colors.textGray,
      cursor: "pointer",
      display: "block",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Create Account</h1>
        <p style={styles.subtitle}>
          ZCS 서비스 이용을 위해 정보를 입력해주세요.
        </p>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            name="name"
            placeholder="Name"
            style={styles.input}
            onChange={handleChange}
          />
          <input
            name="id"
            placeholder="ID"
            style={styles.input}
            onChange={handleChange}
          />
          <input
            name="email"
            type="email"
            placeholder="Email Address"
            style={styles.input}
            onChange={handleChange}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            style={styles.input}
            onChange={handleChange}
          />
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            style={styles.input}
            onChange={handleChange}
          />

          <button style={styles.button} onClick={handleSignUp}>
            Sign Up
          </button>
        </div>

        <span style={styles.backLink} onClick={() => navigate("/login")}>
          이미 계정이 있으신가요? <b>로그인으로 돌아가기</b>
        </span>
      </div>
    </div>
  );
}
