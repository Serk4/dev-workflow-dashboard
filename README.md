# dev-workflow-dashboard

A minimal **Dev Workflow Dashboard** sandbox built with **React + Vite + TypeScript**, **Prisma**, and a lightweight **Node/tRPC** backend.

## Features

- Task management (add + complete/reopen)
- Workflow recipe storage
- Snippet library
- Activity logging for key actions

## Tech stack

- Frontend: React + Vite + TypeScript
- Backend: Node + tRPC
- Data layer: Prisma + SQLite

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create an environment file:

   ```bash
   cp .env.example .env
   ```

3. Generate Prisma client and create the SQLite database schema:

   ```bash
   npm run prisma:generate
   npm run prisma:migrate -- --name init
   ```

4. Start the app:

   ```bash
   npm run dev
   ```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:4000/trpc`
