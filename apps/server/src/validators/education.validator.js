import { z } from "zod";
import id from "./id.validator.js";

export const educationSchema = z.object({
  body: z.object({
    institution: z.string().max(100),

    degree: z.string().max(50),

    field: z.string().max(100),

    startDate: z.coerce.date(),

    endDate:z.coerce.date().optional(),

  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateEducationSchema = z.object({
  body: z.object({
    institution: z.string().max(100).optional(),

    degree: z.string().max(50).optional(),

    field: z.string().max(100).optional(),

    startDate: z.coerce.date().optional(),

    endDate: z.coerce.date().optional(),

  }),

  params: id.shape.params,

  query: z.object({}),
});

export const idSchema=id;