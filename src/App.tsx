import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
// import Login from "./Auth/Login"; // 나중에 Auth 폴더 작업 시 주석 해제
import "./App.css";

function App() {
  return (
    <Router>
      <Routes>
        {/* 1. 처음 들어오면 무조건 랜딩 페이지 */}
        <Route path="/" element={<Landing />} />

        {/* 2. 대시보드 주소 */}
        <Route path="/dashboard" element={<Dashboard />} />

        {/* 3. 혹시 이상한 주소로 들어오면 다시 랜딩으로 튕겨내기 */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
