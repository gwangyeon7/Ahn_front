import React from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/currentUser";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isLoggedIn()) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
