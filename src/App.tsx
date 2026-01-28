import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RequireAuth from "./components/RequireAuth";
import AppLayout from "./components/AppLayout";

import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import LibraryList from "./pages/LibraryList";
import Vulnerability from "./pages/Vulnerability";
import ScanHistory from "./pages/ScanHistory";

export default function App() {
  return (
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
  );
}
