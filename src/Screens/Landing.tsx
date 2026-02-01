import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const SS_KEY = "sbom_uploaded_file_name";

export default function Landing() {
  const nav = useNavigate();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [picked, setPicked] = useState<string | null>(null);

  const onPick = () => inputRef.current?.click();

  const onFile = (f: File | null) => {
    if (!f) return;
    // 보완: 업로드 파일 타입 체크(데모)
    const ok = f.name.endsWith(".json") || f.name.endsWith(".xml");
    if (!ok) {
      alert("SBOM 파일(json/xml)을 업로드하세요.");
      return;
    }
    sessionStorage.setItem(SS_KEY, f.name);
    setPicked(f.name);

    // 보완: “체험” 흐름은 로그인 후 대시보드로
    nav("/login", { state: { afterUploadGo: "/app/dashboard" } });
  };

  return (
    <div style={s.shell}>
      <header style={s.header}>
        <div style={s.headerLeft}>
          <div style={s.brandIcon}>SB</div>
          <div style={s.brandText}>
            <div style={s.brandTitle}>SBOM Security Dashboard</div>
            <div style={s.brandSub}>공급망 취약점 가시화 · 추이 관리</div>
          </div>
        </div>

        <button style={s.headerBtn} onClick={() => nav("/login")} type="button">
          로그인
        </button>
      </header>

      <div style={s.hero}>
        <div style={s.copy}>
          <div style={s.kicker}>SBOM 기반 공급망 보안</div>
          <h1 style={s.title}>
            취약점을 “한 번에”
            <br />
            찾고, 추이로 관리하세요
          </h1>
          <p style={s.desc}>
            Syft로 라이브러리 목록을 만들고, Grype로 취약점을 분석한 뒤
            대시보드에서 치명/높음 취약점을 최우선으로 강조합니다.
          </p>

          <div style={s.reasonGrid}>
            <Reason title="실시간 요약" desc="전체/취약점/치명 수를 한 화면에서 확인" />
            <Reason title="취약점 추이" desc="스캔별 변화(증가/감소)를 시각화" />
            <Reason title="조치 우선순위" desc="치명/높음 중심으로 Top 리스트 제공" />
          </div>

          <div style={s.ctaRow}>
            <button type="button" style={s.ctaPrimary} onClick={onPick}>
              체험하기 (SBOM 업로드)
            </button>
            <button type="button" style={s.ctaGhost} onClick={() => nav("/login")}>
              데모 로그인
            </button>
          </div>

          {picked && <div style={s.picked}>선택된 파일: {picked}</div>}

          <input
            ref={inputRef}
            type="file"
            accept=".json,.xml"
            style={{ display: "none" }}
            onChange={(e) => onFile(e.target.files?.[0] ?? null)}
          />
        </div>

        {/* 오른쪽 쇼룸 “이미지 자리” (실제 이미지는 나중에 넣으면 됨) */}
        <div style={s.visual}>
          <div style={s.visualCard}>
            <div style={s.visualTitle}>취약점 하이라이트</div>
            <div style={s.visualSub}>치명/높음 중심으로 강조</div>
            <div style={s.visualMock} />
          </div>
        </div>
      </div>
    </div>
  );
}

function Reason({ title, desc }: { title: string; desc: string }) {
  return (
    <div style={s.reasonCard}>
      <div style={s.reasonTitle}>{title}</div>
      <div style={s.reasonDesc}>{desc}</div>
    </div>
  );
}

const s: Record<string, any> = {
  shell: { minHeight: "100vh", background: "#0b0f14", color: "#e5e7eb" },
  header: {
    height: 72,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
    borderBottom: "1px solid #1f2937",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  brandIcon: {
    width: 40, height: 40, borderRadius: 12, background: "#2563eb",
    display: "grid", placeItems: "center", fontWeight: 900, color: "#fff",
  },
  brandText: { display: "flex", flexDirection: "column", gap: 2 },
  brandTitle: { fontWeight: 950 },
  brandSub: { fontSize: 12, color: "#94a3b8" },
  headerBtn: {
    padding: "10px 14px", borderRadius: 12, border: "1px solid #1f2937",
    background: "#0b1220", color: "#e5e7eb", cursor: "pointer", fontWeight: 900,
  },

  hero: {
    display: "grid",
    gridTemplateColumns: "1.1fr 0.9fr",
    gap: 18,
    padding: 24,
    maxWidth: 1200,
    margin: "0 auto",
  },

  copy: {
    borderRadius: 18,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #020617, #0b0f14)",
    padding: 22,
  },
  kicker: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    border: "1px solid rgba(255,120,150,0.35)",
    background: "rgba(255,120,150,0.10)",
    color: "#ffd1dc",
    fontWeight: 900,
    fontSize: 12,
  },
  title: { margin: "14px 0 10px", fontSize: 44, lineHeight: 1.05, fontWeight: 950 },
  desc: { margin: 0, color: "#cbd5e1", lineHeight: 1.6 },

  reasonGrid: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 16 },
  reasonCard: { padding: 14, borderRadius: 14, border: "1px solid #1f2937", background: "#0b1220" },
  reasonTitle: { fontWeight: 950 },
  reasonDesc: { marginTop: 6, fontSize: 12, color: "#94a3b8", lineHeight: 1.4 },

  ctaRow: { display: "flex", gap: 12, marginTop: 18, alignItems: "center" },
  ctaPrimary: {
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid rgba(255,120,150,0.35)",
    background: "rgba(255,120,150,0.10)",
    color: "#ffd1dc",
    cursor: "pointer",
    fontWeight: 950,
  },
  ctaGhost: {
    padding: "12px 16px",
    borderRadius: 14,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
  },
  picked: { marginTop: 12, fontSize: 12, color: "#94a3b8" },

  visual: {
    borderRadius: 18,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #0b1220, #020617)",
    padding: 18,
    display: "grid",
    placeItems: "center",
  },
  visualCard: { width: "100%" },
  visualTitle: { fontWeight: 950, fontSize: 16 },
  visualSub: { marginTop: 6, fontSize: 12, color: "#94a3b8" },
  visualMock: {
    marginTop: 14,
    height: 320,
    borderRadius: 16,
    border: "1px solid #1f2937",
    background:
      "radial-gradient(circle at 30% 30%, rgba(96,165,250,0.22), transparent 55%), radial-gradient(circle at 70% 55%, rgba(255,120,150,0.18), transparent 55%), linear-gradient(180deg, #0b0f14, #020617)",
  },
};
