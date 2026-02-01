import { useMemo, useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";



type Severity = "치명" | "높음" | "중간" | "낮음";

type VulnRow = {
  library: string;
  version: string;
  cve: string;
  severity: Severity;
  cvss: number;
  fixedVersion: string;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const stats = useMemo(
    () => ({
      totalLibs: 1302,
      vulnTotal: 243,
      critical: 75,
      high: 168,
      decrease: "31%",
      lastScanAt: "2026.01.16 09:00",
      project: "My SBOM Project",
    }),
    []
  );

  const vulnRows: VulnRow[] = useMemo(
    () => [
      { library: "log4j", version: "2.14.1", cve: "CVE-2021-44228", severity: "치명", cvss: 10.0, fixedVersion: "2.17.1" },
      { library: "jackson-databind", version: "2.9.9", cve: "CVE-2019-12384", severity: "높음", cvss: 9.8, fixedVersion: "2.10.0" },
      { library: "spring-webmvc", version: "5.3.10", cve: "CVE-2022-22965", severity: "높음", cvss: 9.1, fixedVersion: "5.3.18" },
      { library: "tomcat", version: "9.0.54", cve: "CVE-2022-23181", severity: "중간", cvss: 6.5, fixedVersion: "9.0.63" },
    ], 
    []
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vulnRows;
    return vulnRows.filter(
      (r) =>
        r.library.toLowerCase().includes(q) ||
        r.cve.toLowerCase().includes(q) ||
        r.severity.toLowerCase().includes(q)
    );
  }, [query, vulnRows]);

  return (
    <div style={s.shell}>

      {/* Main */}
      <main style={s.main}>
        {/* Topbar */}
        <header style={s.topbar}>
          <div>
            <div style={s.pageTitle}>{stats.project}</div>
            <div style={s.pageSub}>
              마지막 검사: <b>{stats.lastScanAt}</b>
            </div>
          </div>

          <div style={s.topbarRight}>
            <div style={s.userBox}>
              <div style={s.avatar}>조</div>
              <div>
                <div style={s.userName}>조아무개</div>
                <div style={s.userRole}>관리자</div>
              </div>
            </div>

            <button style={s.primaryBtn} onClick={() => navigate("/scans")} type="button">
              SBOM 검사
            </button>
          </div>
        </header>

        {/* KPI row: 취약점 우선순위로 배치 */}
        <section style={s.kpiRow}>
          <KpiCard
            title="취약점(총)"
            value={stats.vulnTotal.toLocaleString()}
            sub="Grype 결과"
            onClick={() => navigate("/vulnerabilities")}
            tone="vuln"
          />
          <KpiCard
            title="치명"
            value={stats.critical.toLocaleString()}
            sub="즉시 조치 필요"
            onClick={() => navigate("/vulnerabilities")}
            tone="critical"
          />
          <KpiCard
            title="전체 라이브러리"
            value={stats.totalLibs.toLocaleString()}
            sub="Syft 결과"
            onClick={() => navigate("/libraries")}
            tone="neutral"
          />
        </section>

        {/* HERO: 취약점 추이를 가장 크게, 가장 눈에 띄게 */}
<section style={s.heroGrid}>
  {/* ✅ 취약점 추이 + 검사이력 요약 위에 가로 전체 업로드 바 */}
  <div style={{ gridColumn: "1 / -1" }}>
    <UploadBar />
  </div>

  {/* 왼쪽: 취약점 추이 */}
  <div style={s.vulnHero}>
    {/* ✅ 여기에는 기존 취약점 추이 내용이 들어가야 함 */}
    <div style={s.heroHeader}>
      <div>
        <div style={s.heroTitleRow}>
          <div style={s.heroTitle}>취약점 추이</div>
          <div style={s.badge}>HIGH FOCUS</div>
        </div>
        <div style={s.sub}>치명/높음 변화 추적</div>
      </div>

      <button
        style={s.linkBtnStrong}
        onClick={() => navigate("/app/vulnerabilities")}
        type="button"
      >
        취약점 전체 →
      </button>
    </div>

    <div style={s.chartMock}>
      <div style={s.chartGlow} />
      <div style={s.chartNote}>차트는 다음 단계에서 recharts로 연결</div>
    </div>

    <div style={s.miniRow}>
      <MiniCard title="치명" value={stats.critical} kind="critical" />
      <MiniCard title="높음" value={stats.high} kind="high" />
      <MiniCard title="감소율(예시)" value={stats.decrease} kind="decrease" />
    </div>
  </div>

  {/* 오른쪽: 검사 이력 요약 */}
  <div style={s.panel}>
    {/* ✅ 여기에는 기존 검사 이력 요약 내용이 들어가야 함 */}
    <div style={s.panelHeader}>
      <div>
        <div style={s.panelTitle}>검사 이력 요약</div>
        <div style={s.panelSub}>projectInfo.json 기반(샘플)</div>
      </div>
      <button
        style={s.btn}
        type="button"
        onClick={() => navigate("/app/scans")}
      >
        이력 보기 →
      </button>
    </div>

    <div style={s.historyList}>
      <div style={s.historyRow}>
        <div>
          <div style={s.historyId}>ID 8</div>
          <div style={s.historyMeta}>조아무개 • 2026.01.16 09:00</div>
        </div>
        <div style={s.historyTarget}>/projects/my-sbom-project</div>
      </div>

      <div style={s.historyRow}>
        <div>
          <div style={s.historyId}>ID 7</div>
          <div style={s.historyMeta}>조아무개 • 2026.01.15 09:00</div>
        </div>
        <div style={s.historyTarget}>/projects/my-sbom-project</div>
      </div>

      <div style={s.historyRow}>
        <div>
          <div style={s.historyId}>ID 6</div>
          <div style={s.historyMeta}>김철수 • 2026.01.14 18:20</div>
        </div>
        <div style={s.historyTarget}>/projects/legacy-api</div>
      </div>
    </div>
  </div>
</section>


        {/* Table */}
        <section style={s.panel}>
          <div style={s.panelHeader}>
            <div>
              <div style={s.panelTitle}>취약점 Top</div>
              <div style={s.panelSub}>우선 조치 대상</div>
            </div>

            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <input
                style={s.search}
                placeholder="라이브러리 / CVE / 심각도 검색"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              <button style={s.primaryOutlineBtn} onClick={() => navigate("/vulnerabilities")} type="button">
                전체 보기
              </button>
            </div>
          </div>

          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  <th style={s.th}>라이브러리</th>
                  <th style={s.th}>버전</th>
                  <th style={s.th}>CVE</th>
                  <th style={s.th}>심각도</th>
                  <th style={s.th}>CVSS</th>
                  <th style={s.th}>수정 버전</th>
                  <th style={s.th}>조치</th>
                </tr>
              </thead>

              <tbody>
                {filtered.map((r) => {
                  const rowBg =
                    r.severity === "치명"
                      ? "rgba(255, 99, 132, 0.10)"
                      : r.severity === "높음"
                      ? "rgba(251, 146, 60, 0.08)"
                      : "transparent";

                  return (
                    <tr
                      key={r.cve}
                      style={{ ...s.tr, background: rowBg }}
                      onClick={() => navigate("/vulnerabilities")}
                      title="클릭하면 취약점 관리로 이동"
                    >
                      <td style={s.td}>{r.library}</td>
                      <td style={s.td}>{r.version}</td>
                      <td style={s.td}>{r.cve}</td>
                      <td style={s.td}>
                        <SeverityPill level={r.severity} />
                      </td>
                      <td style={s.td}>{r.cvss.toFixed(1)}</td>
                      <td style={s.td}>{r.fixedVersion}</td>
                      <td style={s.td}>
                        <button
                          type="button"
                          style={s.smallBtn}
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate("/vulnerabilities");
                          }}
                        >
                          업데이트
                        </button>
                      </td>
                    </tr>
                  );
                })}

                {filtered.length === 0 && (
                  <tr>
                    <td style={s.td} colSpan={7}>
                      검색 결과가 없습니다.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div style={s.tableHint}>행/버튼 클릭 시 취약점 관리 페이지로 이동합니다.</div>
        </section>
      </main>
    </div>
  );
}

