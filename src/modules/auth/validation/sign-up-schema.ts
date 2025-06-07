import * as z from 'zod';

export const signupSchema = z
  .object({
    name: z.string().min(3).trim(),
    email: z.string().email(),
    password: z.string().min(6).trim(),
    confirmPassword: z.string().min(6).trim(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: "Password don't match",
    path: ['confirmPassword'],
  });

export type SignUpSchema = z.infer<typeof signupSchema>;
