// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayouts";
import Dashboard from "../admin/pages/Dashboard";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<div className="p-6 bg-white rounded-2xl border">Portfolio Page</div>} />
        <Route path="categories" element={<div className="p-6 bg-white rounded-2xl border">Categories Page</div>} />
        <Route path="client-spaces" element={<div className="p-6 bg-white rounded-2xl border">Client Spaces Page</div>} />
        <Route path="settings" element={<div className="p-6 bg-white rounded-2xl border">Settings Page</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
