import React from "react";

export const middleStyles: Record<string, React.CSSProperties> = {
  // 미들 전체 영역
  container: {
    width: "100%",
    flex: 1,
    backgroundColor: "#0b1220",   // 이미지 대신 임시 배경
    display: "flex",
    alignItems: "center",
    padding: "0 60px",

    backgroundImage:
    "linear-gradient(180deg, rgba(5,10,20,0.55), rgba(5,10,20,0.65)), url('/paint.png')",
  backgroundSize: "cover",
  backgroundPosition: "center",
  backgroundRepeat: "no-repeat",
  },

  // 텍스트/버튼 묶음
  content: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    maxWidth: "700px",
  },

  title: {
    fontSize: "64px",
    fontWeight: 700,
    color: "#ffffff",
    margin: 0,
    lineHeight: 1.05,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },

  subTitle: {
    fontSize: "16px",
    color: "rgba(255,255,255,0.7)",
    lineHeight: 1.6,
    margin: 0,
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },

  // 버튼 (초록 대신 어두운 파란색)
  button: {
    marginTop: "10px",
    width: "160px",
    height: "46px",
    border: "none",
    borderRadius: "6px",
    backgroundColor: "#1f4e8c", // 어두운 파란
    color: "#ffffff",
    fontWeight: 800,
    fontSize: "13px",
    letterSpacing: "0.6px",
    cursor: "pointer",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },
};