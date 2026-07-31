import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import type { Context } from '../context.js'
import { createTRPCRouter, publicProcedure } from '../trpc.js'

const addActivity = (
  ctx: Context,
  action: string,
  entityType: string,
  entityId: number,
  message: string,
) =>
  ctx.prisma.activityLog.create({
    data: {
      action,
      entityType,
      entityId,
      message,
    },
  })

export const snippetsRouter = createTRPCRouter({
  list: publicProcedure.query(({ ctx }) =>
    ctx.prisma.snippet.findMany({ orderBy: { createdAt: 'desc' } }),
  ),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().trim().min(1).max(120),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const snippet = await ctx.prisma.snippet.create({ data: input })
      await addActivity(ctx, 'create', 'snippet', snippet.id, `Saved snippet: ${snippet.title}`)
      return snippet
    }),

  get: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const snippet = await ctx.prisma.snippet.findUnique({
        where: { id: input.id },
      })

      if (!snippet) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Snippet not found' })
      }

      return snippet
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().trim().min(1).max(120),
        content: z.string().trim().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingSnippet = await ctx.prisma.snippet.findUnique({
        where: { id: input.id },
      })

      if (!existingSnippet) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Snippet not found' })
      }

      const snippet = await ctx.prisma.snippet.update({
        where: { id: input.id },
        data: {
          title: input.title,
          content: input.content,
        },
      })

      await addActivity(ctx, 'update', 'snippet', snippet.id, `Updated snippet: ${snippet.title}`)
      return snippet
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const existingSnippet = await ctx.prisma.snippet.findUnique({
        where: { id: input.id },
      })

      if (!existingSnippet) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Snippet not found' })
      }

      await ctx.prisma.snippet.delete({
        where: { id: input.id },
      })

      await addActivity(
        ctx,
        'delete',
        'snippet',
        input.id,
        `Deleted snippet: ${existingSnippet.title}`,
      )

      return { success: true }
    }),
})
