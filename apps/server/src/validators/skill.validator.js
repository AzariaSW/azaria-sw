import { z } from "zod";
import id from "./id.validator.js";

export const skillSchema = z.object({
  body: z.object({
    name: z.string().max(100),

    category: z.string().max(100),

    level: z.string().max(50),

    icon: z.string().url().or(z.literal("")).optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateSkillSchema = z.object({
  body: z.object({
    name: z.string().max(100).optional(),

    category: z.string().max(50).optional(),

    level: z.string().max(30).optional(),

    icon: z.string().url().or(z.literal("")).optional(),
  }),
  params: id.shape.params,

  query: z.object({}),
});

export const idSchema = id;
