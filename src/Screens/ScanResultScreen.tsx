import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getScanResults, type ScanResult } from "../services/_private/SbomApi";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!fileSeq) return;

    const loadResults = async () => {
      try {
        setLoading(true);
        const response = await getScanResults(fileSeq);
        setResults(response.data?.results ?? []);
      } catch (e) {
        console.error(e);
        setError("분석 결과를 불러오지 못했습니다.");
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [fileSeq]);

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
    },
    summaryGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(5, minmax(120px, 1fr))",
      gap: 12,
      marginBottom: 22,
    },
    summary: {
      background: "#ffffff",
      border: "1px solid #e2e8f0",
      borderRadius: 8,
      padding: "16px 18px",
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
      gridTemplateColumns: "320px minmax(0, 1fr)",
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
    mono: {
      fontFamily:
        "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', monospace",
    },
  };

  if (loading) {
    return <main style={styles.page}>분석 결과를 불러오는 중입니다...</main>;
  }

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div>
          <h1 style={styles.title}>취약점 분석 결과</h1>
          <p style={styles.subtitle}>
            파일 번호 {fileSeq} 기준으로 발견된 취약 구성요소와 권장 수정 버전입니다.
          </p>
        </div>
        <button type="button" style={styles.button} onClick={() => navigate("/upload")}>
          새 파일 분석
        </button>
      </header>

      {error ? (
        <section style={styles.panel}>
          <h2 style={styles.panelTitle}>{error}</h2>
        </section>
      ) : (
        <>
          <section style={styles.summaryGrid}>
            {["Critical", "High", "Medium", "Low"].map((severity) => (
              <div key={severity} style={styles.summary}>
                <div style={styles.summaryLabel}>{severity}</div>
                <div style={styles.summaryValue}>{counts[severity] ?? 0}</div>
              </div>
            ))}
            <div style={styles.summary}>
              <div style={styles.summaryLabel}>Total</div>
              <div style={styles.summaryValue}>{results.length}</div>
            </div>
          </section>

          <section style={styles.contentGrid}>
            <aside style={styles.panel}>
              <h2 style={styles.panelTitle}>우선 조치</h2>
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
              <h2 style={styles.panelTitle}>상세 취약점</h2>
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
