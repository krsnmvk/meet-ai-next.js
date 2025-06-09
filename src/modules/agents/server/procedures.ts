import * as z from 'zod';
import { db } from '@/drizzle';
import { agentsTable } from '@/drizzle/schema';
import { createTRPCRouter, protectProcedure } from '@/trpc/init';
import { eq } from 'drizzle-orm';
import { agentsSchema } from '../validation/agents-schema';

export const agentsRouter = createTRPCRouter({
  create: protectProcedure
    .input(agentsSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .insert(agentsTable)
        .values({
          ...input,
          userId: ctx.auth.user.id,
        })
        .returning();

      return data;
    }),

  getMany: protectProcedure.query(async () => {
    const data = await db.select().from(agentsTable);

    return data;
  }),

  getOne: protectProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input }) => {
      const [data] = await db
        .select()
        .from(agentsTable)
        .where(eq(agentsTable.id, input.id));

      return data;
    }),
});
