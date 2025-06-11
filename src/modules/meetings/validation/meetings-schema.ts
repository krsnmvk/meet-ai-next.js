import * as z from 'zod';

export const meetingsInsrtSchema = z.object({
  name: z.string().min(1),
  agentId: z.string().min(3),
});

export const meetingsUpdateSchema = meetingsInsrtSchema.extend({
  id: z.string().min(1),
});

export type MeetingsInsertSchema = z.infer<typeof meetingsInsrtSchema>;
