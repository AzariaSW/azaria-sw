import { Section } from "../../../components/layout";
import useGithubActivity from "../../github/hooks/useGithubActivity";
import useGithubRepositories from "../../github/hooks/useGithubRepositories";
import useGithubProfile from "../../github/hooks/useGithubProfile";
import { Skeleton } from "../../../components/feedback";
import { Button, Card, StatCard, Reveal } from "../../../components/common";
import githubLanguageColor from "../../../utils/githubLanguageColor";
import formatRelativeTime from "../../../utils/formatRelativeTime";
import formatGithubEvent from "../../../utils/formatGithubEvent";
import formatDate from "../../../utils/formatDate";
import githubEventIcon from "../../../utils/githubEventIcon";

import "./Github.css";

export default function Github() {
  const profileQuery = useGithubProfile();

  const repositoriesQuery = useGithubRepositories();

  const activityQuery = useGithubActivity();

  const isLoading =
    profileQuery.isLoading ||
    repositoriesQuery.isLoading ||
    activityQuery.isLoading;

  if (isLoading) {
    return <Skeleton />;
  }

  const isError =
    profileQuery.isError || repositoriesQuery.isError || activityQuery.isError;

  if (isError) {
    return (
      <main className="github">
        <section className="github__error">
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

  const profile = profileQuery.data;

  const repositories = repositoriesQuery.data ?? [];

  const latestRepositories = [...repositories]
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
    .slice(0, 4);

  const activity = activityQuery.data ?? [];

  const latestActivity = activity.slice(0, 5);

  return (
    <section id="github">
      <Section
        title="GitHub Activity"
        description="Recent commits from my public repositories."
      >
        <Reveal delay={0.5}>
          <div className="github__stats">
            <StatCard title="Repositories" value={profile.public_repos} />

            <StatCard title="Followers" value={profile.followers} />

            <StatCard title="Following" value={profile.following} />

            <StatCard
              title="GitHub Since"
              value={formatDate(profile.created_at)}
            />
          </div>
        </Reveal>

        <div className="github__repositories">
          <h3 className="github__heading">Latest Repositories</h3>

          <div className="github__repository-list">
            {latestRepositories.map((repository, index) => (
              <Reveal delay={index * 0.05}>
                <Card
                  as="a"
                  href={repository.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github__repository-card"
                >
                  <h4 className="github__repository-name">{repository.name}</h4>

                  <div className="github__language">
                    <span
                      className="github__language-dot"
                      style={{
                        backgroundColor: githubLanguageColor(
                          repository.language,
                        ),
                      }}
                    />

                    <span>{repository.language}</span>
                  </div>

                  <p className="github__repository-updated">
                    Updated {formatRelativeTime(repository.updated_at)}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>

        <div className="github__activity">
          <h3 className="github__heading">Recent Activity</h3>

          <div className="github__activity-list">
            {latestActivity.length ? (
              latestActivity.map((event, index) => {
                const Icon = githubEventIcon(event.type);

                return (
                  <Reveal delay={index * 0.05}>
                    <Card key={event.id} className="github__activity-card">
                      <h4 className="github__activity-type">
                        <Icon size={18} />

                        {formatGithubEvent(event.type)}
                      </h4>
                      <p className="github__activity-repository">
                        {event.repo.name}
                      </p>
                      <p className="github__activity-date">
                        {formatRelativeTime(event.created_at)}
                      </p>
                    </Card>
                  </Reveal>
                );
              })
            ) : (
              <p>No recent activity.</p>
            )}
          </div>
        </div>

        <div className="github__footer">
          <Button
            as="a"
            href={profile.html_url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Visit GitHub Profile
          </Button>
        </div>
      </Section>
    </section>
  );
}
