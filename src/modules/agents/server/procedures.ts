import * as z from 'zod';
import { db } from '@/drizzle';
import { agentsTable } from '@/drizzle/schema';
import { createTRPCRouter, protectProcedure } from '@/trpc/init';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import {
  agentsInsrtSchema,
  agentsUpdateSchema,
} from '../validation/agents-schema';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/constants';
import { TRPCError } from '@trpc/server';

export const agentsRouter = createTRPCRouter({
  create: protectProcedure
    .input(agentsInsrtSchema)
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

  getMany: protectProcedure
    .input(
      z.object({
        page: z.number().default(DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(MIN_PAGE_SIZE)
          .max(MAX_PAGE_SIZE)
          .default(DEFAULT_PAGE_SIZE),
        search: z.string().nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const data = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agentsTable),
        })
        .from(agentsTable)
        .where(
          and(
            eq(agentsTable.userId, ctx.auth.user.id),
            input?.search
              ? ilike(agentsTable.name, `${input.search}`)
              : undefined
          )
        )
        .orderBy(desc(agentsTable.createdAt), desc(agentsTable.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(agentsTable)
        .where(
          and(
            eq(agentsTable.userId, ctx.auth.user.id),
            input?.search
              ? ilike(agentsTable.name, `${input.search}`)
              : undefined
          )
        );

      const totalPages = Math.ceil(total.count / input.pageSize);

      return {
        items: data,
        total: total.count,
        totalPages,
      };
    }),

  getOne: protectProcedure
    .input(
      z.object({
        id: z.string().min(1),
      })
    )
    .query(async ({ input, ctx }) => {
      const [data] = await db
        .select({
          meetingCount: sql<number>`5`,
          ...getTableColumns(agentsTable),
        })
        .from(agentsTable)
        .where(
          and(
            eq(agentsTable.id, input.id),
            eq(agentsTable.userId, ctx.auth.user.id)
          )
        );

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
      }

      return data;
    }),

  remove: protectProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .delete(agentsTable)
        .where(
          and(
            eq(agentsTable.id, input.id),
            eq(agentsTable.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
      }

      return data;
    }),

  update: protectProcedure
    .input(agentsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .update(agentsTable)
        .set(input)
        .where(
          and(
            eq(agentsTable.id, input.id),
            eq(agentsTable.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Agent not found' });
      }

      return data;
    }),
});
