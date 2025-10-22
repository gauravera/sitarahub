// src/components/Layout.jsx
import { Outlet } from "react-router-dom";
import Header from "./Header";
import Footer from "./Footer";

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Child routes (Home, Cart, etc.) will be rendered here */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}