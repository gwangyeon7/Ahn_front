import { AlertTriangle } from "lucide-react";
import type { ScanResult } from "../../services/_private/SbomApi";
import { scanResultStyles as styles } from "../../styles/scanResult";
import { getFixGuide } from "../../utils/scanResultUtils";

type PriorityFixesProps = {
  topFixes: ScanResult[];
};

export function PriorityFixes({ topFixes }: PriorityFixesProps) {
  return (
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
              {item.fixedVer
                ? ` -> ${item.fixedVer} 이상 권장`
                : " -> 수정 버전 확인 필요"}
            </div>
            <div style={{ ...styles.guideBox, ...styles.mono }}>
              {getFixGuide(item)}
            </div>
          </div>
        ))
      )}
    </aside>
  );
}
