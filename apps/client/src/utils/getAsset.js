import env from "../config/env";

export function getAsset(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }

  return `${env.UPLOAD_URL}${path}`;
}