import { z } from "zod";

const skillSchema = z.object({
  name: z
    .string()
    .min(1, "Skill name is required.")
    .max(100, "Skill name must be 100 characters or less."),

  category: z
    .string()
    .min(1, "Category is required.")
    .max(100, "Category must be 100 characters or less."),

  level: z
    .string()
    .min(1, "Skill level is required.")
    .max(50, "Skill level must be 50 characters or less."),

  icon: z
    .string()
    .url("Enter a valid icon URL.")
    .optional()
    .or(z.literal("")),
});

export default skillSchema;