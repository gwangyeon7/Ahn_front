import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Introduce from "../Screens/IntroduceScreen/Introduce";
import Login from "../Screens/LoginScreen/login";
import FileUploadScreen from "../Screens/FileUploadScreen";
import SignUp from "../Screens/LoginScreen/signup";

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/" element={<Introduce />} />
        <Route path="/login" element={<Login />} />
        <Route path="/upload" element={<FileUploadScreen />} />
      </Routes>
    </BrowserRouter>
  );
}
