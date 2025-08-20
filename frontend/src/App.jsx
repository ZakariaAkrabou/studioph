import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import ProtectedRoute from "./shared/components/ProtectedRoute";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes - accessible when not authenticated */}
        <Route path="/auth/*" element={<AuthRoutes />} />
        
        {/* Admin routes - protected by authentication */}
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          } 
        />
        
        {/* Default redirect */}
        <Route 
          path="*" 
          element={
            isAuthenticated ? 
              <Navigate to="/admin" replace /> : 
              <Navigate to="/auth/login" replace />
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
