import { QueryClient } from '@tanstack/react-query'
import { createTRPCReact, httpBatchLink } from '@trpc/react-query'
import type { AppRouter } from '../../server/router'

export const trpc = createTRPCReact<AppRouter>()

export const queryClient = new QueryClient()

export const trpcClient = trpc.createClient({
  links: [
    httpBatchLink({
      url: '/trpc',
    }),
  ],
})
