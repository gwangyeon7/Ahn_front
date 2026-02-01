import { useNavigate } from "react-router-dom";    //전체 라이브러리

export default function LibraryList() {
  const navigate = useNavigate();
  return (
    <div style={{ padding: 24 }}>
      <h2>전체 라이브러리 목록</h2>
      <button onClick={() => navigate("/")}>← 대시보드</button>
    </div>
  );
}
