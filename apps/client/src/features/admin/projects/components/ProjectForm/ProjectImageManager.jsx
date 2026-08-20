import { useEffect, useRef, useMemo } from "react";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";
import { getAsset } from "../../../../../utils/getAsset";

function NewImagePreview({ file, onRemove }) {
  const preview = useMemo(() => URL.createObjectURL(file), [file]);

  useEffect(() => {
    return () => {
      URL.revokeObjectURL(preview);
    };
  }, [preview]);

  return (
    <div className="project-image-manager__item">
      {preview && <img src={preview} alt={file.name} />}

      <button
        type="button"
        className="project-image-manager__remove"
        onClick={onRemove}
        aria-label="Remove selected image"
      >
        <Icon icon={X} size="sm" />
      </button>

      <span className="project-image-manager__badge project-image-manager__badge--new">
        New
      </span>
    </div>
  );
}

export default function ProjectImageManager({
  existingImages,
  newImages,
  onExistingImageRemove,
  onNewImagesChange,
  onNewImageRemove,
  error,
}) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

  const inputRef = useRef(null);

  function handleFileChange(event) {
    const files = Array.from(event.target.files ?? []);

    if (!files.length) {
      return;
    }

    const invalidFile = files.find(
      (file) => file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type),
    );

    if (invalidFile) {
      event.target.value = "";
      return;
    }

    onNewImagesChange(files);

    event.target.value = "";
  }

  return (
    <section className="project-image-manager">
      <div className="project-image-manager__header">
        <div>
          <h3>Project Images</h3>

          <p>Add up to 20 JPG, JPEG, PNG, or WebP images.</p>
        </div>

        <button
          type="button"
          className="project-image-manager__add"
          onClick={() => inputRef.current?.click()}
          disabled={existingImages.length + newImages.length >= 20}
        >
          Add Images
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          multiple
          hidden
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="project-image-manager__error">{error}</p>}

      {existingImages.length > 0 && (
        <div className="project-image-manager__grid">
          {existingImages.map((image) => (
            <div className="project-image-manager__item" key={image.id}>
              <img
                src={getAsset(image.url)}
                alt={image.altText || "Project image"}
              />

              <button
                type="button"
                className="project-image-manager__remove"
                onClick={() => onExistingImageRemove(image)}
                aria-label="Remove image"
              >
                <Icon icon={X} size="sm" />
              </button>

              <span className="project-image-manager__badge">Existing</span>
            </div>
          ))}
        </div>
      )}

      {newImages.length > 0 && (
        <div className="project-image-manager__grid">
          {newImages.map((file, index) => (
            <NewImagePreview
              key={`${file.name}-${file.lastModified}-${index}`}
              file={file}
              onRemove={() => onNewImageRemove(index)}
            />
          ))}
        </div>
      )}

      {existingImages.length === 0 && newImages.length === 0 && (
        <div className="project-image-manager__empty">
          <p>No images selected.</p>

          <button type="button" onClick={() => inputRef.current?.click()}>
            Select images
          </button>
        </div>
      )}
    </section>
  );
}
