import { TRPCError } from '@trpc/server'
import { z } from 'zod'
import { createTRPCRouter, publicProcedure } from '../trpc.js'

const githubApiCall = async (endpoint: string, headers?: Record<string, string>) => {
  const token = process.env.GITHUB_TOKEN
  if (!token) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: 'GitHub token not configured',
    })
  }

  const response = await fetch(`https://api.github.com${endpoint}`, {
    headers: {
      Authorization: `token ${token}`,
      'X-GitHub-Api-Version': '2022-11-28',
      Accept: 'application/vnd.github+json',
      ...headers,
    },
  })

  if (!response.ok) {
    throw new TRPCError({
      code: 'INTERNAL_SERVER_ERROR',
      message: `GitHub API error: ${response.statusText}`,
    })
  }

  return response.json()
}

export const githubRouter = createTRPCRouter({
  repos: publicProcedure
    .input(
      z.object({
        owner: z.string().optional(),
        sort: z.enum(['created', 'updated', 'pushed', 'full_name']).optional(),
        per_page: z.number().int().positive().max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const query = new URLSearchParams({
        sort: input.sort ?? 'updated',
        per_page: input.per_page.toString(),
        type: 'owner',
      })

      const endpoint = input.owner
        ? `/users/${input.owner}/repos?${query}`
        : `/user/repos?${query}`

      return githubApiCall(endpoint)
    }),

  repo: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return githubApiCall(`/repos/${input.owner}/${input.repo}`)
    }),

  issues: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        state: z.enum(['open', 'closed', 'all']).default('open'),
        per_page: z.number().int().positive().max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const query = new URLSearchParams({
        state: input.state,
        per_page: input.per_page.toString(),
      })

      return githubApiCall(`/repos/${input.owner}/${input.repo}/issues?${query}`)
    }),

  pullRequests: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        state: z.enum(['open', 'closed', 'all']).default('open'),
        per_page: z.number().int().positive().max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const query = new URLSearchParams({
        state: input.state,
        per_page: input.per_page.toString(),
      })

      return githubApiCall(`/repos/${input.owner}/${input.repo}/pulls?${query}`)
    }),

  createIssue: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        title: z.string().min(1).max(200),
        body: z.string().max(65536).optional(),
        labels: z.array(z.string()).optional(),
      }),
    )
    .mutation(async ({ input }) => {
      return githubApiCall(`/repos/${input.owner}/${input.repo}/issues`, {
        'Content-Type': 'application/json',
      }).then((response) => {
        if (Array.isArray(response)) {
          return response[0]
        }
        return response
      })
    }),

  branchProtectionRules: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return githubApiCall(`/repos/${input.owner}/${input.repo}/branches`)
    }),

  workflows: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
      }),
    )
    .query(async ({ input }) => {
      return githubApiCall(`/repos/${input.owner}/${input.repo}/actions/workflows`)
    }),

  workflowRuns: publicProcedure
    .input(
      z.object({
        owner: z.string(),
        repo: z.string(),
        workflowId: z.union([z.string(), z.number()]),
        per_page: z.number().int().positive().max(100).default(10),
      }),
    )
    .query(async ({ input }) => {
      const query = new URLSearchParams({
        per_page: input.per_page.toString(),
      })

      return githubApiCall(
        `/repos/${input.owner}/${input.repo}/actions/workflows/${input.workflowId}/runs?${query}`,
      )
    }),

  user: publicProcedure.query(async () => {
    return githubApiCall('/user')
  }),
})
