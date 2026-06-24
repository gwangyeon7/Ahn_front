import { CheckCircle2, ShieldAlert } from "lucide-react";
import { scanResultStyles as styles } from "../../styles/scanResult";

type RiskStatus = {
  label: string;
  title: string;
  description: string;
  bg: string;
  border: string;
  color: string;
};

type RiskOverviewProps = {
  riskStatus: RiskStatus;
  totalResults: number;
  vulnerableComponentCount: number;
  componentCount: number;
  safeComponentCount: number;
  vulnerableRatio: number;
};

const getRatioColor = (vulnerableRatio: number) => {
  if (vulnerableRatio === 0) return "#22c55e";
  if (vulnerableRatio >= 50) return "#ef4444";
  return "#f97316";
};

export function RiskOverview({
  riskStatus,
  totalResults,
  vulnerableComponentCount,
  componentCount,
  safeComponentCount,
  vulnerableRatio,
}: RiskOverviewProps) {
  return (
    <section style={styles.reportHero}>
      <div
        style={{
          ...styles.riskCardBase,
          background: riskStatus.bg,
          border: `1px solid ${riskStatus.border}`,
        }}
      >
        <div style={{ ...styles.riskIconBase, color: riskStatus.color }}>
          {totalResults > 0 ? <ShieldAlert size={25} /> : <CheckCircle2 size={25} />}
        </div>
        <div>
          <span style={{ ...styles.riskLabelBase, color: riskStatus.color }}>
            {riskStatus.label}
          </span>
          <h2 style={{ ...styles.riskTitleBase, color: riskStatus.color }}>
            {riskStatus.title}
          </h2>
          <p style={styles.riskText}>{riskStatus.description}</p>
        </div>
      </div>

      <aside style={styles.insightPanel}>
        <h2 style={styles.insightTitle}>구성요소 위험 비율</h2>
        <div style={styles.ratioBar}>
          <div
            style={{
              ...styles.ratioFillBase,
              width: `${vulnerableRatio}%`,
              background: getRatioColor(vulnerableRatio),
            }}
          />
        </div>
        <div style={styles.insightLine}>
          <span>취약 구성요소</span>
          <strong>
            {vulnerableComponentCount}개 / {componentCount}개
          </strong>
        </div>
        <div style={styles.insightLine}>
          <span>안전 또는 미탐지 구성요소</span>
          <strong>{safeComponentCount}개</strong>
        </div>
        <div style={styles.insightLine}>
          <span>전체 취약점 발견 건수</span>
          <strong>{totalResults}건</strong>
        </div>
      </aside>
    </section>
  );
}
