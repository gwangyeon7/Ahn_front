import { useState } from "react";
import "./App.css";

interface SecurityIssue {
  id: number;
  library: string;
  status: "위험" | "주의" | "안전";
  version: string;
}

function App() {
  // 나중에 광연님이 만들 API에서 가져올 가짜 데이터입니다.
  const [issues] = useState<SecurityIssue[]>([
    { id: 1, library: "lodash", status: "위험", version: "4.17.20" },
    { id: 2, library: "axios", status: "안전", version: "1.6.0" },
    { id: 3, library: "express", status: "주의", version: "4.18.1" },
  ]);

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <header
        style={{ borderBottom: "2px solid #646cff", paddingBottom: "10px" }}
      >
        <h1>🛡️ Ahn_Front 보안 대시보드</h1>
        <p>프로젝트 내 외부 라이브러리 악성코드 감지 시스템</p>
      </header>

      <main style={{ marginTop: "30px" }}>
        <h2>SBOM 라이브러리 목록</h2>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginTop: "10px",
          }}
        >
          <thead>
            <tr style={{ background: "#f4f4f4" }}>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>ID</th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                라이브러리명
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                현재 버전
              </th>
              <th style={{ padding: "10px", border: "1px solid #ddd" }}>
                보안 상태
              </th>
            </tr>
          </thead>
          <tbody>
            {issues.map((issue) => (
              <tr key={issue.id} style={{ textAlign: "center" }}>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {issue.id}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {issue.library}
                </td>
                <td style={{ padding: "10px", border: "1px solid #ddd" }}>
                  {issue.version}
                </td>
                <td
                  style={{
                    padding: "10px",
                    border: "1px solid #ddd",
                    color:
                      issue.status === "위험"
                        ? "red"
                        : issue.status === "주의"
                        ? "orange"
                        : "green",
                    fontWeight: "bold",
                  }}
                >
                  {issue.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>

      <footer style={{ marginTop: "50px", fontSize: "0.8rem", color: "#666" }}>
        <p>© 2026 Ahn_Front Security Project - API 연동 준비 중</p>
      </footer>
    </div>
  );
}

export default App;
