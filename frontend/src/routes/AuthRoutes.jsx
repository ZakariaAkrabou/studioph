import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "../admin/pages/auth/Login";
import Register from "../admin/pages/auth/Register";
import ForgotPassword from "../admin/pages/auth/ForgotPassword";
import ResetPassword from "../admin/pages/auth/ResetPassword";
import VerifyEmail from "../admin/pages/auth/VerifyEmail";

export default function AuthRoutes() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return (
    <Routes>
      <Route index element={<Navigate to="login" replace />} />
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="reset-password/:token" element={<ResetPassword />} />
      <Route path="verify/:token" element={<VerifyEmail />} />
      <Route path="*" element={<Navigate to="login" replace />} />
    </Routes>
  );
}