function NavItem({
  label,
  active = false,
  onClick,
}: {
  label: string;
  active?: boolean;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} style={{ ...s.navItem, ...(active ? s.navItemActive : null) }}>
      {label}
    </button>
  );
}

function KpiCard({
  title,
  value,
  sub,
  onClick,
  tone,
}: {
  title: string;
  value: string;
  sub: string;
  onClick: () => void;
  tone: "vuln" | "critical" | "neutral";
}) {
  const toneStyle =
    tone === "critical"
      ? s.kpiCritical
      : tone === "vuln"
      ? s.kpiVuln
      : s.kpiNeutral;

  return (
    <button type="button" onClick={onClick} style={{ ...s.kpiCard, ...toneStyle }}>
      <div style={s.kpiTitle}>{title}</div>
      <div style={s.kpiValue}>{value}</div>
      <div style={s.kpiSub}>{sub}</div>
      <div style={s.kpiCta}>상세 보기 →</div>
    </button>
  );
}

function MiniCard({
  title,
  value,
  kind,
}: {
  title: string;
  value: number | string;
  kind: "critical" | "high" | "decrease";
}) {
  const base = s.miniCard;
  const tone =
    kind === "critical" ? s.miniCritical : kind === "high" ? s.miniHigh : s.miniDecrease;
  const valueTone =
    kind === "critical" ? s.miniCriticalValue : kind === "high" ? s.miniHighValue : s.miniDecreaseValue;

  return (
    <div style={{ ...base, ...tone }}>
      <div style={s.miniTitle}>{title}</div>
      <div style={{ ...s.miniValue, ...valueTone }}>{value}</div>
    </div>
  );
}

