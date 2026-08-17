import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";
import useCreateProject from "../../../../projects/hooks/useCreateProject";
import useUpdateProject from "../../../../projects/hooks/useUpdateProject";
import projectSchema from "../../../../projects/validation/project.schema";
import { Button, Card, Input } from "../../../../../components/common";
import ProjectImageManager from "./ProjectImageManager";
import "./ProjectForm.css";

export default function ProjectForm({ project = null, onClose }) {
  const MAX_IMAGES = 20;

  const isEditing = Boolean(project);

  const createProject = useCreateProject();
  const updateProject = useUpdateProject();

  const [existingImages, setExistingImages] = useState(project?.images ?? []);
  const [deletedImages, setDeletedImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(projectSchema),

    defaultValues: {
      title: project?.title ?? "",
      description: project?.description ?? "",
      githubUrl: project?.githubUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
    },
  });

  useEffect(() => {
    reset({
      title: project?.title ?? "",
      description: project?.description ?? "",
      githubUrl: project?.githubUrl ?? "",
      liveUrl: project?.liveUrl ?? "",
    });

    setExistingImages(project?.images ?? []);
    setDeletedImages([]);
    setNewImages([]);
  }, [project, reset]);

  function handleExistingImageRemove(image) {
    setExistingImages((current) =>
      current.filter((item) => item.id !== image.id),
    );

    setDeletedImages((current) =>
      current.includes(image.id) ? current : [...current, image.id],
    );
  }

  function handleNewImagesChange(files) {
    const selectedFiles = Array.from(files);

    setNewImages((current) => {
      const remainingSlots =
        MAX_IMAGES - existingImages.length - current.length;

      return [...current, ...selectedFiles.slice(0, remainingSlots)];
    });
  }

  function handleNewImageRemove(index) {
    setNewImages((current) =>
      current.filter((_, imageIndex) => imageIndex !== index),
    );
  }

  function onSubmit(data) {
    const projectData = {
      ...data,
      images: newImages,
    };

    if (isEditing) {
      projectData.deletedImages = deletedImages;

      projectData.imageOrder = existingImages.map((image, index) => ({
        id: image.id,
        order: index + 1,
      }));
    }

    if (isEditing) {
      updateProject.mutate(
        {
          id: project.id,
          data: projectData,
        },
        {
          onSuccess: onClose,
        },
      );

      return;
    }

    createProject.mutate(projectData, {
      onSuccess: onClose,
    });
  }

  const isSubmitting = createProject.isPending || updateProject.isPending;

  return (
    <Card className="project-form">
      <form className="project-form__form" onSubmit={handleSubmit(onSubmit)}>
        <header className="project-form__header">
          <div>
            <h2>{isEditing ? "Edit Project" : "Add Project"}</h2>

            <p>
              {isEditing
                ? "Update the project information and images."
                : "Add a new project to your portfolio."}
            </p>
          </div>

          <button
            type="button"
            className="project-form__close"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close project form"
          >
            <Icon icon={X} size="sm" />
          </button>
        </header>

        <div className="project-form__fields">
          <Input
            label="Title"
            placeholder="Project title"
            error={errors.title?.message}
            {...register("title")}
          />

          <Input
            as="textarea"
            rows={7}
            label="Description"
            placeholder="Describe the project..."
            error={errors.description?.message}
            {...register("description")}
          />

          <div className="project-form__two-column">
            <Input
              type="url"
              label="GitHub URL"
              placeholder="https://github.com/..."
              error={errors.githubUrl?.message}
              {...register("githubUrl")}
            />

            <Input
              type="url"
              label="Live URL"
              placeholder="https://..."
              error={errors.liveUrl?.message}
              {...register("liveUrl")}
            />
          </div>
        </div>

        <ProjectImageManager
          existingImages={existingImages}
          newImages={newImages}
          onExistingImageRemove={handleExistingImageRemove}
          onNewImagesChange={handleNewImagesChange}
          onNewImageRemove={handleNewImageRemove}
          error={errors.images?.message}
        />

        <footer className="project-form__actions">
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
              "Create Project"
            )}
          </Button>
        </footer>
      </form>
    </Card>
  );
}
