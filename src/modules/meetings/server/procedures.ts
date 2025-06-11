import * as z from 'zod';
import { db } from '@/drizzle';
import { agentsTable, meetingsTable } from '@/drizzle/schema';
import { createTRPCRouter, protectProcedure } from '@/trpc/init';
import { and, count, desc, eq, getTableColumns, ilike, sql } from 'drizzle-orm';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/constants';
import { TRPCError } from '@trpc/server';
import {
  meetingsInsrtSchema,
  meetingsUpdateSchema,
} from '../validation/meetings-schema';
import { MeetingStatus } from '../types';

export const meetingsRouter = createTRPCRouter({
  create: protectProcedure
    .input(meetingsInsrtSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .insert(meetingsTable)
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
        agentId: z.string().nullish(),
        status: z
          .enum([
            MeetingStatus.active,
            MeetingStatus.cancelled,
            MeetingStatus.completed,
            MeetingStatus.processing,
            MeetingStatus.upcoming,
          ])
          .nullish(),
      })
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, agentId, search, status } = input;

      const data = await db
        .select({
          ...getTableColumns(meetingsTable),
          agents: agentsTable,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration'
          ),
        })
        .from(meetingsTable)
        .innerJoin(agentsTable, eq(meetingsTable.agentId, agentsTable.id))
        .where(
          and(
            eq(meetingsTable.userId, ctx.auth.user.id),
            search ? ilike(meetingsTable.name, `${search}`) : undefined,
            status ? eq(meetingsTable.status, status) : undefined,
            agentId ? eq(meetingsTable.agentId, agentId) : undefined
          )
        )
        .orderBy(desc(meetingsTable.createdAt), desc(meetingsTable.id))
        .limit(pageSize)
        .offset((page - 1) * pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(meetingsTable)
        .innerJoin(agentsTable, eq(meetingsTable.agentId, agentsTable.id))
        .where(
          and(
            eq(meetingsTable.userId, ctx.auth.user.id),
            search ? ilike(meetingsTable.name, `${search}`) : undefined,
            status ? eq(meetingsTable.status, status) : undefined,
            agentId ? eq(meetingsTable.agentId, agentId) : undefined
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
          ...getTableColumns(meetingsTable),
          agents: agentsTable,
          duration: sql<number>`EXTRACT(EPOCH FROM (ended_at - started_at))`.as(
            'duration'
          ),
        })
        .from(meetingsTable)
        .innerJoin(agentsTable, eq(meetingsTable.agentId, agentsTable.id))
        .where(
          and(
            eq(meetingsTable.id, input.id),
            eq(meetingsTable.userId, ctx.auth.user.id)
          )
        );

      if (!data) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Meting not found' });
      }

      return data;
    }),

  remove: protectProcedure
    .input(z.object({ id: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .delete(meetingsTable)
        .where(
          and(
            eq(meetingsTable.id, input.id),
            eq(meetingsTable.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }

      return data;
    }),

  update: protectProcedure
    .input(meetingsUpdateSchema)
    .mutation(async ({ ctx, input }) => {
      const [data] = await db
        .update(meetingsTable)
        .set(input)
        .where(
          and(
            eq(meetingsTable.id, input.id),
            eq(meetingsTable.userId, ctx.auth.user.id)
          )
        )
        .returning();

      if (!data) {
        throw new TRPCError({
          code: 'NOT_FOUND',
          message: 'Meeting not found',
        });
      }

      return data;
    }),
});
