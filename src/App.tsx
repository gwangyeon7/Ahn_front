import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import AppLayout from "./components/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LibraryList from "./pages/LibraryList";
import Vulnerability from "./pages/Vulnerability";
import ScanHistory from "./pages/ScanHistory";

// 1. 이거 꼭 추가해야 합니다! (경로가 src/auth/AuthContext.tsx 라면)
import { AuthProvider } from "./auth/AuthContext";

export default function App() {
  return (
    // 2. 전체를 AuthProvider로 감싸주세요. 그래야 useAuth()가 작동합니다.
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* 랜딩 */}
          <Route path="/" element={<Landing />} />
          {/* 로그인 */}
          <Route path="/login" element={<Login />} />

          {/* 앱 영역(보호 + 레이아웃) */}
          <Route
            path="/app"
            element={
              <RequireAuth>
                <AppLayout />
              </RequireAuth>
            }
          >
            <Route index element={<Navigate to="/app/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="libraries" element={<LibraryList />} />
            <Route path="vulnerabilities" element={<Vulnerability />} />
            <Route path="scans" element={<ScanHistory />} />
          </Route>

          {/* 그 외 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
