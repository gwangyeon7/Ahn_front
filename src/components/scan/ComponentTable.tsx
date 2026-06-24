import type { SbomComponent } from "../../services/_private/SbomApi";
import { scanResultStyles as styles } from "../../styles/scanResult";

type ComponentTableProps = {
  components: SbomComponent[];
  vulnerableComponentKeys: Set<string>;
};

export function ComponentTable({
  components,
  vulnerableComponentKeys,
}: ComponentTableProps) {
  return (
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
                  저장된 구성요소가 없습니다. ZIP 파일을 다시 업로드하거나, SBOM
                  파일에 components 항목이 있는지 확인하세요.
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
  );
}