function HistoryRow({
  id,
  who,
  when,
  target,
}: {
  id: number;
  who: string;
  when: string;
  target: string;
}) {
  return (
    <div style={s.historyRow}>
      <div style={s.historyLeft}>
        <div style={s.historyId}>ID {id}</div>
        <div style={s.historyMeta}>
          <span>{who}</span>
          <span style={s.dot}>•</span>
          <span>{when}</span>
        </div>
      </div>
      <div style={s.historyTarget}>{target}</div>
    </div>
  );
}

function SeverityPill({ level }: { level: Severity }) {
  const style =
    level === "치명" ? s.pillCritical : level === "높음" ? s.pillHigh : level === "중간" ? s.pillMid : s.pillLow;
  return <span style={{ ...s.pill, ...style }}>{level}</span>;
}

const s: Record<string, any> = {
  shell: {
    minHeight: "100vh",
    background: "#0b0f14",
    display: "flex",
    fontFamily:
      'ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, "Noto Sans KR", Arial',
    color: "#e5e7eb",
  },

  /* Sidebar */
  sidebar: {
    width: 260,
    background: "#020617",
    borderRight: "1px solid #1f2937",
    padding: 16,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  brand: { display: "flex", gap: 12, alignItems: "center", padding: 8 },
  brandIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    background: "#2563eb",
    color: "#fff",
    display: "grid",
    placeItems: "center",
    fontWeight: 900,
  },
  brandTitle: { fontWeight: 950, letterSpacing: 0.2 },
  brandSub: { fontSize: 12, color: "#94a3b8" },

  nav: { display: "flex", flexDirection: "column", gap: 8, paddingTop: 8 },
  navItem: {
    textAlign: "left",
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid transparent",
    background: "transparent",
    cursor: "pointer",
    color: "#cbd5e1",
  },
  navItemActive: {
    background: "#0b1220",
    borderColor: "#1f2937",
    color: "#60a5fa",
    fontWeight: 900,
  },

  sidebarFoot: { marginTop: "auto", padding: 8, borderTop: "1px solid #111827" },
  mutedSmall: { fontSize: 12, color: "#94a3b8" },
  projectPill: {
    display: "inline-flex",
    padding: "6px 10px",
    borderRadius: 999,
    background: "#0b1220",
    border: "1px solid #1f2937",
    fontSize: 12,
    marginTop: 6,
    color: "#e5e7eb",
  },
  goalBox: {
    marginTop: 8,
    padding: 10,
    borderRadius: 12,
    background: "#0b1220",
    border: "1px solid #1f2937",
  },
  goalTitle: { fontWeight: 950, fontSize: 12, color: "#e5e7eb" },
  goalSub: { marginTop: 4, fontSize: 12, color: "#94a3b8" },

  /* Main */
  main: { flex: 1, padding: 20, display: "flex", flexDirection: "column", gap: 16 },

  topbar: {
    background: "#020617",
    border: "1px solid #1f2937",
    borderRadius: 14,
    padding: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  pageTitle: { fontSize: 18, fontWeight: 950, color: "#e5e7eb" },
  pageSub: { fontSize: 12, color: "#94a3b8", marginTop: 4 },

  topbarRight: { display: "flex", alignItems: "center", gap: 12 },
  userBox: { display: "flex", alignItems: "center", gap: 10 },
  avatar: {
    width: 34,
    height: 34,
    borderRadius: 999,
    background: "#0b1220",
    border: "1px solid #1f2937",
    display: "grid",
    placeItems: "center",
    fontWeight: 950,
    color: "#e5e7eb",
  },
  userName: { fontSize: 13, fontWeight: 900, lineHeight: 1.1, color: "#e5e7eb" },
  userRole: { fontSize: 12, color: "#94a3b8" },

  primaryBtn: {
    padding: "10px 14px",
    borderRadius: 10,
    border: "1px solid #1d4ed8",
    background: "#2563eb",
    color: "#fff",
    cursor: "pointer",
    fontWeight: 900,
  },

  /* KPI */
  kpiRow: { display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 12 },
  kpiCard: {
    textAlign: "left",
    borderRadius: 14,
    padding: 16,
    cursor: "pointer",
    border: "1px solid #1f2937",
    background: "#020617",
    color: "#e5e7eb",
  },
  kpiNeutral: {},
  kpiVuln: {
    borderColor: "#334155",
    boxShadow: "0 0 18px rgba(96,165,250,0.12)",
  },
  kpiCritical: {
    borderColor: "#7f1d1d",
    background: "linear-gradient(135deg, rgba(255, 192, 203, 0.80), rgba(255, 192, 203, 0.70))",
    color: "#111827",
  },
  kpiTitle: { fontSize: 13, color: "#94a3b8", fontWeight: 900 },
  kpiValue: { fontSize: 30, fontWeight: 950, marginTop: 8 },
  kpiSub: { fontSize: 12, color: "#94a3b8", marginTop: 6 },
  kpiCta: { marginTop: 10, fontSize: 12, color: "#60a5fa", fontWeight: 900 },

  /* Hero Grid */
  heroGrid: { display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 12 },



  /* Vulnerability Hero (가장 강조되는 카드) */
  vulnHero: {
    borderRadius: 14,
    padding: 16,
    border: "2px solid rgba(255, 120, 150, 0.35)",
    background: "linear-gradient(180deg, #020617, #020617)",
    position: "relative",
    boxShadow: "0 0 28px rgba(255, 120, 150, 0.18)",
  },
  vulnHeroHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
    marginBottom: 12,
  },
  vulnHeroTitleRow: { display: "flex", gap: 10, alignItems: "center" },
  vulnHeroTitle: { fontSize: 16, fontWeight: 950, color: "#e5e7eb" },
  badgeHot: {
    fontSize: 11,
    fontWeight: 950,
    padding: "4px 10px",
    borderRadius: 999,
    background: "rgba(255, 120, 150, 0.16)",
    border: "1px solid rgba(255, 120, 150, 0.35)",
    color: "#ffd1dc",
  },
  bigSignal: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255, 120, 150, 0.35)",
    background: "rgba(255, 120, 150, 0.10)",
    minWidth: 86,
    textAlign: "center",
  },
  bigSignalLabel: { fontSize: 12, color: "#ffd1dc", fontWeight: 900 },
  bigSignalValue: { fontSize: 22, fontWeight: 950, color: "#ffd1dc", marginTop: 2 },

  linkBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "#0b1220",
    cursor: "pointer",
    color: "#60a5fa",
    fontWeight: 900,
  },
  linkBtnStrong: {
    padding: "8px 12px",
    borderRadius: 10,
    border: "1px solid rgba(255, 120, 150, 0.35)",
    background: "rgba(255, 120, 150, 0.10)",
    cursor: "pointer",
    color: "#ffd1dc",
    fontWeight: 950,
  },

  vulnChart: {
    height: 260,
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "linear-gradient(180deg, #0b1220, #020617)",
    position: "relative",
    overflow: "hidden",
  },
  vulnChartGlow: {
    position: "absolute",
    inset: -40,
    background:
      "radial-gradient(circle at 20% 40%, rgba(255,120,150,0.20), transparent 45%), radial-gradient(circle at 70% 60%, rgba(96,165,250,0.16), transparent 50%)",
    filter: "blur(8px)",
  },
  vulnChartNote: {
    position: "absolute",
    left: 12,
    bottom: 12,
    fontSize: 12,
    color: "#94a3b8",
    fontWeight: 800,
  },

  /* mini cards in hero */
  miniStats: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12, marginTop: 12 },

  miniCard: {
    borderRadius: 12,
    padding: 14,
    border: "1px solid #1f2937",
    background: "#0b1220",
  },
  miniTitle: { fontSize: 12, color: "#94a3b8", fontWeight: 900 },
  miniValue: { marginTop: 6, fontSize: 22, fontWeight: 950, color: "#e5e7eb" },

  miniCritical: {
    borderColor: "rgba(255,120,150,0.35)",
    background: "linear-gradient(135deg, rgba(255,120,150,0.12), #0b1220)",
  },
  miniCriticalValue: { color: "#ffd1dc" },

  miniHigh: {
    borderColor: "rgba(251,146,60,0.35)",
    background: "linear-gradient(135deg, rgba(251,146,60,0.10), #0b1220)",
  },
  miniHighValue: { color: "#fb923c" },

  miniDecrease: {
    borderColor: "rgba(96,165,250,0.35)",
    background: "linear-gradient(135deg, rgba(96,165,250,0.10), #0b1220)",
  },
  miniDecreaseValue: { color: "#60a5fa" },

  /* Generic panel */
  panel: {
    background: "#020617",
    border: "1px solid #1f2937",
    borderRadius: 14,
    padding: 16,
    color: "#e5e7eb",
  },
  panelHeader: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 12,
  },
  panelTitle: { fontSize: 14, fontWeight: 950, color: "#e5e7eb" },
  panelSub: { fontSize: 12, color: "#94a3b8", marginTop: 4 },

  /* history */
  historyList: { display: "flex", flexDirection: "column", gap: 10 },
  historyRow: {
    display: "flex",
    justifyContent: "space-between",
    gap: 12,
    padding: "10px 12px",
    background: "#0b1220",
    borderRadius: 12,
    border: "1px solid #1f2937",
  },
  historyLeft: { display: "flex", flexDirection: "column", gap: 4 },
  historyId: { fontWeight: 950, fontSize: 12, color: "#e5e7eb" },
  historyMeta: { fontSize: 12, color: "#cbd5e1", display: "flex", gap: 8, alignItems: "center" },
  dot: { color: "#94a3b8" },
  historyTarget: {
    fontSize: 12,
    color: "#94a3b8",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    maxWidth: 220,
  },

  callout: {
    marginTop: 12,
    padding: 12,
    borderRadius: 12,
    background: "#0b1220",
    border: "1px solid rgba(96,165,250,0.25)",
  },
  calloutTitle: { fontSize: 12, fontWeight: 950, color: "#60a5fa" },
  calloutBody: { marginTop: 6, fontSize: 12, color: "#cbd5e1" },

  /* table/search */
  search: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #1f2937",
    outline: "none",
    minWidth: 280,
    background: "#0b1220",
    color: "#e5e7eb",
  },
  primaryOutlineBtn: {
    padding: "10px 12px",
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
  },

  tableWrap: { overflowX: "auto", borderRadius: 12, border: "1px solid #1f2937" },
  table: { width: "100%", borderCollapse: "collapse", background: "#020617" },
  th: { textAlign: "left", fontSize: 12, color: "#94a3b8", padding: "10px 8px", borderBottom: "1px solid #1f2937" },
  tr: { cursor: "pointer" },
  td: { padding: "12px 8px", borderBottom: "1px solid #111827", fontSize: 13, color: "#e5e7eb" },

  smallBtn: {
    padding: "6px 10px",
    borderRadius: 10,
    border: "1px solid #1f2937",
    background: "#0b1220",
    color: "#e5e7eb",
    cursor: "pointer",
    fontWeight: 900,
  },

  pill: { display: "inline-flex", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 950, border: "1px solid transparent" },
  pillCritical: { background: "rgba(255,120,150,0.18)", color: "#ffd1dc", borderColor: "rgba(255,120,150,0.35)" },
  pillHigh: { background: "rgba(251,146,60,0.12)", color: "#fb923c", borderColor: "rgba(251,146,60,0.35)" },
  pillMid: { background: "rgba(148,163,184,0.12)", color: "#cbd5e1", borderColor: "rgba(148,163,184,0.25)" },
  pillLow: { background: "rgba(94,234,212,0.10)", color: "#5eead4", borderColor: "rgba(94,234,212,0.25)" },

  tableHint: { marginTop: 10, fontSize: 12, color: "#94a3b8" },
};

