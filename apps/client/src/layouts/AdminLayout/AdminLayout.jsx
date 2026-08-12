import { Navigate, Outlet } from "react-router-dom";

import useAdminAuth from "../../features/admin/auth/context/useAdminAuth";
import AdminSidebar from "./components/AdminSidebar/AdminSidebar";
import AdminHeader from "./components/AdminHeader/AdminHeader";
import "./AdminLayout.css"

export default function AdminLayout() {
  const { isAuthenticated } = useAdminAuth();

  if (!isAuthenticated) {
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
