import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom"; // 1. 이거 추가
import { AuthProvider } from "./auth/AuthContext";
import App from "./App";
import "./index.css";

const root = document.getElementById("root");
if (!root) throw new Error("root element not found");

ReactDOM.createRoot(root).render(
  <React.StrictMode>
    {/* 2. BrowserRouter가 가장 바깥에서 감싸줘야 useNavigate 에러가 사라집니다! */}
    <BrowserRouter>
      <AuthProvider>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
