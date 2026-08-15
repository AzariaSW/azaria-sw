import { z } from "zod";

const certificateSchema = z.object({
  name: z
    .string()
    .min(1, "name is required.")
    .max(100, "name must be 100 characters or less."),

  issuer: z
    .string()
    .min(1, "issuer name is required.")
    .max(100, "issuer name must be 100 characters or less."),

  issueDate: z.coerce.date("issue date is required"),

  credentialUrl: z.url().optional(),
});

export default certificateSchema;
