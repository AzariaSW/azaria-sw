import { useState } from "react";

import useProjects from "../../../features/projects/hooks/useProjects";
import useDeleteProject from "../../../features/projects/hooks/useDeleteProject";
import { Button, Card, ImageCarousel } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import ProjectForm from "./components/ProjectForm/ProjectForm";
import "./AdminProjects.css";

export default function AdminProjects() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const { data, isLoading, isError } = useProjects();
  const deleteProject = useDeleteProject();

  const projects = data?.items ?? [];

  function handleCreate() {
    setEditingProject(null);
    setIsFormOpen(true);
  }

  function handleEdit(project) {
    setEditingProject(project);
    setIsFormOpen(true);

    setTimeout(() => {
      document.querySelector(".project-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleDelete(project) {
    const confirmed = window.confirm(
      `Delete "${project.title}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteProject.mutate(project.id);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingProject(null);
  }

  if (isLoading) {
    return (
      <main className="admin-projects">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-projects">
        <p className="failed">Failed to load projects.</p>
      </main>
    );
  }

  return (
    <main className="admin-projects">
      <header className="admin-projects__header">
        <div>
          <h1>Projects</h1>
          <p>Manage the projects displayed on your public portfolio.</p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Project
        </Button>
      </header>

      {isFormOpen && (
        <ProjectForm
          key={editingProject?.id ?? "new"}
          project={editingProject}
          onClose={handleFormClose}
        />
      )}

      <section className="admin-projects__list">
        {projects.length === 0 ? (
          <Card>
            <p>No projects have been added yet.</p>
          </Card>
        ) : (
          projects.map((project) => (
            <Card key={project.id}>
              <article className="admin-projects__card">
                <ImageCarousel images={project.images} alt={project.title} />

                <div className="admin-projects__info">
                  <h2>{project.title}</h2>

                  <p className="admin-projects__description">
                    {project.description}
                  </p>

                  <div className="admin-projects__meta">
                    <span>{project.images?.length ?? 0} images</span>

                    {project.featured && <span>Featured</span>}
                  </div>

                  <div className="admin-projects__actions">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEdit(project)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      disabled={deleteProject.isPending}
                      onClick={() => handleDelete(project)}
                    >
                      Delete
                    </Button>
                  </div>
                </div>
              </article>
            </Card>
          ))
        )}
      </section>
    </main>
  );
}
