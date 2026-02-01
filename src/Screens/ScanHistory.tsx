import { useNavigate } from "react-router-dom";   //검사 이력 요약

export default function ScanHistory() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2>검사 이력</h2>
      <button onClick={() => navigate("/")}>← 대시보드</button>
    </div>
  );
}
