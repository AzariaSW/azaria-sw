import { useEffect, useMemo, useRef } from "react";

import { X } from "../../../../../lib/icons";
import Icon from "../../../../../lib/icons/Icon";
import { getAsset } from "../../../../../utils/getAsset";
import "./CertificateImageManager.css";

export default function CertificateImageManager({
  existingImage,
  newImage,
  onImageChange,
  onImageRemove,
  error,
}) {
  const MAX_FILE_SIZE = 10 * 1024 * 1024;
  const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
  const inputRef = useRef(null);

  const preview = useMemo(() => {
    if (!newImage) {
      return null;
    }

    return URL.createObjectURL(newImage);
  }, [newImage]);

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleFileChange(event) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const isInvalid =
      file.size > MAX_FILE_SIZE || !ALLOWED_TYPES.includes(file.type);

    if (isInvalid) {
      event.target.value = "";
      return;
    }

    onImageChange(file);

    event.target.value = "";
  }

  function handleRemove() {
    onImageRemove();
  }

  const hasImage = existingImage || newImage;

  return (
    <section className="certificate-image-manager">
      <div className="certificate-image-manager__header">
        <div>
          <h3>Certificate Image</h3>

          <p>Add a JPG, JPEG, PNG, or WebP image up to 10 MB.</p>
        </div>

        <button
          type="button"
          className="certificate-image-manager__add"
          onClick={() => inputRef.current?.click()}
        >
          {hasImage ? "Replace Image" : "Add Image"}
        </button>

        <input
          ref={inputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp"
          hidden
          onChange={handleFileChange}
        />
      </div>

      {error && <p className="certificate-image-manager__error">{error}</p>}

      {hasImage ? (
        <div className="certificate-image-manager__preview">
          <div className="certificate-image-manager__item">
            <img
              src={newImage ? preview : getAsset(existingImage)}
              alt={
                newImage?.name || existingImage?.altText || "Certificate image"
              }
            />

            <button
              type="button"
              className="certificate-image-manager__remove"
              onClick={handleRemove}
              aria-label="Remove certificate image"
            >
              <Icon icon={X} size="sm" />
            </button>

            <span
              className={`certificate-image-manager__badge ${
                newImage ? "certificate-image-manager__badge--new" : ""
              }`}
            >
              {newImage ? "New" : "Existing"}
            </span>
          </div>
        </div>
      ) : (
        <div className="certificate-image-manager__empty">
          <p>No image selected.</p>

          <button type="button" onClick={() => inputRef.current?.click()}>
            Select image
          </button>
        </div>
      )}
    </section>
  );
}
