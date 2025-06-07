import * as z from 'zod';

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6).trim(),
});

export type SignInSchema = z.infer<typeof signinSchema>;
