// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayouts";
import Dashboard from "../admin/pages/Dashboard";
import Category from "../admin/pages/Category";
import Portfolio from "../admin/pages/Portfolio";
import Client from "../admin/pages/Client";
import Settings from "../admin/pages/Settings";
import ProtectedRoute from "../shared/components/ProtectedRoute";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="categories" element={ <Category /> } />
        <Route path="client-spaces" element={<Client />} />
        <Route path="settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
