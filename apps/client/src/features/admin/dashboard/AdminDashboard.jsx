import { Card } from "../../../components/common";
import "./AdminDashboard.css";

export default function AdminDashboard() {
  return (
    <main className="admin-dashboard">
      <header className="admin-dashboard__header">
        <div>
          <h1>Dashboard</h1>
          <p>Manage your portfolio content and monitor activity.</p>
        </div>
      </header>

      <section className="admin-dashboard__stats">
        <Card>
          <span>Projects</span>
          <strong>-</strong>
        </Card>

        <Card>
          <span>Skills</span>
          <strong>-</strong>
        </Card>

        <Card>
          <span>Messages</span>
          <strong>-</strong>
        </Card>

        <Card>
          <span>GitHub Repositories</span>
          <strong>-</strong>
        </Card>
      </section>

      <section className="admin-dashboard__content">
        <Card>
          <h2>Quick Actions</h2>

          <div className="admin-dashboard__actions">
            <button type="button">Edit Profile</button>
            <button type="button">Add Project</button>
            <button type="button">Add Experience</button>
            <button type="button">View Messages</button>
          </div>
        </Card>

        <Card>
          <h2>Recent Activity</h2>
          <p>No recent activity.</p>
        </Card>
      </section>
    </main>
  );
}
