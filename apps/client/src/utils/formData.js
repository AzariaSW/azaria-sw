export default function toFormData(data) {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) {
      return;
    }

    if (value instanceof File) {
      formData.append(key, value);
      return;
    }

    if (Array.isArray(value)) {
      if (value.every((item) => item instanceof File)) {
        value.forEach((file) => {
          formData.append(key, file);
        });

        return;
      }

      if (value.length === 0) {
        return;
      }

      formData.append(key, JSON.stringify(value));
      return;
    }

    if (typeof value === "object") {
      formData.append(key, JSON.stringify(value));
      return;
    }

    formData.append(key, value);
  });

  return formData;
}