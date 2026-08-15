import { z } from "zod";

const educationSchema = z.object({
  institution: z
    .string()
    .min(1, "institution name is required.")
    .max(100, "institution name must be 100 characters or less."),

  degree: z
    .string()
    .min(1, "degree is required.")
    .max(50, "degree must be 50 characters or less."),

  field: z
    .string()
    .max(100, "field must be 100 characters or less.")
    .optional(),

  startDate: z.coerce.date("start date is required"),

  endDate: z
    .string()
    .optional()
    .transform((value) => (value ? new Date(value) : undefined)),
});

export default educationSchema;
