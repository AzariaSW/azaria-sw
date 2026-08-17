import { useState } from "react";

import useEducation from "../../../features/education/hooks/useEducation";
import useDeleteEducation from "../../../features/education/hooks/useDeleteEducation";
import { Button, Card } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import EducationForm from "./components/EducationForm/EducationForm";
import "./AdminEducation.css";

export default function AdminEducation() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState(null);
  const [page, setPage] = useState(1);

  const LIMIT = 10;

  const { data, isLoading, isError } = useEducation({
    page,
    limit: LIMIT,
  });

  const deleteEducation = useDeleteEducation();

  const educations = data?.items ?? [];
  const pagination = data?.pagination;

  function handleCreate() {
    setEditingEducation(null);
    setIsFormOpen(true);
  }

  function handleEdit(education) {
    setEditingEducation(education);
    setIsFormOpen(true);

    setTimeout(() => {
      document.querySelector(".education-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleDelete(education) {
    const confirmed = window.confirm(
      `Delete "${education.degree}" at "${education.institution}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteEducation.mutate(education.id);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingEducation(null);
  }

  function handlePreviousPage() {
    setPage((current) => Math.max(current - 1, 1));
  }

  function handleNextPage() {
    setPage((current) =>
      Math.min(current + 1, pagination?.totalPages ?? current),
    );
  }

  if (isLoading) {
    return (
      <main className="admin-education">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-education">
        <p className="failed">Failed to load education.</p>
      </main>
    );
  }

  return (
    <main className="admin-education">
      <header className="admin-education__header">
        <div>
          <h1>Education</h1>

          <p>
            Manage the education information displayed on your public portfolio.
          </p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Education
        </Button>
      </header>

      {isFormOpen && (
        <EducationForm education={editingEducation} onClose={handleFormClose} />
      )}

      <section className="admin-education__list">
        {educations.length === 0 ? (
          <Card>
            <p>No education entries have been added yet.</p>
          </Card>
        ) : (
          educations.map((education) => (
            <Card key={education.id}>
              <article className="admin-education__card">
                <div className="admin-education__info">
                  <h2>{education.institution}</h2>

                  <h3>{education.degree}</h3>

                  {education.field && (
                    <p className="admin-education__field">{education.field}</p>
                  )}

                  <div className="admin-education__dates">
                    <span>{formatDate(education.startDate)}</span>

                    <span>—</span>

                    <span>
                      {education.endDate
                        ? formatDate(education.endDate)
                        : "Present"}
                    </span>
                  </div>
                </div>

                <div className="admin-education__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(education)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    disabled={deleteEducation.isPending}
                    onClick={() => handleDelete(education)}
                  >
                    Delete
                  </Button>
                </div>
              </article>
            </Card>
          ))
        )}
      </section>

      {pagination && pagination.totalPages > 1 && (
        <nav
          className="admin-education__pagination"
          aria-label="Education pagination"
        >
          <Button
            type="button"
            variant="secondary"
            disabled={pagination.page <= 1}
            onClick={handlePreviousPage}
          >
            Previous
          </Button>

          <span>
            Page {pagination.page} of {pagination.totalPages}
          </span>

          <Button
            type="button"
            variant="secondary"
            disabled={pagination.page >= pagination.totalPages}
            onClick={handleNextPage}
          >
            Next
          </Button>
        </nav>
      )}
    </main>
  );
}

function formatDate(date) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
  });
}
