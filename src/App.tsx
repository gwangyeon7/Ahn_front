import React, { useState, useEffect } from "react";
import "./App.css";

// 1. 리더님의 Library.java 변수명과 똑같이 맞춘 인터페이스
interface Library {
  id: number;
  name: string; // 부품 이름
  version: string; // 부품 버전
  status: string; // 보안 상태
  license: string; // 라이선스 정보
  description: string; // 상세 설명
}

function App() {
  const [libraries, setLibraries] = useState<Library[]>([]);
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    // 2. 컨트롤러 주소(/api/libraries/libraries)로 정확히 노크합니다.
    fetch("http://localhost:8080/api/libraries/libraries")
      .then((res) => res.json())
      .then((data) => {
        console.log("DB 데이터 수신 성공:", data);
        setLibraries(data);
      })
      .catch((err) => console.error("데이터 연결 실패:", err));
  }, []);

  return (
    <div className="dashboard-container">
      <h1>🛡️ SBOM Security Analyzer</h1>

      <button
        className="main-btn"
        onClick={() => setShowDashboard(!showDashboard)}
      >
        {showDashboard ? "대시보드 닫기" : "데이터 분석 시작하기"}
      </button>

      {showDashboard && (
        <div className="content-fade-in">
          <div className="table-section">
            <h3>라이브러리 보안 상세 내역</h3>
            <table className="modern-table">
              <thead>
                <tr>
                  <th>번호</th>
                  <th>라이브러리명</th>
                  <th>버전</th>
                  <th>보안 상태</th>
                  <th>라이선스</th>
                </tr>
              </thead>
              <tbody>
                {libraries.map((lib) => (
                  <tr key={lib.id}>
                    <td>{lib.id}</td>
                    <td>
                      <strong>{lib.name}</strong>
                    </td>
                    <td>{lib.version}</td>
                    <td
                      className={`status-${
                        lib.status === "위험" ? "danger" : "safe"
                      }`}
                    >
                      {lib.status}
                    </td>
                    <td>{lib.license}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
