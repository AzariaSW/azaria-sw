import { z } from "zod";
import id from "./id.validator.js";

export const projectSchema = z.object({
  body: z.object({
    title: z.string().max(100),

    description: z.string().max(1000),

    githubUrl: z.string().url().or(z.literal("")).optional(),

    liveUrl: z.string().url().or(z.literal("")).optional(),

    imageUrl: z.string().url().optional(),

    featured: z.coerce.boolean().optional(),

    deletedImages: z.array(z.string().uuid()).optional(),

    imageOrder: z
      .array(
        z.object({
          id: z.string().uuid(),

          order: z.number().int().nonnegative(),
        }),
      )
      .optional(),
  }),

  params: z.object({}),

  query: z.object({}),
});

export const updateProjectSchema = z.object({
  body: z.object({
    title: z.string().max(100).optional(),

    description: z.string().max(1000).optional(),

    githubUrl: z.string().url().or(z.literal("")).optional(),

    liveUrl: z.string().url().or(z.literal("")).optional(),

    imageUrl: z.string().url().optional(),

    featured: z.coerce.boolean().optional(),

    deletedImages: z.array(z.string().uuid()).optional(),

    imageOrder: z
      .array(
        z.object({
          id: z.string().uuid(),

          order: z.number().int().nonnegative(),
        }),
      )
      .optional(),
  }),

  params: id.shape.params,

  query: z.object({}),
});

export const idSchema = id;
