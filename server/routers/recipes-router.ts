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

export const recipesRouter = createTRPCRouter({
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

  get: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .query(async ({ ctx, input }) => {
      const recipe = await ctx.prisma.workflowRecipe.findUnique({
        where: { id: input.id },
      })

      if (!recipe) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Recipe not found' })
      }

      return recipe
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.number().int().positive(),
        name: z.string().trim().min(1).max(120),
        steps: z.string().trim().min(1).max(2000),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const existingRecipe = await ctx.prisma.workflowRecipe.findUnique({
        where: { id: input.id },
      })

      if (!existingRecipe) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Recipe not found' })
      }

      const recipe = await ctx.prisma.workflowRecipe.update({
        where: { id: input.id },
        data: {
          name: input.name,
          steps: input.steps,
        },
      })

      await addActivity(ctx, 'update', 'recipe', recipe.id, `Updated recipe: ${recipe.name}`)
      return recipe
    }),

  delete: publicProcedure
    .input(z.object({ id: z.number().int().positive() }))
    .mutation(async ({ ctx, input }) => {
      const existingRecipe = await ctx.prisma.workflowRecipe.findUnique({
        where: { id: input.id },
      })

      if (!existingRecipe) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Recipe not found' })
      }

      await ctx.prisma.workflowRecipe.delete({
        where: { id: input.id },
      })

      await addActivity(
        ctx,
        'delete',
        'recipe',
        input.id,
        `Deleted recipe: ${existingRecipe.name}`,
      )

      return { success: true }
    }),
})
