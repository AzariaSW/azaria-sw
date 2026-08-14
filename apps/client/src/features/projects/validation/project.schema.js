import { z } from "zod";

const projectSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required.")
    .max(100, "Title must be 100 characters or less."),

  description: z
    .string()
    .min(1, "Description is required.")
    .max(1000, "Description must be 1000 characters or less."),

  githubUrl: z
    .string()
    .url("Enter a valid GitHub URL.")
    .optional()
    .or(z.literal("")),

  liveUrl: z
    .string()
    .url("Enter a valid live URL.")
    .optional()
    .or(z.literal("")),
});

export default projectSchema;