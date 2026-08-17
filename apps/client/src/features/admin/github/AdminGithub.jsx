import useGithubProfile from "../../../features/github/hooks/useGithubProfile";
import useGithubRepositories from "../../../features/github/hooks/useGithubRepositories";
import useGithubActivity from "../../../features/github/hooks/useGithubActivity";
import { Button, Card } from "../../../components/common";
import Icon from "../../../lib/icons/Icon";
import { MoveUpRight } from "../../../lib/icons";
import { Skeleton } from "../../../components/feedback";
import formatGithubEvent from "../../../utils/formatGithubEvent";
import formatRelativeTime from "../../../utils/formatRelativeTime";
import githubEventIcon from "../../../utils/githubEventIcon";
import githubLanguageColor from "../../../utils/githubLanguageColor";
import "./AdminGithub.css";

export default function AdminGithub() {
  const profile = useGithubProfile();
  const repositories = useGithubRepositories();
  const activity = useGithubActivity();

  const isLoading =
    profile.isLoading || repositories.isLoading || activity.isLoading;

  const isError = profile.isError || repositories.isError || activity.isError;

  if (isLoading) {
    return (
      <main className="admin-github">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-github">
        <section className="admin-github__error">
          <h1>GitHub</h1>

          <p className="failed">Failed to load GitHub data.</p>

          <Button
            type="button"
            onClick={() => {
              profile.refetch();
              repositories.refetch();
              activity.refetch();
            }}
          >
            Try Again
          </Button>
        </section>
      </main>
    );
  }

  const githubProfile = profile.data;

  const githubRepositories =
    repositories.data?.items ?? repositories.data ?? [];

  const githubActivity = activity.data?.items ?? activity.data ?? [];

  return (
    <main className="admin-github">
      <header className="admin-github__header">
        <div>
          <h1>GitHub</h1>

          <p>Monitor your GitHub profile, repositories, and recent activity.</p>
        </div>

        {githubProfile?.html_url && (
          <Button
            as="a"
            href={githubProfile.html_url}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
          >
            View GitHub
          </Button>
        )}
      </header>

      <section className="admin-github__profile">
        <Card>
          <div className="admin-github__profile-content">
            {githubProfile?.avatar_url && (
              <img
                className="admin-github__avatar"
                src={githubProfile.avatar_url}
                alt={
                  githubProfile.name || githubProfile.login || "GitHub profile"
                }
              />
            )}

            <div className="admin-github__profile-info">
              <div className="admin-github__profile-identity">
                <h2 className="admin-github__profile-name">
                  {githubProfile?.name || githubProfile?.login}
                </h2>

                {githubProfile?.login && (
                  <p className="admin-github__profile-username">
                    @{githubProfile.login}
                  </p>
                )}

                {githubProfile?.bio && (
                  <p className="admin-github__profile-bio">
                    {githubProfile.bio}
                  </p>
                )}
              </div>
              <div className="admin-github__stats">
                <div>
                  <strong>{githubProfile?.public_repos ?? 0}</strong>

                  <span>Repositories</span>
                </div>

                <div>
                  <strong>{githubProfile?.followers ?? 0}</strong>

                  <span>Followers</span>
                </div>

                <div>
                  <strong>{githubProfile?.following ?? 0}</strong>

                  <span>Following</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </section>

      <section className="admin-github__section">
        <div className="admin-github__section-header">
          <div>
            <h2>Repositories</h2>

            <p>Your repositories fetched from GitHub.</p>
          </div>
        </div>

        {githubRepositories.length === 0 ? (
          <Card>
            <p>No repositories found.</p>
          </Card>
        ) : (
          <div className="admin-github__repositories">
            {githubRepositories.map((repository) => (
              <Card key={repository.id}>
                <article className="admin-github__repository">
                  <div className="admin-github__repository-header">
                    <h3>{repository.name}</h3>

                    {repository.html_url && (
                      <a
                        href={repository.html_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${repository.name} on GitHub`}
                      >
                        <Icon icon={MoveUpRight} />
                      </a>
                    )}
                  </div>

                  {repository.description && (
                    <p className="admin-github__repository-description">
                      {repository.description}
                    </p>
                  )}

                  <div className="admin-github__repository-meta">
                    {repository.language && (
                      <span>
                        <i
                          style={{
                            backgroundColor: githubLanguageColor(
                              repository.language,
                            ),
                          }}
                        />

                        {repository.language}
                      </span>
                    )}

                    <span>★ {repository.stargazers_count ?? 0}</span>

                    <span>Forks {repository.forks_count ?? 0}</span>
                  </div>

                  {repository.updated_at && (
                    <time>
                      Updated {formatRelativeTime(repository.updated_at)}
                    </time>
                  )}
                </article>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Activity */}
      <section className="admin-github__section">
        <div className="admin-github__section-header">
          <div>
            <h2>Recent Activity</h2>

            <p>Your latest GitHub activity.</p>
          </div>
        </div>

        {githubActivity.length === 0 ? (
          <Card>
            <p>No recent activity found.</p>
          </Card>
        ) : (
          <Card>
            <div className="admin-github__activity">
              {githubActivity.map((event) => {
                const EventIcon = githubEventIcon(event.type);

                return (
                  <article
                    className="admin-github__activity-item"
                    key={event.id}
                  >
                    <div className="admin-github__activity-icon">
                      <EventIcon size={18} />
                    </div>

                    <div className="admin-github__activity-content">
                      <p>{formatGithubEvent(event.type)}</p>

                      {event.repo?.name && <span>{event.repo.name}</span>}

                      {event.created_at && (
                        <time>{formatRelativeTime(event.created_at)}</time>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </Card>
        )}
      </section>
    </main>
  );
}
