// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App"; // 남겨두신 그 App.tsx를 가져옵니다

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
