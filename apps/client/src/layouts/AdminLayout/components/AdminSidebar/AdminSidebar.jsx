import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";

import useAdminAuth from "../../../../features/admin/auth/context/useAdminAuth";
import "./AdminSidebar.css";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin/dashboard",
  },
  {
    label: "Profile",
    path: "/admin/profile",
  },
  {
    label: "Projects",
    path: "/admin/projects",
  },
  {
    label: "Skills",
    path: "/admin/skills",
  },
  {
    label: "Experience",
    path: "/admin/experience",
  },
  {
    label: "Education",
    path: "/admin/education",
  },
  {
    label: "Certificates",
    path: "/admin/certificates",
  },
  {
    label: "Messages",
    path: "/admin/messages",
  },
  {
    label: "GitHub",
    path: "/admin/github",
  },
];

export default function AdminSidebar() {
  const { logout } = useAdminAuth();
  const navigate = useNavigate();

  function Logout() {
    logout();
    navigate("/", {
      replace: true,
    });
  }
  return (
    <aside className="admin-sidebar">
      <div className="admin-sidebar__brand">
        <span>Azaria-SW</span>
        <small>Admin</small>
      </div>

      <div className="admin-sidebar__breakline" />

      <nav className="admin-sidebar__nav">
        {navigation.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `admin-sidebar__link ${
                isActive ? "admin-sidebar__link--active" : ""
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="admin-sidebar__footer">
        <button type="button" onClick={Logout}>Logout</button>
      </div>
    </aside>
  );
}
