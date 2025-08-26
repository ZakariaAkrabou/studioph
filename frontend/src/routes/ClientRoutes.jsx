import { Routes, Route } from "react-router-dom";
import ClientLayout from "../client/layouts/ClientLayout";
import HomePage from "../client/pages/Home";
import GalleryPage from "../client/pages/Gallery";
import AboutPage from "../client/pages/AboutUs";
import ContactPage from "../client/pages/Contact";
import SpaceClientPage from "../client/pages/SpaceClient";

export default function ClientRoutes() {
  return (
    <Routes>
      <Route element={<ClientLayout />}>
        <Route index element={<HomePage />} />
        <Route path="home" element={<HomePage />} />
        <Route path="gallery" element={<GalleryPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        <Route path="space/:key" element={<SpaceClientPage />} />
      </Route>
    </Routes>
  );
}
