import { scanResultStyles as styles } from "../../styles/scanResult";

type ScanSummaryCardsProps = {
  counts: Record<string, number>;
  componentCount: number;
  vulnerableComponentCount: number;
  findingCount: number;
};

export function ScanSummaryCards({
  counts,
  componentCount,
  vulnerableComponentCount,
  findingCount,
}: ScanSummaryCardsProps) {
  return (
    <section style={styles.summaryGrid}>
      {["Critical", "High", "Medium", "Low"].map((severity) => (
        <div key={severity} style={styles.summary}>
          <div style={styles.summaryLabel}>{severity}</div>
          <div style={styles.summaryValue}>{counts[severity] ?? 0}</div>
        </div>
      ))}
      <div style={styles.summary}>
        <div style={styles.summaryLabel}>Components</div>
        <div style={styles.summaryValue}>{componentCount}</div>
      </div>
      <div style={styles.summary}>
        <div style={styles.summaryLabel}>Vulnerable</div>
        <div style={styles.summaryValue}>{vulnerableComponentCount}</div>
      </div>
      <div style={styles.summary}>
        <div style={styles.summaryLabel}>Findings</div>
        <div style={styles.summaryValue}>{findingCount}</div>
      </div>
    </section>
  );
}
