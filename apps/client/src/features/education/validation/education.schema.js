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
    .min(1, "field is required.")
    .max(100, "field must be 100 characters or less.")
    .optional(),

  //TODO: configure the date formate properly
  startDate: z.date(),

  endDate: z.date().optional(),
});

export default educationSchema;
