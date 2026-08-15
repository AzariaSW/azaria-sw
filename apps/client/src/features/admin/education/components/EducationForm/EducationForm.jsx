import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import useCreateEducation from "../../../../education/hooks/useCreateEducation";
import useUpdateEducation from "../../../../education/hooks/useUpdateEducation";
import educationSchema from "../../../../education/validation/education.schema";

import { Button, Card, Input } from "../../../../../components/common";

import "./EducationForm.css";

export default function EducationForm({ education = null, onClose }) {
  const isEditing = Boolean(education);

  const createEducation = useCreateEducation();
  const updateEducation = useUpdateEducation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(educationSchema),

    defaultValues: {
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      field: education?.field ?? "",
      startDate: education?.startDate ? education.startDate.slice(0, 10) : "",
      endDate: education?.endDate ? education.endDate.slice(0, 10) : "",
    },
  });

  useEffect(() => {
    reset({
      institution: education?.institution ?? "",
      degree: education?.degree ?? "",
      field: education?.field ?? "",
      startDate: education?.startDate ? education.startDate.slice(0, 10) : "",
      endDate: education?.endDate ? education.endDate.slice(0, 10) : "",
    });
  }, [education, reset]);

  function onSubmit(data) {
    if (isEditing) {
      updateEducation.mutate(
        {
          id: education.id,
          data,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createEducation.mutate(data, {
      onSuccess: onClose,
    });
  }

  const isSubmitting = createEducation.isPending || updateEducation.isPending;

  return (
    <Card className="education-form">
      <form className="education-form__form" onSubmit={handleSubmit(onSubmit)}>
        <header className="education-form__header">
          <div>
            <h2>{isEditing ? "Edit Education" : "Add Education"}</h2>

            <p>
              {isEditing
                ? "Update your education information."
                : "Add an education entry to your portfolio."}
            </p>
          </div>
        </header>

        <div className="education-form__fields">
          <Input
            label="Institution"
            placeholder="University or institution"
            error={errors.institution?.message}
            {...register("institution")}
          />

          <Input
            label="Degree"
            placeholder="e.g. Bachelor of Science"
            error={errors.degree?.message}
            {...register("degree")}
          />

          <Input
            label="Field of Study"
            placeholder="e.g. Software Engineering"
            error={errors.field?.message}
            {...register("field")}
          />

          <div className="education-form__dates">
            <Input
              type="date"
              label="Start Date"
              error={errors.startDate?.message}
              {...register("startDate")}
            />

            <Input
              type="date"
              label="End Date"
              error={errors.endDate?.message}
              {...register("endDate")}
            />
          </div>
        </div>

        <footer className="education-form__actions">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>

          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save Changes"
                : "Add Education"}
          </Button>
        </footer>
      </form>
    </Card>
  );
}
