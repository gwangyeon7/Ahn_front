// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login"; // 로그인 페이지 임포트
import Dashboard from "./pages/Dashboard"; // 대시보드 페이지 임포트

function App() {
  return (
    <div className="App">
      <Routes>
        {/* 첫 화면은 무조건 랜딩 페이지 */}
        <Route path="/" element={<Landing />} />

        {/* 로그인 버튼 누르면 이동할 경로 */}
        <Route path="/login" element={<Login />} />

        {/* 로그인 성공 후 갈 대시보드 경로 */}
        <Route path="/app/dashboard" element={<Dashboard />} />

        {/* 추가적인 페이지들 (필요시) */}
        {/* <Route path="/vulnerabilities" element={<VulnerabilityList />} /> */}
      </Routes>
    </div>
  );
}

export default App;
