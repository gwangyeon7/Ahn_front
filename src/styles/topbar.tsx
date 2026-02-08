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
    padding: "5px 8px",
    fontWeight: "bold",
    fontSize: "50px",
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
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },
  navItem: {
    fontSize: "14px",
    color: "#ffffff",
    cursor: "pointer",
    opacity: 0.8,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },
  login: {
    fontSize: "14px",
    color: "#ffffff",
    opacity: 0.8,
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  }
  
};
