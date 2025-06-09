import * as z from 'zod';

export const agentsInsrtSchema = z.object({
  name: z.string().min(1),
  instructions: z.string().min(3),
});

export const agentsUpdateSchema = agentsInsrtSchema.extend({
  id: z.string().min(1),
});

export type AgentsInsertSchema = z.infer<typeof agentsInsrtSchema>;
