import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../auth/AuthContext";
import React from "react";
export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const loc = useLocation();
  if (!user)
    return <Navigate to="/login" replace state={{ from: loc.pathname }} />;
  return children;
}
