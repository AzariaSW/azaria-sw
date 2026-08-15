import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";

import useCreateExperience from "../../../../experience/hooks/useCreateExperience";
import useUpdateExperience from "../../../../experience/hooks/useUpdateExperience";

import experienceSchema from "../../../../experience/validation/experience.schema";

import { Button, Card, Input } from "../../../../../components/common";

import "./ExperienceForm.css";

export default function ExperienceForm({ experience = null, onClose }) {
  const isEditing = Boolean(experience);

  const createExperience = useCreateExperience();
  const updateExperience = useUpdateExperience();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(experienceSchema),

    defaultValues: {
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      description: experience?.description ?? "",
      startDate: experience?.startDate
        ? toDateInputValue(experience.startDate)
        : "",
      endDate: experience?.endDate ? toDateInputValue(experience.endDate) : "",
    },
  });

  useEffect(() => {
    reset({
      company: experience?.company ?? "",
      role: experience?.role ?? "",
      description: experience?.description ?? "",
      startDate: experience?.startDate
        ? toDateInputValue(experience.startDate)
        : "",
      endDate: experience?.endDate ? toDateInputValue(experience.endDate) : "",
    });
  }, [experience, reset]);

  function onSubmit(data) {
    const experienceData = {
      ...data,

      startDate: new Date(data.startDate).toISOString(),

      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
    };

    if (isEditing) {
      updateExperience.mutate(
        {
          id: experience.id,
          data: experienceData,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createExperience.mutate(experienceData, {
      onSuccess: onClose,
    });
  }

  const isSubmitting = createExperience.isPending || updateExperience.isPending;

  return (
    <Card className="experience-form">
      <form className="experience-form__form" onSubmit={handleSubmit(onSubmit)}>
        <header className="experience-form__header">
          <div>
            <h2>{isEditing ? "Edit Experience" : "Add Experience"}</h2>

            <p>
              {isEditing
                ? "Update your professional experience."
                : "Add a professional experience to your portfolio."}
            </p>
          </div>

          <button
            type="button"
            className="experience-form__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close experience form"
          >
            <Icon icon={X} size="sm" />
          </button>
        </header>

        <div className="experience-form__fields">
          <div className="experience-form__two-column">
            <Input
              label="Company"
              placeholder="Company name"
              error={errors.company?.message}
              {...register("company")}
            />

            <Input
              label="Role"
              placeholder="e.g. Backend Developer"
              error={errors.role?.message}
              {...register("role")}
            />
          </div>

          <Input
            as="textarea"
            rows={7}
            label="Description"
            placeholder="Describe your responsibilities, achievements, and experience..."
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="experience-form__two-column">
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

          <p className="experience-form__date-hint">
            Leave the end date empty if this experience is current.
          </p>
        </div>

        <footer className="experience-form__actions">
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
                : "Add Experience"}
          </Button>
        </footer>
      </form>
    </Card>
  );
}

function toDateInputValue(date) {
  if (!date) {
    return "";
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "";
  }

  return parsedDate.toISOString().split("T")[0];
}
