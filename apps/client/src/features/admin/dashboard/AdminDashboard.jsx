import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/common";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();
  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your portfolio content and monitor activity.</p>
        </div>
      </header>

      <section className="admin-dashboard__stats">
        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">Projects</span>
          <strong className="admin-dashboard__stat-value">-</strong>
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">Skills</span>
          <strong className="admin-dashboard__stat-value">-</strong>
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">Messages</span>
          <strong className="admin-dashboard__stat-value">-</strong>
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">
            GitHub Repositories
          </span>
          <strong className="admin-dashboard__stat-value">-</strong>
        </Card>
      </section>

      <section className="admin-dashboard__content">
        <Card>
          <h2>Quick Actions</h2>

          <div className="admin-dashboard__actions">
            <button type="button" onClick={() => navigate("/admin/profile")}>
              Edit Profile
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/projects/new")}
            >
              Add Project
            </button>
            <button
              type="button"
              onClick={() => navigate("/admin/experience/new")}
            >
              Add Experience
            </button>
            <button type="button" onClick={() => navigate("/admin/messages")}>
              View Messages
            </button>
          </div>
        </Card>

        <Card>
          <h2>Recent Activity</h2>

          <div className="admin-dashboard__empty">
            <p>No recent activity yet.</p>
          </div>
        </Card>
      </section>
    </main>
  );
}
