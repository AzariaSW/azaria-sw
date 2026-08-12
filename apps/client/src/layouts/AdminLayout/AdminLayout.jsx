import { Outlet } from "react-router-dom";
import { Navigate, useLocation } from "react-router-dom";

import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import AdminHeader from "./components/AdminHeader/AdminHeader";

import "./AdminLayout.css"

export default function AdminLayout() {
  const location = useLocation();
  const token = location.state?.token;

  if (!token) {
    return <Navigate to="/" replace />;
  }
  
  return (
    <div className="admin-layout">
      <AdminSidebar />

      <div className="admin-layout__main">
        <AdminHeader />

        <main className="admin-layout__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
