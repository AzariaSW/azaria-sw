import { z } from "zod";

const loginSchema = z.object({
  username: z
    .string()
    .min(1, "username is required.")
    .max(50, "Maximum 50 characters."),

  password: z
    .string()
    .min(1, "password is required.")
    .max(40, "Maximum 40 characters."),
});

export default loginSchema;
