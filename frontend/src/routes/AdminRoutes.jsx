// src/routes/AdminRoutes.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "../admin/layouts/AdminLayouts";
import Dashboard from "../admin/pages/Dashboard";
import Category from "../admin/pages/Category";
import Portfolio from "../admin/pages/Portfolio";
import Client from "../admin/pages/Client";

export default function AdminRoutes() {
  return (
    <Routes>
      <Route element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="portfolio" element={<Portfolio />} />
        <Route path="categories" element={ <Category /> } />
        <Route path="client-spaces" element={<Client />} />
        <Route path="settings" element={<div className="p-6 bg-white rounded-2xl border">Settings Page</div>} />
      </Route>
      <Route path="*" element={<Navigate to="/admin" replace />} />
    </Routes>
  );
}
