import React from "react";

export const styles: Record<string, React.CSSProperties> = {
  // 1. 상단바 전체 컨테이너
  headerContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 40px",
    height: "70px",
    backgroundColor: "#050a14",
    borderBottom: "1px solid #1a1f2b",
  },
  // 2. 로고 영역 (왼쪽)
  logoSection: {
    display: "flex",
    alignItems: "center",
    gap: "15px",
  },
  logoBox: {
    backgroundColor: "#1a1f2b",
    padding: "5px 8px",
    borderRadius: "4px",
    fontWeight: "bold",
    fontSize: "30px",
    color: "#fff",
  },
  logoTextContainer: {
    display: "flex",
    flexDirection: "column",
  },
  // 3. 메뉴 영역 (오른쪽)
  navSection: {
    display: "flex",
    alignItems: "center",
    gap: "25px",
  },
  navItem: {
    fontSize: "14px",
    color: "#ffffff",
    cursor: "pointer",
    opacity: 0.8,
  },
  loginBadge: {
    color: "#ffffff",
    padding: "10px 12px",

    fontSize: "12px",

    cursor: "pointer",
    margin: "100px",
    justifyContent: "center",
    width: "150px",
  },
};
