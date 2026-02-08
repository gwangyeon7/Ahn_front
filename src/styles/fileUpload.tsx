import type { CSSProperties } from "react";

export const fileUploadStyles: Record<string, CSSProperties> = {
  container: {
  minHeight: "100vh",
  background: "linear-gradient(180deg, #050a14 0%, #0b1220 100%)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
},


  content: {
  width: "100%",
  maxWidth: "860px",
  display: "flex",
  flexDirection: "column",
  gap: "14px",

  // ✅ 가운데 정렬
  alignItems: "center",
  textAlign: "center",
},


  title: {
    margin: 0,
    fontSize: "56px",
    fontWeight: 900,
    color: "#ffffff",
    letterSpacing: "-0.6px",
  },

  subTitle: {
    margin: 0,
    fontSize: "18px",
    color: "rgba(255,255,255,0.78)",
    lineHeight: 1.6,
    maxWidth: "720px",
  },

  // 업로드 카드(드롭존) - 메인 화면 버튼/톤에 맞춤
  dropCard: {
  width: "100%",
  maxWidth: "780px",
  marginTop: "18px",
  borderRadius: "16px",
  backgroundColor: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  boxShadow: "0 18px 60px rgba(0,0,0,0.35)",
  padding: "18px",
},


  dropZone: {
    borderRadius: "14px",
    border: "2px dashed rgba(255,255,255,0.24)",
    padding: "22px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.10)",
    textAlign: "center",
  },

  dropZoneActive: {
    border: "2px dashed rgba(79, 140, 255, 0.65)",
    backgroundColor: "rgba(79, 140, 255, 0.10)",
  },

  bigBtn: {
    width: "100%",
    height: "52px",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    backgroundColor: "#1f4e8c",
    color: "#ffffff",
    fontWeight: 800,
    letterSpacing: "0.5px",
    fontSize: "14px",
    boxShadow: "0 10px 26px rgba(31, 78, 140, 0.35)",
  },

  helper: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.65)",
  },

  note: {
    marginTop: "10px",
    fontSize: "12px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: 1.5,
  },

  fileList: {
    marginTop: "14px",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.10)",
    backgroundColor: "rgba(0,0,0,0.18)",
    overflow: "hidden",
  },

  fileRow: {
    padding: "12px 12px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    color: "rgba(255,255,255,0.88)",
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
    color: "rgba(255,255,255,0.58)",
  },

  removeBtn: {
    border: "1px solid rgba(255,255,255,0.18)",
    backgroundColor: "transparent",
    color: "rgba(255,255,255,0.82)",
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
    border: "1px solid rgba(255,255,255,0.18)",
    backgroundColor: "rgba(255,255,255,0.06)",
    color: "rgba(255,255,255,0.88)",
    cursor: "pointer",
    fontWeight: 800,
  },
};
