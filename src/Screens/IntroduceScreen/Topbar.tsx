import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../../styles/topbar";

const Topbar = () => {
  const navigate = useNavigate();

  return (
    <header style={styles.headerContainer}>
      {/* 로고 부분 */}
      <div style={styles.logoSection}>
        <div style={styles.logoBox}>
          <div style={{fontWeight: "bold", fontSize: "40px", color: "#1f4e8c" }}>
            ZCS
          </div>
        </div>

        <div style={styles.logoTextContainer}>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",fontWeight: "bold", fontSize: "14px", color: "#1f4e8c" }}>
            Zero Check SBOM
          </div>
          <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",fontSize: "10px", color: "#aaa" }}>
            Security Service
          </div>
        </div>
      </div>

      {/* 메뉴 부분 */}
      <nav style={styles.navSection}>
        <span style={styles.navItem}onClick={() => navigate("/upload")}>파일 입력</span>
        <span style={styles.navItem}onClick={() => navigate("/history")}>저장소</span>
        <span style={styles.navItem}onClick={() => navigate("/dashboard")}>대시보드</span>
        <span style={styles.navItem}>해결방안</span>
        <span style={styles.login}onClick={() => navigate("/login")}>로그인</span>
      </nav>
    </header>
  );
};

export default Topbar;
