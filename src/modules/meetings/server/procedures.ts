import * as z from 'zod';
import { db } from '@/drizzle';
import { meetingsTable } from '@/drizzle/schema';
import { createTRPCRouter, protectProcedure } from '@/trpc/init';
import { and, count, desc, eq, getTableColumns, ilike } from 'drizzle-orm';
import {
  DEFAULT_PAGE,
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  MIN_PAGE_SIZE,
} from '@/constants';
import { TRPCError } from '@trpc/server';

export const meetingsRouter = createTRPCRouter({
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
          ...getTableColumns(meetingsTable),
        })
        .from(meetingsTable)
        .where(
          and(
            eq(meetingsTable.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetingsTable.name, `${input.search}`)
              : undefined
          )
        )
        .orderBy(desc(meetingsTable.createdAt), desc(meetingsTable.id))
        .limit(input.pageSize)
        .offset((input.page - 1) * input.pageSize);

      const [total] = await db
        .select({
          count: count(),
        })
        .from(meetingsTable)
        .where(
          and(
            eq(meetingsTable.userId, ctx.auth.user.id),
            input?.search
              ? ilike(meetingsTable.name, `${input.search}`)
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
          ...getTableColumns(meetingsTable),
        })
        .from(meetingsTable)
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
});
