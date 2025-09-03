import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ClientLayout() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: "#0D0D0D" }}>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
