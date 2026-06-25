import { Ban, CheckCircle2, ShieldQuestion } from "lucide-react";
import { scanResultStyles as styles } from "../../styles/scanResult";
import type { PolicyResult } from "../../services/_private/SbomApi";

type PolicyDecisionPanelProps = {
  policyResult: PolicyResult | null;
};

const decisionTheme = {
  BLOCK: {
    color: "#dc2626",
    bg: "#fff1f2",
    border: "#fecdd3",
    icon: Ban,
  },
  REVIEW: {
    color: "#ea580c",
    bg: "#fff7ed",
    border: "#fed7aa",
    icon: ShieldQuestion,
  },
  PASS: {
    color: "#15803d",
    bg: "#f0fdf4",
    border: "#bbf7d0",
    icon: CheckCircle2,
  },
};

export function PolicyDecisionPanel({ policyResult }: PolicyDecisionPanelProps) {
  if (!policyResult) return null;

  const theme =
    decisionTheme[policyResult.decision as keyof typeof decisionTheme] ??
    decisionTheme.REVIEW;
  const Icon = theme.icon;
  const violations = policyResult.violations ?? [];
  const passedRules = policyResult.passedRules ?? [];

  return (
    <section
      style={{
        ...styles.policyPanel,
        background: theme.bg,
        border: `1px solid ${theme.border}`,
      }}
    >
      <div style={styles.policyHeader}>
        <div style={{ ...styles.policyIcon, color: theme.color }}>
          <Icon size={24} />
        </div>
        <div>
          <span style={{ ...styles.policyBadge, color: theme.color }}>
            정책 판정
          </span>
          <h2 style={{ ...styles.policyTitle, color: theme.color }}>
            {policyResult.decisionLabel}
          </h2>
          <p style={styles.policySummary}>{policyResult.summary}</p>
        </div>
      </div>

      <div style={styles.policyGrid}>
        <div style={styles.policyRuleBox}>
          <h3 style={styles.policyRuleTitle}>위반 또는 검토 항목</h3>
          {violations.length > 0 ? (
            violations.map((item) => (
              <div key={item.ruleCode} style={styles.policyRuleItem}>
                <strong>{item.title}</strong>
                <p>{item.message}</p>
              </div>
            ))
          ) : (
            <p style={styles.policyEmptyText}>정책 위반 항목이 없습니다.</p>
          )}
        </div>

        <div style={styles.policyRuleBox}>
          <h3 style={styles.policyRuleTitle}>통과한 정책</h3>
          {passedRules.slice(0, 4).map((item) => (
            <div key={item.ruleCode} style={styles.policyRuleItem}>
              <strong>{item.title}</strong>
              <p>{item.message}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
