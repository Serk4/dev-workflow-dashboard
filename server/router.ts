import { initTRPC } from '@trpc/server'
import type { Context } from './context.js'
import { tasksRouter } from './routers/tasks-router.js'
import { recipesRouter } from './routers/recipes-router.js'
import { snippetsRouter } from './routers/snippets-router.js'
import { activityRouter } from './routers/activity-router.js'
import { githubRouter } from './routers/github-router.js'

const t = initTRPC.context<Context>().create()

export const appRouter = t.router({
  task: tasksRouter,
  recipe: recipesRouter,
  snippet: snippetsRouter,
  activity: activityRouter,
  github: githubRouter,
})

export type AppRouter = typeof appRouter
