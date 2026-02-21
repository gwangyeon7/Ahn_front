import React, { useState } from "react";
import CommonStyle from "../../styles/CommonStyle";
import { loginApiCall } from "../../services/_private/Login/LoginApi";

export default function Login() {
  const [id, setId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    //간단히 loginApicall을 부르기위한

    if (!id || !password) {
      alert("아이디와 비밀번호를 입력해주세요.");
      return;
    } // 빈칸인지 아닌지 검사하기
    try {
      const resault = await loginApiCall(id, password); // loginApi.ts한테 아이디 비번 가지고 서버에서 맞는지 확인해라

      if (resault && resault.status === "success") {
        alert(`${id}님, 로그인 성공!`); // 여기서 영어일때 ₩키누르면 백틱 표시 백틱은 안에 진짜 데이터 값이 들어간다는 표시
      } else {
        alert(resault?.message || "로그인 정보를 확인해주세요."); // 물음표를 쓰는이유는 값이 없을떄 강제꺼짐을 방지
      }
    } catch (error) {
      // 보험 인터넷 끊김등의 예기치 못한 사고일때 멈추지 않게 잡기위함
      alert("서버와 통신이 원활하지 않습니다.");
    }
  };

  const styles = {
    container: {
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: CommonStyle.colors.background, // 설정값 사용
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
      fontSize: "42px",
      fontWeight: "900",
      color: CommonStyle.colors.mainNavy,
      marginBottom: "40px",
      letterSpacing: "1px",
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
      transition: "border-color 0.2s",
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
      transition: "background-color 0.3s",
    },
    footer: {
      marginTop: "30px",
      display: "flex",
      justifyContent: "center",
      gap: "15px",
      fontSize: "14px",
      color: CommonStyle.colors.textGray,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>ZCS</h1>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            type="text"
            placeholder="ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            style={styles.input}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = CommonStyle.colors.mainNavy)
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = CommonStyle.colors.border)
            }
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={styles.input}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = CommonStyle.colors.mainNavy)
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = CommonStyle.colors.border)
            }
          />

          <button
            style={styles.button}
            onClick={handleLogin}
            onMouseOver={(e) =>
              (e.currentTarget.style.backgroundColor =
                CommonStyle.colors.darkNavy)
            }
            onMouseOut={(e) =>
              (e.currentTarget.style.backgroundColor =
                CommonStyle.colors.mainNavy)
            }
          >
            Sign In
          </button>
        </div>

        <div style={styles.footer}>
          <span style={{ cursor: "pointer" }}>아이디 찾기</span>
          <span style={{ color: CommonStyle.colors.divider }}>|</span>
          <span style={{ cursor: "pointer" }}>비밀번호 재설정</span>
          <span style={{ color: CommonStyle.colors.divider }}>|</span>
          <span
            style={{
              cursor: "pointer",
              fontWeight: "bold",
              color: CommonStyle.colors.mainNavy,
            }}
          >
            회원가입
          </span>
        </div>
      </div>
    </div>
  );
}
