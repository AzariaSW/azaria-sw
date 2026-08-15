import { z } from "zod";

const experienceSchema = z.object({
  company: z
    .string()
    .min(1, "company name is required.")
    .max(100, "company name must be 100 characters or less."),

  role: z
    .string()
    .min(1, "role is required.")
    .max(50, "role must be 50 characters or less."),

  description: z
    .string()
    .max(1000, "description must be 1000 characters or less.")
    .optional(),

  startDate: z.coerce.date("start date is required"),

  endDate: z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value) : undefined)),
});

export default experienceSchema;
