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

export const tasksRouter = createTRPCRouter({
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

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        title: z.string().trim().min(1).max(120),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingTask = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      })

      if (!existingTask) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }

      const task = await ctx.prisma.task.update({
        where: { id: input.id },
        data: { title: input.title },
      })

      await addActivity(
        ctx,
        'update',
        'task',
        task.id,
        `Updated task: ${task.title}`,
      )

      return task
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const existingTask = await ctx.prisma.task.findUnique({
        where: { id: input.id },
      })

      if (!existingTask) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Task not found' })
      }

      await ctx.prisma.task.delete({
        where: { id: input.id },
      })

      await addActivity(
        ctx,
        'delete',
        'task',
        input.id,
        `Deleted task: ${existingTask.title}`,
      )

      return { success: true }
    }),
})
