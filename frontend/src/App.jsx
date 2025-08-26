import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import AdminRoutes from "./routes/AdminRoutes";
import AuthRoutes from "./routes/AuthRoutes";
import ClientRoutes from "./routes/ClientRoutes";
import ProtectedRoute from "./shared/components/ProtectedRoute";

export default function App() {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <BrowserRouter>
      <Routes>
     
        <Route path="/*" element={<ClientRoutes />} />
        
       
        <Route path="/auth/*" element={<AuthRoutes />} />
        
        <Route 
          path="/admin/*" 
          element={
            <ProtectedRoute>
              <AdminRoutes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </BrowserRouter>
  );
}
