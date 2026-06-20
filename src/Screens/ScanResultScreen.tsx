import React, { useEffect, useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSearch,
  RotateCcw,
  ShieldAlert,
  Wrench,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import {
  downloadFixedZip,
  getComponents,
  getFixPlan,
  getScanResults,
  type FixPlanItem,
  type SbomComponent,
  type ScanResult,
} from "../services/_private/SbomApi";

const severityOrder: Record<string, number> = {
  Critical: 0,
  High: 1,
  Medium: 2,
  Low: 3,
  Negligible: 4,
  Unknown: 5,
};

const severityColors: Record<string, { bg: string; text: string }> = {
  Critical: { bg: "#fee2e2", text: "#991b1b" },
  High: { bg: "#ffedd5", text: "#9a3412" },
  Medium: { bg: "#fef3c7", text: "#92400e" },
  Low: { bg: "#dcfce7", text: "#166534" },
  Negligible: { bg: "#e0f2fe", text: "#075985" },
  Unknown: { bg: "#e5e7eb", text: "#374151" },
};

const getSeverityCount = (counts: Record<string, number>, severity: string) =>
  counts[severity] ?? 0;

const getRiskStatus = (counts: Record<string, number>, total: number) => {
  if (total === 0) {
    return {
      label: "양호",
      title: "발견된 취약점이 없습니다",
      description:
        "업로드된 구성요소 기준으로 알려진 취약점이 발견되지 않았습니다.",
      bg: "#ecfdf5",
      border: "#bbf7d0",
      color: "#166534",
    };
  }

  if (getSeverityCount(counts, "Critical") > 0) {
    return {
      label: "긴급 조치 필요",
      title: "Critical 취약점이 포함되어 있습니다",
      description:
        "배포 전 우선 조치 항목을 먼저 확인하고 핵심 패키지 버전을 올리는 것이 좋습니다.",
      bg: "#fef2f2",
      border: "#fecaca",
      color: "#991b1b",
    };
  }

  if (getSeverityCount(counts, "High") > 0) {
    return {
      label: "주의",
      title: "High 취약점이 포함되어 있습니다",
      description:
        "위험도가 높은 구성요소부터 수정 버전을 확인하고 업데이트 계획을 세워야 합니다.",
      bg: "#fff7ed",
      border: "#fed7aa",
      color: "#9a3412",
    };
  }

  return {
    label: "검토 필요",
    title: "중간 이하 위험 취약점이 발견되었습니다",
    description:
      "서비스 영향도를 확인한 뒤 수정 가능한 버전부터 순서대로 반영하세요.",
    bg: "#fffbeb",
    border: "#fde68a",
    color: "#92400e",
  };
};

const getFixGuide = (item: ScanResult) => {
  if (!item.fixedVer) {
    return "공식 권고문에서 수정 가능 버전을 확인하세요.";
  }

  switch (item.pkgType) {
    case "npm":
      return `npm install ${item.pkgName}@${item.fixedVer}`;
    case "python":
      return `pip install ${item.pkgName}==${item.fixedVer}`;
    case "gem":
      return `bundle update ${item.pkgName}`;
    case "go-module":
      return `go get ${item.pkgName}@${item.fixedVer}`;
    case "java-archive":
    case "java":
      return `pom.xml 또는 build.gradle에서 ${item.pkgName} 버전을 ${item.fixedVer} 이상으로 올리세요.`;
    case "deb":
    case "rpm":
    case "apk":
      return `OS 패키지 매니저로 ${item.pkgName}을 ${item.fixedVer} 이상으로 업데이트하세요.`;
    default:
      return `${item.pkgName}을 ${item.fixedVer} 이상으로 업데이트하세요.`;
  }
};

export default function ScanResultScreen() {
  const { fileSeq } = useParams();
  const navigate = useNavigate();
  const [results, setResults] = useState<ScanResult[]>([]);
  const [components, setComponents] = useState<SbomComponent[]>([]);
  const [fixPlan, setFixPlan] = useState<FixPlanItem[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fileSeq) return;

    const loadResults = async () => {
      try {
        setLoading(true);
        const [scanResponse, componentResponse] = await Promise.all([
          getScanResults(fileSeq),
          getComponents(fileSeq),
        ]);
        setResults(scanResponse.data?.results ?? []);
        setComponents(componentResponse.data?.components ?? []);

        try {
          const fixPlanResponse = await getFixPlan(fileSeq);
          setFixPlan(fixPlanResponse.data?.fixes ?? []);
        } catch (fixPlanError) {
          console.warn("수정안 생성 API를 불러오지 못했습니다.", fixPlanError);
          setFixPlan([]);
        }
      } catch (e) {
        console.error(e);
        setError("분석 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [fileSeq]);

  const handleDownloadFixedZip = async () => {
    if (!fileSeq || isDownloading) return;

    try {
      setIsDownloading(true);
      const response = await downloadFixedZip(fileSeq);
      const blobUrl = window.URL.createObjectURL(response.data);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `fixed-project-${fileSeq}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (downloadError) {
      console.error(downloadError);
      alert(
        "수정된 ZIP을 만들지 못했습니다. ZIP 파일 업로드인지, 자동 수정 가능한 npm 항목이 있는지 확인해주세요.",
      );
    } finally {
      setIsDownloading(false);
    }
  };

  const sortedResults = useMemo(
    () =>
      [...results].sort(
        (a, b) =>
          (severityOrder[a.severity] ?? 99) - (severityOrder[b.severity] ?? 99),
      ),
    [results],
  );

  const counts = useMemo(() => {
    return results.reduce<Record<string, number>>((acc, item) => {
      acc[item.severity] = (acc[item.severity] ?? 0) + 1;
      return acc;
    }, {});
  }, [results]);

  const topFixes = useMemo(() => {
    const map = new Map<string, ScanResult>();
    sortedResults.forEach((item) => {
      const key = `${item.pkgName}@${item.pkgVersion}`;
      if (!map.has(key)) map.set(key, item);
    });
    return Array.from(map.values()).slice(0, 4);
  }, [sortedResults]);

  const vulnerableComponentKeys = useMemo(() => {
    return new Set(
      results.map((item) => `${item.pkgName}@${item.pkgVersion}`),
    );
  }, [results]);

  const vulnerableComponentCount = useMemo(() => {
    return components.filter((item) =>
      vulnerableComponentKeys.has(`${item.pkgName}@${item.pkgVersion ?? ""}`),
    ).length;
  }, [components, vulnerableComponentKeys]);

  const riskStatus = useMemo(
    () => getRiskStatus(counts, results.length),
    [counts, results.length],
  );

  const safeComponentCount = Math.max(
    components.length - vulnerableComponentCount,
    0,
  );

  const vulnerableRatio =
    components.length === 0
      ? 0
      : Math.round((vulnerableComponentCount / components.length) * 100);

  const autoFixPlan = useMemo(
    () => fixPlan.filter((item) => item.autoApplicable),
    [fixPlan],
  );

  const manualFixPlan = useMemo(
    () => fixPlan.filter((item) => !item.autoApplicable),
    [fixPlan],
  );

  const styles = {
    page: {
      minHeight: "100vh",
      background: "#f4f6f9",
      color: "#0f172a",
      padding: "40px 52px",
      boxSizing: "border-box" as const,
      fontFamily:
        "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
    },
    header: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 20,
      marginBottom: 24,
    },
    title: {
      margin: 0,
      fontSize: 34,
      fontWeight: 900,
      letterSpacing: 0,
    },
    subtitle: {
      margin: "8px 0 0",
      color: "#64748b",
      fontSize: 15,
      lineHeight: 1.6,
    },
    button: {
      height: 42,
      border: "1px solid #cbd5e1",
      background: "#ffffff",
      color: "#334155",
      borderRadius: 8,
      padding: "0 14px",
      fontWeight: 800,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    primaryButton: {
      height: 38,
      border: "1px solid #1d4ed8",
      background: "#2563eb",
      color: "#ffffff",
      borderRadius: 8,
      padding: "0 12px",
      fontWeight: 900,
      cursor: "pointer",
      display: "inline-flex",
      alignItems: "center",
      gap: 8,
    },
    disabledButton: {
      opacity: 0.55,
      cursor: "not-allowed",
    },
    reportHero: {
      display: "grid",
      gridTemplateColumns: "minmax(0, 1.4fr) minmax(320px, 0.8fr)",
      gap: 18,
      marginBottom: 18,
    },
    riskCard: {
      background: riskStatus.bg,
      border: `1px solid ${riskStatus.border}`,
      borderRadius: 8,
      padding: "22px 24px",
      display: "flex",
      gap: 16,
      alignItems: "flex-start",
    },
    riskIcon: {
      width: 44,
      height: 44,
      borderRadius: 8,
      background: "#ffffff",
      color: riskStatus.color,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexShrink: 0,
    },
    riskLabel: {
      display: "inline-flex",
      alignItems: "center",
      height: 24,
      padding: "0 9px",
      borderRadius: 999,
      background: "#ffffff",
      color: riskStatus.color,
      fontSize: 12,
      fontWeight: 900,
      marginBottom: 9,
    },
    riskTitle: {
      margin: 0,
      color: riskStatus.color,
      fontSize: 22,
      fontWeight: 900,
      letterSpacing: 0,
    },
    riskText: {
      margin: "8px 0 0",
      color: "#334155",
      fontSize: 14,
      lineHeight: 1.6,
    },
    insightPanel: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "18px 20px",
    },
    insightTitle: {
      margin: 0,
      fontSize: 15,
      fontWeight: 900,
    },
    ratioBar: {
      height: 10,
      borderRadius: 999,
      background: "#e2e8f0",
      overflow: "hidden",
      marginTop: 14,
    },
    ratioFill: {
      height: "100%",
      width: `${vulnerableRatio}%`,
      background:
        vulnerableRatio === 0
          ? "#22c55e"
          : vulnerableRatio >= 50
            ? "#ef4444"
            : "#f97316",
    },
    insightLine: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      marginTop: 12,
      color: "#475569",
      fontSize: 13,
      lineHeight: 1.5,
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(7, minmax(120px, 1fr))",
      gap: 12,
      marginBottom: 22,
    },
    summary: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "16px 18px",
      minHeight: 92,
      boxSizing: "border-box" as const,
    },
    summaryLabel: {
      fontSize: 12,
      fontWeight: 800,
      color: "#64748b",
    },
    summaryValue: {
      marginTop: 8,
      fontSize: 30,
      fontWeight: 900,
    },
    contentGrid: {
      display: "grid",
      gridTemplateColumns: "360px minmax(0, 1fr)",
      gap: 18,
      alignItems: "start",
    },
    panel: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      overflow: "hidden",
    },
    panelTitle: {
      margin: 0,
      padding: "16px 18px",
      borderBottom: "1px solid #e2e8f0",
      fontSize: 16,
      fontWeight: 900,
    },
    panelSubTitle: {
      margin: 0,
      padding: "0 18px 14px",
      color: "#64748b",
      fontSize: 13,
      lineHeight: 1.5,
    },
    fixItem: {
      padding: "14px 18px",
      borderBottom: "1px solid #f1f5f9",
    },
    packageType: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      marginTop: 8,
      padding: "0 8px",
      borderRadius: 999,
      background: "#eef2ff",
      color: "#3730a3",
      fontSize: 12,
      fontWeight: 900,
    },
    guideBox: {
      marginTop: 10,
      padding: "10px 12px",
      borderRadius: 8,
      background: "#f8fafc",
      color: "#334155",
      fontSize: 12,
      lineHeight: 1.5,
      wordBreak: "break-word" as const,
    },
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      fontSize: 13,
    },
    tableWrap: {
      maxHeight: 360,
      overflow: "auto",
      borderTop: "1px solid #e2e8f0",
    },
    fixPlanGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
      gap: 14,
      padding: 18,
    },
    fixPlanColumn: {
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      overflow: "hidden",
      background: "#ffffff",
    },
    fixPlanColumnHeader: {
      display: "flex",
      justifyContent: "space-between",
      gap: 12,
      alignItems: "center",
      padding: "13px 14px",
      background: "#f8fafc",
      borderBottom: "1px solid #e2e8f0",
      fontWeight: 900,
    },
    planItem: {
      padding: "13px 14px",
      borderBottom: "1px solid #eef2f7",
    },
    planMeta: {
      display: "flex",
      flexWrap: "wrap" as const,
      gap: 8,
      marginTop: 8,
      color: "#64748b",
      fontSize: 12,
    },
    smallPill: {
      display: "inline-flex",
      alignItems: "center",
      height: 22,
      padding: "0 8px",
      borderRadius: 999,
      background: "#eef2ff",
      color: "#3730a3",
      fontSize: 12,
      fontWeight: 900,
    },
    tableHeaderText: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 16,
      padding: "16px 18px",
      borderBottom: "1px solid #e2e8f0",
    },
    sectionHeading: {
      margin: 0,
      fontSize: 16,
      fontWeight: 900,
    },
    sectionDescription: {
      margin: "4px 0 0",
      color: "#64748b",
      fontSize: 13,
      lineHeight: 1.5,
    },
    countPill: {
      display: "inline-flex",
      alignItems: "center",
      height: 30,
      padding: "0 10px",
      borderRadius: 999,
      background: "#f1f5f9",
      color: "#334155",
      fontSize: 12,
      fontWeight: 900,
      whiteSpace: "nowrap" as const,
    },
    th: {
      textAlign: "left" as const,
      background: "#f8fafc",
      color: "#475569",
      padding: "12px 14px",
      borderBottom: "1px solid #e2e8f0",
      fontWeight: 900,
    },
    td: {
      padding: "12px 14px",
      borderBottom: "1px solid #eef2f7",
      verticalAlign: "top" as const,
    },
    componentName: {
      maxWidth: 520,
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap" as const,
    },
    mono: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    },
  };

  if (loading) {
    return (
      <main style={styles.page}>
        <section style={styles.riskCard}>
          <div style={styles.riskIcon}>
            <FileSearch size={24} />
          </div>
          <div>
            <h1 style={styles.riskTitle}>분석 결과를 불러오는 중입니다</h1>
            <p style={styles.riskText}>
              업로드된 파일의 구성요소와 취약점 정보를 정리하고 있습니다.
            </p>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>SBOM 분석 결과</h1>
          <p style={styles.subtitle}>
            파일 번호 {fileSeq} 기준의 구성요소, 취약점, 권장 수정 버전입니다.
          </p>
        </div>
        <button type="button" style={styles.button} onClick={() => navigate("/upload")}>
          <RotateCcw size={16} />
          새 파일 분석
        </button>
      </header>

      {error ? (
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>{error}</h2>
        </section>
      ) : (
        <>
          <section style={styles.reportHero}>
            <div style={styles.riskCard}>
              <div style={styles.riskIcon}>
                {results.length > 0 ? (
                  <ShieldAlert size={25} />
                ) : (
                  <CheckCircle2 size={25} />
                )}
              </div>
              <div>
                <span style={styles.riskLabel}>{riskStatus.label}</span>
                <h2 style={styles.riskTitle}>{riskStatus.title}</h2>
                <p style={styles.riskText}>{riskStatus.description}</p>
              </div>
            </div>

            <aside style={styles.insightPanel}>
              <h2 style={styles.insightTitle}>구성요소 위험 비율</h2>
              <div style={styles.ratioBar}>
                <div style={styles.ratioFill} />
              </div>
              <div style={styles.insightLine}>
                <span>취약 구성요소</span>
                <strong>
                  {vulnerableComponentCount}개 / {components.length}개
                </strong>
              </div>
              <div style={styles.insightLine}>
                <span>안전 또는 미탐지 구성요소</span>
                <strong>{safeComponentCount}개</strong>
              </div>
              <div style={styles.insightLine}>
                <span>전체 취약점 발견 건수</span>
                <strong>{results.length}건</strong>
              </div>
            </aside>
          </section>

          <section style={styles.summaryGrid}>
            {["Critical", "High", "Medium", "Low"].map((severity) => (
              <div key={severity} style={styles.summary}>
                <div style={styles.summaryLabel}>{severity}</div>
                <div style={styles.summaryValue}>{counts[severity] ?? 0}</div>
              </div>
            ))}
            <div style={styles.summary}>
              <div style={styles.summaryLabel}>Components</div>
              <div style={styles.summaryValue}>{components.length}</div>
            </div>
            <div style={styles.summary}>
              <div style={styles.summaryLabel}>Vulnerable</div>
              <div style={styles.summaryValue}>{vulnerableComponentCount}</div>
            </div>
            <div style={styles.summary}>
              <div style={styles.summaryLabel}>Findings</div>
              <div style={styles.summaryValue}>{results.length}</div>
            </div>
          </section>

          <section style={{ ...styles.panel, marginBottom: 18 }}>
            <div style={styles.tableHeaderText}>
              <div>
                <h2 style={styles.sectionHeading}>구성요소 목록</h2>
                <p style={styles.sectionDescription}>
                  SBOM에서 식별된 전체 구성요소입니다. 취약점이 연결된 항목은 위험으로
                  표시됩니다.
                </p>
              </div>
              <span style={styles.countPill}>총 {components.length}개</span>
            </div>
            <div style={styles.tableWrap}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>상태</th>
                    <th style={styles.th}>패키지</th>
                    <th style={styles.th}>버전</th>
                    <th style={styles.th}>타입</th>
                    <th style={styles.th}>라이선스</th>
                  </tr>
                </thead>
                <tbody>
                  {components.length === 0 ? (
                    <tr>
                      <td style={styles.td} colSpan={5}>
                        저장된 구성요소가 없습니다. ZIP 파일을 다시 업로드하거나,
                        SBOM 파일에 components 항목이 있는지 확인하세요.
                      </td>
                    </tr>
                  ) : (
                    components.map((item) => {
                      const isVulnerable = vulnerableComponentKeys.has(
                        `${item.pkgName}@${item.pkgVersion ?? ""}`,
                      );
                      return (
                        <tr key={item.componentSeq}>
                          <td style={styles.td}>
                            <span
                              style={{
                                display: "inline-flex",
                                alignItems: "center",
                                height: 24,
                                padding: "0 8px",
                                borderRadius: 999,
                                background: isVulnerable ? "#fee2e2" : "#dcfce7",
                                color: isVulnerable ? "#991b1b" : "#166534",
                                fontWeight: 900,
                              }}
                            >
                              {isVulnerable ? "위험" : "안전"}
                            </span>
                          </td>
                          <td style={styles.td}>
                            <div style={styles.componentName}>
                              <strong title={item.pkgName}>{item.pkgName}</strong>
                            </div>
                          </td>
                          <td style={{ ...styles.td, ...styles.mono }}>
                            {item.pkgVersion || "-"}
                          </td>
                          <td style={{ ...styles.td, ...styles.mono }}>
                            {item.pkgType || "-"}
                          </td>
                          <td style={{ ...styles.td, ...styles.mono }}>
                            {item.license || "확인 필요"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section style={{ ...styles.panel, marginBottom: 18 }}>
            <div style={styles.tableHeaderText}>
              <div>
                <h2 style={styles.sectionHeading}>자동 수정안</h2>
                <p style={styles.sectionDescription}>
                  발견된 취약점 기준으로 수정 가능한 패키지와 수동 확인이 필요한 항목을
                  분리했습니다.
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={styles.countPill}>
                  자동 {autoFixPlan.length}개 · 수동 {manualFixPlan.length}개
                </span>
                <button
                  type="button"
                  style={{
                    ...styles.primaryButton,
                    ...(autoFixPlan.length === 0 || isDownloading
                      ? styles.disabledButton
                      : {}),
                  }}
                  disabled={autoFixPlan.length === 0 || isDownloading}
                  onClick={handleDownloadFixedZip}
                >
                  <Download size={16} />
                  {isDownloading ? "생성 중" : "수정된 ZIP 다운로드"}
                </button>
              </div>
            </div>
            <div style={styles.fixPlanGrid}>
              <div style={styles.fixPlanColumn}>
                <div style={styles.fixPlanColumnHeader}>
                  <span>자동 적용 가능</span>
                  <Wrench size={16} color="#2563eb" />
                </div>
                {autoFixPlan.length === 0 ? (
                  <div style={styles.planItem}>자동 수정 가능한 항목이 없습니다.</div>
                ) : (
                  autoFixPlan.slice(0, 5).map((item) => (
                    <div
                      key={`auto-${item.pkgName}-${item.currentVersion}-${item.targetVersion}`}
                      style={styles.planItem}
                    >
                      <strong>{item.pkgName}</strong>
                      <div style={styles.planMeta}>
                        <span style={styles.smallPill}>{item.pkgType || "unknown"}</span>
                        <span>
                          {item.currentVersion || "-"} -&gt; {item.targetVersion || "확인 필요"}
                        </span>
                        <span>{item.targetFile || "대상 파일 확인"}</span>
                      </div>
                      <div style={{ ...styles.guideBox, ...styles.mono }}>
                        {item.action}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div style={styles.fixPlanColumn}>
                <div style={styles.fixPlanColumnHeader}>
                  <span>수동 확인 필요</span>
                  <AlertTriangle size={16} color="#f97316" />
                </div>
                {manualFixPlan.length === 0 ? (
                  <div style={styles.planItem}>수동 확인이 필요한 항목이 없습니다.</div>
                ) : (
                  manualFixPlan.slice(0, 5).map((item) => (
                    <div
                      key={`manual-${item.pkgName}-${item.currentVersion}-${item.vulnId}`}
                      style={styles.planItem}
                    >
                      <strong>{item.pkgName}</strong>
                      <div style={styles.planMeta}>
                        <span style={styles.smallPill}>{item.pkgType || "unknown"}</span>
                        <span>{item.vulnId || "취약점 확인 필요"}</span>
                        <span>{item.targetFile || "수동 확인"}</span>
                      </div>
                      <div style={{ ...styles.guideBox, ...styles.mono }}>
                        {item.action}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </section>

          <section style={styles.contentGrid}>
            <aside style={styles.panel}>
              <div style={styles.tableHeaderText}>
                <div>
                  <h2 style={styles.sectionHeading}>우선 조치</h2>
                  <p style={styles.sectionDescription}>
                    중복 패키지를 묶어 먼저 고쳐야 할 항목만 추렸습니다.
                  </p>
                </div>
                <AlertTriangle size={18} color="#f97316" />
              </div>
              {topFixes.length === 0 ? (
                <div style={styles.fixItem}>발견된 취약점이 없습니다.</div>
              ) : (
                topFixes.map((item) => (
                  <div key={`${item.resultSeq}-${item.pkgName}`} style={styles.fixItem}>
                    <strong>{item.pkgName}</strong>
                    {item.pkgType && <div style={styles.packageType}>{item.pkgType}</div>}
                    <div style={{ color: "#64748b", marginTop: 4, fontSize: 13 }}>
                      현재 {item.pkgVersion}
                      {item.fixedVer ? ` -> ${item.fixedVer} 이상 권장` : " -> 수정 버전 확인 필요"}
                    </div>
                    <div style={{ ...styles.guideBox, ...styles.mono }}>
                      {getFixGuide(item)}
                    </div>
                  </div>
                ))
              )}
            </aside>

            <section style={styles.panel}>
              <div style={styles.tableHeaderText}>
                <div>
                  <h2 style={styles.sectionHeading}>상세 취약점</h2>
                  <p style={styles.sectionDescription}>
                    분석 도구가 찾은 취약점별 위험도와 권장 수정 버전입니다.
                  </p>
                </div>
                <span style={styles.countPill}>총 {results.length}건</span>
              </div>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>위험도</th>
                    <th style={styles.th}>패키지</th>
                    <th style={styles.th}>타입</th>
                    <th style={styles.th}>취약점</th>
                    <th style={styles.th}>현재 버전</th>
                    <th style={styles.th}>해결 버전</th>
                    <th style={styles.th}>권장 조치</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedResults.map((item) => {
                    const color = severityColors[item.severity] ?? severityColors.Unknown;
                    return (
                      <tr key={item.resultSeq}>
                        <td style={styles.td}>
                          <span
                            style={{
                              display: "inline-flex",
                              alignItems: "center",
                              height: 24,
                              padding: "0 8px",
                              borderRadius: 999,
                              background: color.bg,
                              color: color.text,
                              fontWeight: 900,
                            }}
                          >
                            {item.severity}
                          </span>
                        </td>
                        <td style={styles.td}>
                          <strong>{item.pkgName}</strong>
                        </td>
                        <td style={{ ...styles.td, ...styles.mono }}>
                          {item.pkgType || "-"}
                        </td>
                        <td style={{ ...styles.td, ...styles.mono }}>
                          {item.cveId || item.vulnId || "-"}
                        </td>
                        <td style={{ ...styles.td, ...styles.mono }}>{item.pkgVersion}</td>
                        <td style={{ ...styles.td, ...styles.mono }}>
                          {item.fixedVer || "확인 필요"}
                        </td>
                        <td style={styles.td}>{getFixGuide(item)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          </section>
        </>
      )}
    </main>
  );
}
