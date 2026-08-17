import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";
import { Button, Card, Input } from "../../../../../components/common";
import { Spinner } from "../../../../../components/feedback";
import useCreateCertificate from "../../../../certificates/hooks/useCreateCertificate";
import useUpdateCertificate from "../../../../certificates/hooks/useUpdateCertificate";
import certificateSchema from "../../../../certificates/validation/certificate.schema";
import CertificateImageManager from "../CertificateImageManager/CertificateImageManager";
import "./CertificateForm.css";

export default function CertificateForm({ certificate = null, onClose }) {
  const [image, setImage] = useState(null);
  const isEditing = Boolean(certificate);

  const createCertificate = useCreateCertificate();
  const updateCertificate = useUpdateCertificate();

  const inputRef = useRef(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(certificateSchema),

    defaultValues: {
      name: certificate?.name ?? "",
      issuer: certificate?.issuer ?? "",
      issueDate: certificate?.issueDate
        ? formatDateForInput(certificate.issueDate)
        : "",
      credentialUrl: certificate?.credentialUrl ?? "",
      image: undefined,
    },
  });

  useEffect(() => {
    reset({
      name: certificate?.name ?? "",
      issuer: certificate?.issuer ?? "",
      issueDate: certificate?.issueDate
        ? formatDateForInput(certificate.issueDate)
        : "",
      credentialUrl: certificate?.credentialUrl ?? "",
      image: undefined,
    });

    if (inputRef.current) {
      inputRef.current.value = "";
    }
  }, [certificate, reset]);

  function onSubmit(data) {
    const certificateData = {
      ...data,
      image,
    };

    if (isEditing) {
      updateCertificate.mutate(
        {
          id: certificate.id,
          data: certificateData,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createCertificate.mutate(certificateData, {
      onSuccess: onClose,
    });
  }

  const isSubmitting =
    createCertificate.isPending || updateCertificate.isPending;

  return (
    <Card className="certificate-form">
      <form
        className="certificate-form__form"
        onSubmit={handleSubmit(onSubmit)}
      >
        <header className="certificate-form__header">
          <div>
            <h2>{isEditing ? "Edit Certificate" : "Add Certificate"}</h2>

            <p>
              {isEditing
                ? "Update the certificate information."
                : "Add a certificate to your portfolio."}
            </p>
          </div>

          <button
            type="button"
            className="certificate-form__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close certificate form"
          >
            <Icon icon={X} size="sm" />
          </button>
        </header>

        <div className="certificate-form__fields">
          <Input
            label="Certificate Name"
            placeholder="e.g. AWS Certified Developer"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Issuer"
            placeholder="e.g. Amazon Web Services"
            error={errors.issuer?.message}
            {...register("issuer")}
          />

          <Input
            type="date"
            label="Issue Date"
            error={errors.issueDate?.message}
            {...register("issueDate")}
          />

          <Input
            type="url"
            label="Credential URL"
            placeholder="https://..."
            error={errors.credentialUrl?.message}
            {...register("credentialUrl")}
          />

          <CertificateImageManager
            existingImage={certificate?.image}
            newImage={image}
            onImageChange={setImage}
            onImageRemove={() => setImage(null)}
          />
        </div>

        <footer className="certificate-form__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <Spinner />
            ) : isEditing ? (
              "Save Changes"
            ) : (
              "Create Certificate"
            )}
          </Button>
        </footer>
      </form>
    </Card>
  );
}

function formatDateForInput(date) {
  return new Date(date).toISOString().split("T")[0];
}
