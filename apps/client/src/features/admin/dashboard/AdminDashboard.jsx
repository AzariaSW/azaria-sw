import { useNavigate } from "react-router-dom";

import { Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";

import useProjects from "../../projects/hooks/useProjects";
import useSkills from "../../skills/hooks/useSkills";
import useMessage from "../../contact/hooks/useMessage";

import useGithubRepositories from "../../github/hooks/useGithubRepositories";
import useGithubActivity from "../../github/hooks/useGithubActivity";

import formatGithubEvent from "../../../utils/formatGithubEvent";
import formatRelativeTime from "../../../utils/formatRelativeTime";
import githubEventIcon from "../../../utils/githubEventIcon";

import Icon from "../../../lib/icons/Icon";

import "./AdminDashboard.css";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const projectsQuery = useProjects();
  const skillsQuery = useSkills();
  const messagesQuery = useMessage();
  const repositoriesQuery = useGithubRepositories();
  const activityQuery = useGithubActivity();

  const isLoading =
    projectsQuery.isLoading ||
    skillsQuery.isLoading ||
    messagesQuery.isLoading ||
    repositoriesQuery.isLoading ||
    activityQuery.isLoading;

  const hasError =
    projectsQuery.isError ||
    skillsQuery.isError ||
    messagesQuery.isError ||
    repositoriesQuery.isError ||
    activityQuery.isError;

  if (isLoading) {
    return (
      <main className="admin-dashboard">
        <Skeleton />
      </main>
    );
  }

  if (hasError) {
    return (
      <main className="admin-dashboard">
        <header className="admin-dashboard__header">
          <div>
            <h1>Dashboard</h1>
            <p>Manage your portfolio content and monitor activity.</p>
          </div>
        </header>

        <Card>
          <p className="admin-dashboard__error">
            Failed to load dashboard data.
          </p>
        </Card>
      </main>
    );
  }

  const projects = projectsQuery.data;
  const skills = skillsQuery.data;
  const messages = messagesQuery.data;
  const repositories = repositoriesQuery.data ?? [];
  const activities = activityQuery.data ?? [];

  const projectCount = projects?.pagination?.total ?? 0;
  const skillCount = skills?.pagination?.total ?? 0;
  const messageCount = messages?.pagination?.total ?? 0;

  const unreadMessageCount =
    messages?.items?.filter((message) => !message.isRead).length ?? 0;

  const repositoryCount = repositories.length;

  const recentActivities = activities.slice(0, 5);

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

          <strong className="admin-dashboard__stat-value">
            {projectCount}
          </strong>
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">Skills</span>

          <strong className="admin-dashboard__stat-value">{skillCount}</strong>
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">Messages</span>

          <strong className="admin-dashboard__stat-value">
            {messageCount}
          </strong>

          {unreadMessageCount > 0 && (
            <span className="admin-dashboard__stat-badge">
              {unreadMessageCount} unread
            </span>
          )}
        </Card>

        <Card className="admin-dashboard__stat">
          <span className="admin-dashboard__stat-label">
            GitHub Repositories
          </span>

          <strong className="admin-dashboard__stat-value">
            {repositoryCount}
          </strong>
        </Card>
      </section>

      <section className="admin-dashboard__content">
        <Card>
          <div className="admin-dashboard__section-header">
            <div>
              <h2>Quick Actions</h2>
              <p>Jump directly to common portfolio tasks.</p>
            </div>
          </div>

          <div className="admin-dashboard__actions">
            <button type="button" onClick={() => navigate("/admin/profile")}>
              Edit Profile
            </button>

            <button type="button" onClick={() => navigate("/admin/projects")}>
              Manage Projects
            </button>

            <button type="button" onClick={() => navigate("/admin/experience")}>
              Manage Experience
            </button>

            <button type="button" onClick={() => navigate("/admin/messages")}>
              View Messages
            </button>
          </div>
        </Card>

        <Card>
          <div className="admin-dashboard__section-header">
            <div>
              <h2>Recent Activity</h2>

              <p>Latest activity from your GitHub account.</p>
            </div>

            <button
              type="button"
              className="admin-dashboard__view-all"
              onClick={() => navigate("/admin/github")}
            >
              View GitHub
            </button>
          </div>

          {recentActivities.length === 0 ? (
            <div className="admin-dashboard__empty">
              <p>No recent GitHub activity.</p>
            </div>
          ) : (
            <div className="admin-dashboard__activity">
              {recentActivities.map((activity, index) => {
                const EventIcon = githubEventIcon(activity.type);

                return (
                  <article
                    className="admin-dashboard__activity-item"
                    key={activity.id ?? index}
                  >
                    <div className="admin-dashboard__activity-icon">
                      <Icon icon={EventIcon} size="sm" />
                    </div>

                    <div className="admin-dashboard__activity-info">
                      <strong>{formatGithubEvent(activity.type)}</strong>

                      <span>
                        {activity.repo?.name ??
                          activity.repository?.name ??
                          "GitHub activity"}
                      </span>
                    </div>

                    {activity.createdAt && (
                      <time>{formatRelativeTime(activity.createdAt)}</time>
                    )}
                  </article>
                );
              })}
            </div>
          )}
        </Card>
      </section>
    </main>
  );
}
