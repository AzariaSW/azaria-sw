import { useState } from "react";

import useCertificates from "../../../features/certificates/hooks/useCertificates";
import useDeleteCertificate from "../../../features/certificates/hooks/useDeleteCertificate";
import { Button, Card, ImageCarousel } from "../../../components/common";
import { Skeleton } from "../../../components/feedback";
import CertificateForm from "./components/CertificateForm/CertificateForm";
import "./AdminCertificates.css";

const LIMIT = 10;

export default function AdminCertificates() {
  const [page, setPage] = useState(1);

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [editingCertificate, setEditingCertificate] = useState(null);

  const { data, isLoading, isError } = useCertificates({
    page,
    limit: LIMIT,
  });

  const deleteCertificate = useDeleteCertificate();

  const certificates = data?.items ?? [];
  const pagination = data?.pagination;

  function handleCreate() {
    setEditingCertificate(null);
    setIsFormOpen(true);
  }

  function handleEdit(certificate) {
    setEditingCertificate(certificate);
    setIsFormOpen(true);

    setTimeout(() => {
      document.querySelector(".certificate-form")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }, 0);
  }

  function handleDelete(certificate) {
    const confirmed = window.confirm(
      `Delete "${certificate.name}"? This cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    deleteCertificate.mutate(certificate.id);
  }

  function handleFormClose() {
    setIsFormOpen(false);
    setEditingCertificate(null);
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
      <main className="admin-certificates">
        <Skeleton />
      </main>
    );
  }

  if (isError) {
    return (
      <main className="admin-certificates">
        <p className="failed">Failed to load certificates.</p>
      </main>
    );
  }

  return (
    <main className="admin-certificates">
      <header className="admin-certificates__header">
        <div>
          <h1>Certificates</h1>

          <p>Manage the certificates displayed on your public portfolio.</p>
        </div>

        <Button type="button" onClick={handleCreate}>
          Add Certificate
        </Button>
      </header>

      {isFormOpen && (
        <CertificateForm
          certificate={editingCertificate}
          onClose={handleFormClose}
        />
      )}

      <section className="admin-certificates__list">
        {certificates.length === 0 ? (
          <Card>
            <p>No certificates have been added yet.</p>
          </Card>
        ) : (
          certificates.map((certificate) => (
            <Card key={certificate.id}>
              <article className="admin-certificates__card">
                {certificate.image && (
                  <div className="admin-certificates__image">
                    <ImageCarousel
                      image={certificate.image}
                      alt={certificate.name}
                    />
                  </div>
                )}

                <div className="admin-certificates__info">
                  <h2>{certificate.name}</h2>

                  <p className="admin-certificates__issuer">
                    {certificate.issuer}
                  </p>

                  <p className="admin-certificates__date">
                    Issued {formatDate(certificate.issueDate)}
                  </p>

                  {certificate.credentialUrl && (
                    <a
                      className="admin-certificates__credential"
                      href={certificate.credentialUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      View Credential
                    </a>
                  )}
                </div>

                <div className="admin-certificates__actions">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => handleEdit(certificate)}
                  >
                    Edit
                  </Button>

                  <Button
                    type="button"
                    variant="danger"
                    disabled={deleteCertificate.isPending}
                    onClick={() => handleDelete(certificate)}
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
          className="admin-certificates__pagination"
          aria-label="Certificate pagination"
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
    day: "numeric",
  });
}
