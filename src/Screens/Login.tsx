import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const loc = useLocation() as any;

  const [id, setId] = useState("");
  const [pw, setPw] = useState("");

  const after = loc.state?.afterUploadGo ?? "/app/dashboard";

  return (
    <div style={s.shell}>
      <div style={s.card}>
        <h1 style={s.title}>로그인</h1>
        <p style={s.sub}>데모용 로그인입니다. (서버 인증은 추후 연동)</p>

        <label style={s.label}>아이디</label>
        <input style={s.input} value={id} onChange={(e) => setId(e.target.value)} placeholder="admin 또는 사용자명" />

        <label style={s.label}>비밀번호</label>
        <input
          style={s.input}
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="아무 값"
          type="password"
        />

        <button
          style={s.btn}
          type="button"
          onClick={() => {
            const ok = login(id, pw);
            if (!ok) return alert("아이디/비밀번호를 입력하세요.");
            nav(after);
          }}
        >
          로그인
        </button>

        <button style={s.ghost} type="button" onClick={() => nav("/")}>
          ← 랜딩으로
        </button>
      </div>
    </div>
  );
}

const s: Record<string, any> = {
  shell: { minHeight: "100vh", display: "grid", placeItems: "center", background: "#0b0f14" },
  card: {
    width: 420,
    borderRadius: 18,
    border: "1px solid #1f2937",
    background: "#020617",
    padding: 20,
  },
  title: { margin: 0, fontSize: 22, fontWeight: 950 },
  sub: { margin: "8px 0 16px", fontSize: 12, color: "#94a3b8" },
  label: { display: "block", marginTop: 10, marginBottom: 6, fontSize: 12, color: "#cbd5e1", fontWeight: 900 },
  input: {
    width: "100%",
    padding: "12px 12px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    outline: "none",
  },
  btn: {
    width: "100%",
    marginTop: 16,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,150,0.35)",
    background: "rgba(255,120,150,0.10)",
    color: "#ffd1dc",
    fontWeight: 950,
    cursor: "pointer",
  },
  ghost: {
    width: "100%",
    marginTop: 10,
    padding: "12px 14px",
    borderRadius: 14,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    fontWeight: 900,
    cursor: "pointer",
  },
};
