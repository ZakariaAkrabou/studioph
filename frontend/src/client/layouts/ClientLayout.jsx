import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
