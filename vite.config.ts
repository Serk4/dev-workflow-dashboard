import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/trpc': {
        target: 'http://localhost:4000',
        rewrite: (path) => path.replace(/^\/trpc/, ''),
      },
    },
  },
})
