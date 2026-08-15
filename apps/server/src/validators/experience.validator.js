import { z } from "zod";
import id from "./id.validator.js";

export const experienceSchema = z.object({
  body: z.object({
    company: z.string().max(100),

    role: z.string().max(50),

    description: z.string().max(1000),

    startDate: z.coerce.date(),

    endDate: z.coerce.date().optional(),

  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateExperienceSchema = z.object({
  body: z.object({
    company: z.string().max(100).optional(),

    role: z.string().max(50).optional(),

    description: z.string().max(1000).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

  }),

  params: id.shape.params,

  query: z.object({}),
});

export const idSchema=id;