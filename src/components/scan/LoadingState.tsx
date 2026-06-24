import { FileSearch } from "lucide-react";
import { scanResultStyles as styles } from "../../styles/scanResult";

export function LoadingState() {
  const loadingColor = "#334155";

  return (
    <main style={styles.page}>
      <section
        style={{
          ...styles.riskCardBase,
          background: "#ffffff",
          border: "1px solid #e2e8f0",
        }}
      >
        <div style={{ ...styles.riskIconBase, color: loadingColor }}>
          <FileSearch size={24} />
        </div>
        <div>
          <h1 style={{ ...styles.riskTitleBase, color: loadingColor }}>
            분석 결과를 불러오는 중입니다
          </h1>
          <p style={styles.riskText}>
            업로드된 파일의 구성요소와 취약점 정보를 정리하고 있습니다.
          </p>
        </div>
      </section>
    </main>
  );
}
