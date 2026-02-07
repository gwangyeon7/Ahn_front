import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Introduce from "../Screens/IntroduceScreen/Introduce";
import Login from "../components/login";
import FileUploadScreen from "../Screens/FileUploadScreen";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Introduce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<FileUploadScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
