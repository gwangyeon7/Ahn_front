import type { CSSProperties } from "react";

export const fileUploadStyles: Record<string, CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 60px",

    // 메인 히어로 섹션(middle)과 최대한 비슷한 톤
    backgroundColor: "#0b1220",
    backgroundImage:
      "linear-gradient(180deg, rgba(5,10,20,0.07), rgba(5,10,20,0.1)), url('/middleback.png')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    backgroundRepeat: "no-repeat",
  },

  content: {
    width: "100%",
    maxWidth: "860px",
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    alignItems: "flex-start",
    textAlign: "left",
  },

  title: {
    margin: 0,
    fontSize: "56px",
    fontWeight: 700,
    color: "#1f4e8c", // 메인 타이틀 컬러와 통일
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },

  subTitle: {
    margin: 0,
    fontSize: "16px",
    color: "#a6a6a6", // 메인 서브타이틀 컬러와 통일
    lineHeight: 1.6,
    maxWidth: "720px",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },

  // 업로드 카드(드롭존) - 메인 화면 버튼/톤에 맞춤
  dropCard: {
    width: "100%",
    maxWidth: "780px",
    marginTop: "22px",
    borderRadius: "18px",
    backgroundColor: "rgba(255,255,255,0.92)",
    border: "1px solid #e1e5f0",
    boxShadow: "0 18px 60px rgba(0,0,0,0.18)",
    padding: "20px",
  },

  dropZone: {
    borderRadius: "14px",
    border: "2px dashed rgba(31, 78, 140, 0.35)",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f7fb",
    textAlign: "center",
  },

  dropZoneActive: {
    border: "2px dashed rgba(31, 78, 140, 0.8)",
    backgroundColor: "#edf3ff",
  },

  bigBtn: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "#173357", // middleStyles.button과 유사한 톤
    color: "#ffffff",
    fontWeight: 800,
    letterSpacing: "0.6px",
    fontSize: "14px",
    boxShadow: "0 10px 26px rgba(31, 78, 140, 0.28)",
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },

  helper: {
    fontSize: "13px",
    color: "#4a4f63",
  },

  note: {
    marginTop: "10px",
    fontSize: "12px",
    color: "#6b7280",
    lineHeight: 1.5,
  },

  fileList: {
    marginTop: "14px",
    borderRadius: "12px",
    border: "1px solid #e1e5f0",
    backgroundColor: "#ffffff",
    overflow: "hidden",
  },

  fileRow: {
    padding: "12px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid #edf0f7",
    color: "#111827",
    fontSize: "13px",
  },

  fileRowLast: {
    borderBottom: "none",
  },

  fileMeta: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },

  fileName: {
    fontWeight: 800,
  },

  fileSize: {
    fontSize: "12px",
    color: "#6b7280",
  },

  removeBtn: {
    border: "1px solid #d1d5db",
    backgroundColor: "#ffffff",
    color: "#374151",
    borderRadius: "10px",
    height: "32px",
    padding: "0 10px",
    cursor: "pointer",
    fontWeight: 700,
  },

  actionRow: {
    marginTop: "12px",
    display: "flex",
    gap: "10px",
  },

  secondaryBtn: {
    height: "44px",
    padding: "0 14px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    backgroundColor: "#f9fafb",
    color: "#111827",
    cursor: "pointer",
    fontWeight: 800,
    fontFamily:
      "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Noto Sans KR', Arial, sans-serif",
  },
};