function UploadBar() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [name, setName] = useState<string>("");

  useEffect(() => {
    const v = sessionStorage.getItem("sbom_uploaded_file_name") ?? "";
    setName(v);
  }, []);

  const pick = () => inputRef.current?.click();

  return (
    <div style={u.wrap}>
      <div style={u.left}>
        <div style={u.title}>SBOM 파일 업로드</div>
        <div style={u.sub}>Syft/Grype 결과(json/xml)를 업로드하면 대시보드가 갱신됩니다.</div>
      </div>

      <div style={u.right}>
        <div style={u.fileName}>{name ? `선택됨: ${name}` : "아직 업로드된 파일이 없습니다."}</div>
        <button style={u.btn} type="button" onClick={pick}>
          파일 선택
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept=".json,.xml"
        style={{ display: "none" }}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (!f) return;
          sessionStorage.setItem("sbom_uploaded_file_name", f.name);
          setName(f.name);
          // 보완: 실제로는 여기서 업로드 API 호출 or 파싱 후 상태 갱신
          alert(`업로드(데모): ${f.name}`);
        }}
      />
    </div>
  );
}

const u: Record<string, any> = {
  wrap: {
    width: "100%",
    borderRadius: 14,
    border: "1px solid rgba(255,120,150,0.25)",
    background: "linear-gradient(180deg, #020617, #0b1220)",
    padding: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
    boxShadow: "0 0 22px rgba(255,120,150,0.10)",
  },
  left: { display: "flex", flexDirection: "column", gap: 6 },
  title: { fontWeight: 950, fontSize: 14, color: "#e5e7eb" },
  sub: { fontSize: 12, color: "#94a3b8" },
  right: { display: "flex", alignItems: "center", gap: 10 },
  fileName: {
    maxWidth: 420,
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid #1f2937",
    background: "#0b0f14",
    color: "#cbd5e1",
    fontSize: 12,
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },
  btn: {
    padding: "10px 14px",
    borderRadius: 12,
    border: "1px solid rgba(255,120,150,0.35)",
    background: "rgba(255,120,150,0.10)",
    color: "#ffd1dc",
    cursor: "pointer",
    fontWeight: 950,
  },
};
