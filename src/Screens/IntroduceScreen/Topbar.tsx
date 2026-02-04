import React from "react";
import { styles } from "../../styles/Allbackroundstyle";

const Topbar = () => {
  return (
    <header style={styles.headerContainer}>
      {/* 로고 부분 */}
      <div style={styles.logoSection}>
        <div style={styles.logoBox}>ZCS</div>
        <div style={styles.logoTextContainer}>
          <div style={{ fontWeight: "bold", fontSize: "14px", color: "#fff" }}>
            Zero Check SBOM
          </div>
          <div style={{ fontSize: "10px", color: "#aaa" }}>
            Security Service
          </div>
        </div>
      </div>

      {/* 메뉴 부분 */}
      <nav style={styles.navSection}>
        <div style={styles.loginBadge}>홈</div>
        <span style={styles.navItem}>회사소개</span>
        <span style={styles.navItem}>사업소개</span>
        <span style={styles.navItem}>주요고객사</span>
        <span style={styles.navItem}>고객지원</span>
        <span style={styles.navItem}>점검</span>
      </nav>
    </header>
  );
};

export default Topbar;
