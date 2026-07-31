import { createHTTPServer } from '@trpc/server/adapters/standalone'
import { createContext } from './context.js'
import { appRouter } from './router.js'

const port = Number(process.env.PORT ?? 4000)

const server = createHTTPServer({
  router: appRouter,
  createContext,
})

server.listen(port)
console.log(`tRPC server listening on http://localhost:${port}`)
