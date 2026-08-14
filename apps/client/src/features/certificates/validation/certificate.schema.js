import { z } from "zod";

const experienceSchema = z.object({
  name: z
    .string()
    .min(1, "name is required.")
    .max(100, "name must be 100 characters or less."),

  issuer: z
    .string()
    .min(1, "issuer name is required.")
    .max(100, "issuer name must be 100 characters or less."),

  //TODO: configure the date formate properly
  issueDate: z.date(),

  credentialUrl: z.url().optional(),
});

export default experienceSchema;
