import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc.js'

export const activityRouter = createTRPCRouter({
  list: publicProcedure
    .input(
      z
        .object({
          limit: z.number().int().positive().max(100),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.activityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: input?.limit ?? 25,
      }),
    ),

  listFiltered: publicProcedure
    .input(
      z
        .object({
          entityType: z.string().optional(),
          action: z.string().optional(),
          limit: z.number().int().positive().max(100),
        })
        .optional(),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.activityLog.findMany({
        where: {
          ...(input?.entityType && { entityType: input.entityType }),
          ...(input?.action && { action: input.action }),
        },
        orderBy: { createdAt: 'desc' },
        take: input?.limit ?? 50,
      }),
    ),

  getStats: publicProcedure.query(async ({ ctx }) => {
    const [totalCount, taskCount, recipeCount, snippetCount] = await Promise.all([
      ctx.prisma.activityLog.count(),
      ctx.prisma.activityLog.count({ where: { entityType: 'task' } }),
      ctx.prisma.activityLog.count({ where: { entityType: 'recipe' } }),
      ctx.prisma.activityLog.count({ where: { entityType: 'snippet' } }),
    ])

    return {
      total: totalCount,
      byEntity: {
        task: taskCount,
        recipe: recipeCount,
        snippet: snippetCount,
      },
    }
  }),

  getByDateRange: publicProcedure
    .input(
      z.object({
        startDate: z.string().datetime(),
        endDate: z.string().datetime(),
        limit: z.number().int().positive().max(100),
      }),
    )
    .query(({ ctx, input }) =>
      ctx.prisma.activityLog.findMany({
        where: {
          createdAt: {
            gte: new Date(input.startDate),
            lte: new Date(input.endDate),
          },
        },
        orderBy: { createdAt: 'desc' },
        take: input.limit,
      }),
    ),
})
