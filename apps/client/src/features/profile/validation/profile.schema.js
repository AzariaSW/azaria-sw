import { z } from "zod";

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const profileImageTypes = ["image/jpeg", "image/png", "image/webp"];

const pdfTypes = ["application/pdf"];

function optionalFile() {
  return z
    .any()
    .optional()
    .refine(
      (files) =>
        !files || files.length === 0 || files[0]?.size <= MAX_FILE_SIZE,
      "File must be 10 MB or smaller.",
    );
}

const profileSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, "Full name is required.")
    .max(100, "Full name must not exceed 100 characters."),

  title: z
    .string()
    .trim()
    .min(1, "Title is required.")
    .max(150, "Title must not exceed 150 characters."),

  bio: z
    .string()
    .trim()
    .min(1, "Bio is required.")
    .max(3000, "Bio must not exceed 3000 characters."),

  email: z
    .string()
    .trim()
    .min(1, "Email is required.")
    .email("Please enter a valid email address."),

  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required.")
    .max(20, "Phone number must not exceed 20 characters."),

  telegram: z
    .string()
    .trim()
    .min(5, "Telegram username must be at least 5 characters.")
    .max(32, "Telegram username must not exceed 32 characters."),

  location: z
    .string()
    .trim()
    .min(1, "Location is required.")
    .max(100, "Location must not exceed 100 characters."),

  github: z
    .string()
    .trim()
    .min(1, "GitHub URL is required.")
    .url("Please enter a valid GitHub URL."),

  linkedin: z
    .string()
    .trim()
    .min(1, "LinkedIn URL is required.")
    .url("Please enter a valid LinkedIn URL."),

  profileImage: optionalFile().refine(
    (files) =>
      !files ||
      files.length === 0 ||
      profileImageTypes.includes(files[0]?.type),
    "Profile image must be JPG, JPEG, PNG, or WebP.",
  ),

  resume: optionalFile().refine(
    (files) =>
      !files || files.length === 0 || pdfTypes.includes(files[0]?.type),
    "Resume must be a PDF.",
  ),

  cv: optionalFile().refine(
    (files) =>
      !files || files.length === 0 || pdfTypes.includes(files[0]?.type),
    "CV must be a PDF.",
  ),
});

export default profileSchema;
