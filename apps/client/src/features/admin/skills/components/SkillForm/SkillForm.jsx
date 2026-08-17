import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";
import useCreateSkill from "../../../../skills/hooks/useCreateSkill";
import useUpdateSkill from "../../../../skills/hooks/useUpdateSkill";
import { Spinner } from "../../../../../components/feedback";
import skillSchema from "../../../../skills/validation/skill.schema";
import { Button, Card, Input } from "../../../../../components/common";
import "./SkillForm.css";

export default function SkillForm({ skill = null, onClose }) {
  const isEditing = Boolean(skill);

  const createSkill = useCreateSkill();
  const updateSkill = useUpdateSkill();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(skillSchema),

    defaultValues: {
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level ?? "",
      icon: skill?.icon ?? "",
    },
  });

  useEffect(() => {
    reset({
      name: skill?.name ?? "",
      category: skill?.category ?? "",
      level: skill?.level ?? "",
      icon: skill?.icon ?? "",
    });
  }, [skill, reset]);

  function onSubmit(data) {
    if (isEditing) {
      updateSkill.mutate(
        {
          id: skill.id,
          data,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createSkill.mutate(data, {
      onSuccess: onClose,
    });
  }

  const isSubmitting = createSkill.isPending || updateSkill.isPending;

  return (
    <Card className="skill-form">
      <form className="skill-form__form" onSubmit={handleSubmit(onSubmit)}>
        <header className="skill-form__header">
          <div>
            <h2>{isEditing ? "Edit Skill" : "Add Skill"}</h2>

            <p>
              {isEditing
                ? "Update the skill information."
                : "Add a new skill to your portfolio."}
            </p>
          </div>

          <button
            type="button"
            className="skill-form__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close skill form"
          >
            <Icon icon={X} size="sm" />
          </button>
        </header>

        <div className="skill-form__fields">
          <Input
            label="Skill Name"
            placeholder="e.g. React"
            error={errors.name?.message}
            {...register("name")}
          />

          <Input
            label="Category"
            placeholder="e.g. Frontend"
            error={errors.category?.message}
            {...register("category")}
          />

          <Input
            label="Level"
            placeholder="e.g. Advanced"
            error={errors.level?.message}
            {...register("level")}
          />

          <Input
            type="url"
            label="Icon URL"
            placeholder="https://..."
            error={errors.icon?.message}
            {...register("icon")}
          />
        </div>

        <footer className="skill-form__actions">
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
              "Add Skill"
            )}
          </Button>
        </footer>
      </form>
    </Card>
  );
}
