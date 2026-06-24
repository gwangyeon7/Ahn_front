import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFileStatus, type FileStatus } from "../services/_private/SbomApi";

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
    background: "#f4f7fb",
    color: "#0f172a",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },
  panel: {
    width: "100%",
    maxWidth: 620,
    padding: 40,
    borderRadius: 8,
    border: "1px solid #dbe3ef",
    background: "#fff",
    boxShadow: "0 24px 70px rgba(15, 23, 42, 0.08)",
  },
  label: {
    display: "inline-flex",
    padding: "7px 12px",
    borderRadius: 999,
    background: "#eef4ff",
    color: "#1d4ed8",
    fontSize: 13,
    fontWeight: 900,
    marginBottom: 20,
  },
  title: {
    margin: 0,
    fontSize: 34,
    lineHeight: 1.2,
    fontWeight: 900,
    letterSpacing: 0,
  },
  description: {
    margin: "14px 0 0",
    color: "#64748b",
    fontSize: 16,
    lineHeight: 1.7,
    fontWeight: 700,
  },
  progressTrack: {
    height: 12,
    marginTop: 30,
    overflow: "hidden",
    borderRadius: 999,
    background: "#e2e8f0",
  },
  progressBar: {
    width: "68%",
    height: "100%",
    borderRadius: 999,
    background: "#2563eb",
    transition: "width 0.2s ease",
  },
  meta: {
    display: "grid",
    gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
    gap: 12,
    marginTop: 28,
  },
  metaItem: {
    padding: 16,
    borderRadius: 8,
    background: "#f8fafc",
    border: "1px solid #e2e8f0",
  },
  metaLabel: {
    color: "#64748b",
    fontSize: 13,
    fontWeight: 900,
  },
  metaValue: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: 900,
  },
  buttonRow: {
    display: "flex",
    justifyContent: "flex-end",
    gap: 10,
    marginTop: 28,
  },
  button: {
    height: 44,
    padding: "0 18px",
    borderRadius: 8,
    border: "1px solid #cbd5e1",
    background: "#fff",
    color: "#1e293b",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
  primaryButton: {
    height: 44,
    padding: "0 18px",
    borderRadius: 8,
    border: "1px solid #2563eb",
    background: "#2563eb",
    color: "#fff",
    fontSize: 14,
    fontWeight: 800,
    cursor: "pointer",
  },
};

export default function ScanLoadingScreen() {
  const navigate = useNavigate();
  const { fileSeq } = useParams();
  const [status, setStatus] = useState<FileStatus | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!fileSeq) return;
    let isMounted = true;
    let timerId: number | undefined;

    const checkStatus = async () => {
      try {
        const response = await getFileStatus(fileSeq);
        const nextStatus = response?.data as FileStatus;
        if (!isMounted) return;

        setStatus(nextStatus);

        if (nextStatus?.status === "DONE") {
          navigate(`/scan-result/${fileSeq}`, { replace: true });
          return;
        }

        if (nextStatus?.status === "FAILED") {
          setErrorMessage("분석에 실패했습니다. 파일 형식이나 백엔드 로그를 확인해주세요.");
          return;
        }

        timerId = window.setTimeout(checkStatus, 1000);
      } catch (error) {
        if (!isMounted) return;
        setErrorMessage("분석 상태를 확인하지 못했습니다. 백엔드 서버를 확인해주세요.");
      }
    };

    checkStatus();

    return () => {
      isMounted = false;
      if (timerId) window.clearTimeout(timerId);
    };
  }, [fileSeq, navigate]);

  const isFailed = status?.status === "FAILED" || Boolean(errorMessage);

  return (
    <main style={styles.page}>
      <section style={styles.panel}>
        <span
          style={{
            ...styles.label,
            background: isFailed ? "#fee2e2" : "#eef4ff",
            color: isFailed ? "#991b1b" : "#1d4ed8",
          }}
        >
          {isFailed ? "분석 실패" : "백그라운드 분석"}
        </span>

        <h1 style={styles.title}>
          {isFailed ? "분석을 완료하지 못했습니다" : "파일을 분석하고 있습니다"}
        </h1>
        <p style={styles.description}>
          {isFailed
            ? errorMessage
            : "파일 저장은 끝났고, Syft 구성요소 추출과 Grype 취약점 분석이 서버에서 진행 중입니다. 완료되면 결과 화면으로 자동 이동합니다."}
        </p>

        {!isFailed && (
          <div style={styles.progressTrack}>
            <div style={styles.progressBar} />
          </div>
        )}

        <div style={styles.meta}>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>파일 번호</div>
            <div style={styles.metaValue}>{fileSeq ?? "-"}</div>
          </div>
          <div style={styles.metaItem}>
            <div style={styles.metaLabel}>현재 상태</div>
            <div style={styles.metaValue}>{status?.status ?? "확인 중"}</div>
          </div>
        </div>

        <div style={styles.buttonRow}>
          <button style={styles.button} onClick={() => navigate("/history")}>
            히스토리
          </button>
          {isFailed && (
            <button style={styles.primaryButton} onClick={() => navigate("/upload")}>
              다시 업로드
            </button>
          )}
        </div>
      </section>
    </main>
  );
}
