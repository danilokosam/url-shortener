import { z } from "zod";

export const createUserSchema = z.object({
    body: z.object({
      username: z
        .string({ required_error: "username is required" })
        .min(6, 'The username is very short'),
      email: z.email({ required_error: "email is required" }),
      password: z
        .min(8, 'The password is very short'),
      
    }),
    params: z.object({}),
    query: z.object({}),
  });