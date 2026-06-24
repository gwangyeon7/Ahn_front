import { useMemo } from "react";
import { RotateCcw } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { ComponentTable } from "../components/scan/ComponentTable";
import { FixPlanPanel } from "../components/scan/FixPlanPanel";
import { LoadingState } from "../components/scan/LoadingState";
import { PriorityFixes } from "../components/scan/PriorityFixes";
import { RiskOverview } from "../components/scan/RiskOverview";
import { ScanSummaryCards } from "../components/scan/ScanSummaryCards";
import { VulnerabilityTable } from "../components/scan/VulnerabilityTable";
import { useScanResult } from "../hooks/useScanResult";
import { scanResultStyles as styles } from "../styles/scanResult";
import {
  countBySeverity,
  getRiskStatus,
  getTopFixes,
  getVulnerableComponentCount,
  getVulnerableComponentKeys,
  sortBySeverity,
  splitFixPlan,
} from "../utils/scanResultUtils";

export default function ScanResultScreen() {
  const { fileSeq } = useParams();
  const navigate = useNavigate();
  const {
    results,
    components,
    fixPlan,
    isDownloading,
    loading,
    error,
    downloadFixedProjectZip,
  } = useScanResult(fileSeq);

  const sortedResults = useMemo(() => sortBySeverity(results), [results]);
  const counts = useMemo(() => countBySeverity(results), [results]);
  const topFixes = useMemo(
    () => getTopFixes(sortedResults),
    [sortedResults],
  );
  const vulnerableComponentKeys = useMemo(
    () => getVulnerableComponentKeys(results),
    [results],
  );
  const vulnerableComponentCount = useMemo(
    () => getVulnerableComponentCount(components, vulnerableComponentKeys),
    [components, vulnerableComponentKeys],
  );
  const riskStatus = useMemo(
    () => getRiskStatus(counts, results.length),
    [counts, results.length],
  );
  const { autoFixPlan, manualFixPlan } = useMemo(
    () => splitFixPlan(fixPlan),
    [fixPlan],
  );

  const safeComponentCount = Math.max(
    components.length - vulnerableComponentCount,
    0,
  );
  const vulnerableRatio =
    components.length === 0
      ? 0
      : Math.round((vulnerableComponentCount / components.length) * 100);

  if (loading) {
    return <LoadingState />;
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
        <button
          type="button"
          style={styles.button}
          onClick={() => navigate("/upload")}
        >
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
          <RiskOverview
            riskStatus={riskStatus}
            totalResults={results.length}
            vulnerableComponentCount={vulnerableComponentCount}
            componentCount={components.length}
            safeComponentCount={safeComponentCount}
            vulnerableRatio={vulnerableRatio}
          />

          <ScanSummaryCards
            counts={counts}
            componentCount={components.length}
            vulnerableComponentCount={vulnerableComponentCount}
            findingCount={results.length}
          />

          <ComponentTable
            components={components}
            vulnerableComponentKeys={vulnerableComponentKeys}
          />

          <FixPlanPanel
            autoFixPlan={autoFixPlan}
            manualFixPlan={manualFixPlan}
            isDownloading={isDownloading}
            onDownload={downloadFixedProjectZip}
          />

          <section style={styles.contentGrid}>
            <PriorityFixes topFixes={topFixes} />
            <VulnerabilityTable results={sortedResults} />
          </section>
        </>
      )}
    </main>
  );
}
