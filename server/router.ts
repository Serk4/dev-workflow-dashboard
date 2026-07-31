import { initTRPC, TRPCError } from '@trpc/server'
import { z } from 'zod'
import type { Context } from './context.js'

const t = initTRPC.context<Context>().create()

const publicProcedure = t.procedure

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

export const appRouter = t.router({
  task: t.router({
    list: publicProcedure.query(({ ctx }) =>
      ctx.prisma.task.findMany({ orderBy: { createdAt: 'desc' } }),
    ),
    create: publicProcedure
      .input(
        z.object({
          title: z.string().trim().min(1).max(120),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const task = await ctx.prisma.task.create({ data: { title: input.title } })
        await addActivity(ctx, 'create', 'task', task.id, `Created task: ${task.title}`)
        return task
      }),
    toggle: publicProcedure
      .input(z.object({ id: z.number().int().positive() }))
      .mutation(async ({ ctx, input }) => {
        const existingTask = await ctx.prisma.task.findUnique({
          where: { id: input.id },
        })

        if (!existingTask) {
          throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
        }

        const task = await ctx.prisma.task.update({
          where: { id: input.id },
          data: { completed: !existingTask.completed },
        })

        await addActivity(
          ctx,
          'update',
          'task',
          task.id,
          `${task.completed ? 'Completed' : 'Reopened'} task: ${task.title}`,
        )

        return task
      }),
  }),
  recipe: t.router({
    list: publicProcedure.query(({ ctx }) =>
      ctx.prisma.workflowRecipe.findMany({ orderBy: { createdAt: 'desc' } }),
    ),
    create: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(1).max(120),
          steps: z.string().trim().min(1).max(2000),
        }),
      )
      .mutation(async ({ ctx, input }) => {
        const recipe = await ctx.prisma.workflowRecipe.create({ data: input })
        await addActivity(ctx, 'create', 'recipe', recipe.id, `Saved recipe: ${recipe.name}`)
        return recipe
      }),
  }),
  snippet: t.router({
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
        await addActivity(
          ctx,
          'create',
          'snippet',
          snippet.id,
          `Saved snippet: ${snippet.title}`,
        )
        return snippet
      }),
  }),
  activity: t.router({
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
  }),
})

export type AppRouter = typeof appRouter
