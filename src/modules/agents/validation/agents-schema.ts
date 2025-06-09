import * as z from 'zod';

export const agentsSchema = z.object({
  name: z.string().min(1),
  instructions: z.string().min(3),
});

export type AgentsSchema = z.infer<typeof agentsSchema>;
