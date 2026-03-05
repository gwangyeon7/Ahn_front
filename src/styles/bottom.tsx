import React from "react";
import type { CSSProperties } from "react";

export const bottomStyles: Record<string, CSSProperties> = {
  container: {
    height: "160px",          // 바텀 높이 고정
    width: "100%",
    backgroundColor: "#eeeeee", // 탑바랑 톤 맞춘 어두운 색
    display: "flex",
    alignItems: "center",     // 세로 중앙
    justifyContent: "center", // 가로 중앙
  },

  text: {
    color: "#1f4e8c",
    fontSize: "14px",
  },
};