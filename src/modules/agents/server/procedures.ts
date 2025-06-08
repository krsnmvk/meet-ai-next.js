import { db } from '@/drizzle';
import { agentsTable } from '@/drizzle/schema';
import { baseProcedure, createTRPCRouter } from '@/trpc/init';

export const agentsRouter = createTRPCRouter({
  getMany: baseProcedure.query(async () => {
    const data = await db.select().from(agentsTable);

    return data;
  }),
});
