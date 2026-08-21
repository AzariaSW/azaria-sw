import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const UPLOAD = Object.freeze({
  BASE_DIRECTORY: path.resolve(__dirname, "../../uploads"),

  DESTINATIONS: {
    PROFILE: "profile",
    PROJECTS: "projects",
    CERTIFICATES: "certificates",
    RESUME: "resume",
    CV:"cv",
    TEMP:"temp"
  },

  MAX_FILE_SIZE: 10 * 1024 * 1024,

  IMAGE_TYPES: [
    "image/jpeg",
    "image/png",
    "image/webp",
  ],

  IMAGE_EXTENSIONS: [
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
  ],

  DOCUMENT_TYPES: [
    "application/pdf",
  ],

  DOCUMENT_EXTENSIONS: [

    ".pdf"
  ]
});