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
  },
  navItem: {
    fontSize: "14px",
    color: "#ffffff",
    cursor: "pointer",
    opacity: 0.8,
  },
  login: {
    fontSize: "14px",
    color: "#ffffff",
    cursor: "pointer",
    width: "70px",
    height: "40px", 
    background: "linear-gradient(180deg, #2f6fff 0%, #1f4ed8 100%)",
    borderRadius: "22px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 6px 14px rgba(47, 111, 255, 0.45)",    // 버튼 아래 입체 그림자
    fontWeight: 900,
  }
  
};
