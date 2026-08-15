import { z } from "zod";
import id from "./id.validator.js";

export const certificateSchema = z.object({
  body: z.object({
    name: z.string().max(100),

    issuer: z.string().max(100),

    issueDate: z.coerce.date(),

    image: z.url().optional(),

    credentialUrl: z.url().optional(),

  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateCertificateSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),

    issuer: z.string().max(100).optional(),

    issueDate: z.coerce.date().optional(),

    image: z.url().optional(),

    credentialUrl: z.url().optional(),

  }),

  params: id.shape.params,

  query: z.object({}),
});

export const idSchema=id;