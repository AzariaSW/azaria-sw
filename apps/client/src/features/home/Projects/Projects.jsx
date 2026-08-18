import { Section } from "../../../components/layout";
import useProjects from "../../projects/hooks/useProjects";
import { Skeleton } from "../../../components/feedback";
import {
  Button,
  Card,
  ImageCarousel,
  Reveal,
} from "../../../components/common";

import "./Projects.css";

export default function Projects() {
  const {
    data: projects = [],
    isLoading,
    isError,
  } = useProjects({
    sort: "featured",
    order: "desc"
  });
  const { items } = projects;
  if (isLoading) {
    return <Skeleton />;
  }

  if (isError) {
    return (
      <section id="projects" className="failed">
        Failed to load projects.
      </section>
    );
  }

  if (!items.length) {
    return (
      <section id="projects">
        <Section title="Projects" description="Applications I've built.">
          <p>No projects available.</p>
        </Section>
      </section>
    );
  }

  return (
    <section id="projects">
      <Section
        title="Projects"
        description="A selection of projects I've built and contributed to."
      >
        <div className="projects">
          {items.map((project, index) => (
            <Reveal delay={index * 0.08}>
              <Card key={project.id} className="project">
                <ImageCarousel images={project.images} alt={project.title} />

                <div className="project__body">
                  <div className="project__header">
                    <h3 className="project__title">{project.title}</h3>

                    {project.featured && (
                      <span className="project__badge">Featured</span>
                    )}
                  </div>
                  <p className="project__description">{project.description}</p>
                </div>

                <div className="project__footer">
                  {project.githubUrl && (
                    <Button
                      as="a"
                      href={project.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="secondary"
                    >
                      GitHub
                    </Button>
                  )}

                  {project.liveUrl && (
                    <Button
                      as="a"
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Live Demo
                    </Button>
                  )}
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>
    </section>
  );
}
