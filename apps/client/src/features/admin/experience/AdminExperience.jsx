import { useState } from "react";

import useExperiences from "../../../features/experience/hooks/useExperiences";
import useDeleteExperience from "../../../features/experience/hooks/useDeleteExperience";

import { Button, Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";

import ExperienceForm from "./components/ExperienceForm/ExperienceForm";

import "./AdminExperience.css";

export default function AdminExperience() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null);

  const { data, isLoading, isError } = useExperiences();
  const deleteExperience = useDeleteExperience();

  const experiences = data?.items ?? [];

  function handleCreate() {
    setEditingExperience(null);
    setIsFormOpen(true);
  }

  function handleEdit(experience) {
    setEditingExperience(experience);
    setIsFormOpen(true);

    setTimeout(() => {
      document.querySelector(".experience-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleDelete(experience) {
    const confirmed = window.confirm(
      `Delete "${experience.role} at ${experience.company}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteExperience.mutate(experience.id);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingExperience(null);
  }

  if (isLoading) {
    return (
      <main className="admin-experience">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-experience">
        <p className="failed">Failed to load experience.</p>
      </main>
    );
  }

  return (
    <main className="admin-experience">
      <header className="admin-experience__header">
        <div>
          <h1>Experience</h1>

          <p>Manage the professional experience displayed on your portfolio.</p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Experience
        </Button>
      </header>

      {isFormOpen && (
        <ExperienceForm
          experience={editingExperience}
          onClose={handleFormClose}
        />
      )}

      <section className="admin-experience__list">
        {experiences.length === 0 ? (
          <Card>
            <p>No experience entries have been added yet.</p>
          </Card>
        ) : (
          experiences.map((experience) => (
            <Card key={experience.id}>
              <article className="admin-experience__card">
                <div className="admin-experience__info">
                  <div className="admin-experience__heading">
                    <h2>{experience.role}</h2>

                    <span>{experience.company}</span>
                  </div>

                  <p className="admin-experience__dates">
                    {formatDate(experience.startDate)} —{" "}
                    {experience.endDate
                      ? formatDate(experience.endDate)
                      : "Present"}
                  </p>

                  {experience.description && (
                    <p className="admin-experience__description">
                      {experience.description}
                    </p>
                  )}

                  <div className="admin-experience__actions">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => handleEdit(experience)}
                    >
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="danger"
                      disabled={deleteExperience.isPending}
                      onClick={() => handleDelete(experience)}
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

function formatDate(date) {
  if (!date) {
    return "";
  }

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
  }).format(new Date(date));
}
