# Data Model & Prisma Schema
## Project: Dev Workflow Dashboard
## Last Updated: July 31, 2026

This document defines the data model for the Dev Workflow Dashboard.  
It includes Prisma schema models, entity relationships, and example queries.

---

## 1. Overview

The application uses a small set of core entities:

- Task — represents development tasks.
- WorkflowRecipe — markdown-based workflow instructions.
- Snippet — reusable code snippets.
- ActivityLog — chronological record of actions.
- User (optional) — single-user identity or future multi-user support.

The database is managed using Prisma ORM, with SQLite for development and Postgres optional for production.

---

## 2. Prisma Schema (Initial Draft)

datasource db {
  provider = "sqlite"
  url      = "file:./dev.db"
}

generator client {
  provider = "prisma-client-js"
}

model Task {
  id          String   @id @default(cuid())
  title       String
  description String?
  category    String?
  status      String   @default("pending")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@index([status])
}

model WorkflowRecipe {
  id        String   @id @default(cuid())
  title     String
  content   String   // markdown
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Snippet {
  id        String   @id @default(cuid())
  title     String
  code      String
  language  String
  tags      String[]
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model ActivityLog {
  id        String   @id @default(cuid())
  type      String   // "task", "commit", "pr", "note"
  message   String
  metadata  Json?
  createdAt DateTime @default(now())
}

model User {
  id        String   @id @default(cuid())
  name      String?
  email     String?
  createdAt DateTime @default(now())
}

---

## 3. Entity Relationships

The initial version of the app is single-user, so relationships are minimal.

Current Relationships:
- None required for core functionality.

Optional Future Relationships:
- User → Task[]
- User → WorkflowRecipe[]
- User → Snippet[]
- User → ActivityLog[]

---

## 4. Example Queries

Create a Task:
await prisma.task.create({
  data: {
    title: "Set up tRPC router",
    category: "backend",
  },
});

Get All Recipes:
const recipes = await prisma.workflowRecipe.findMany();

Search Snippets by Tag:
await prisma.snippet.findMany({
  where: {
    tags: { has: "react" }
  }
});

Log an Activity:
await prisma.activityLog.create({
  data: {
    type: "task",
    message: "Completed initial scaffolding",
  },
});

---

## 5. Migration Strategy

Development:
- Use SQLite for fast local iteration.
- Run migrations frequently as schema evolves.

Production (Optional):
- Switch to Postgres.
- Use Prisma’s migration system for schema evolution.

---

## 6. Notes

- Keep schema minimal until features require expansion.
- Avoid premature optimization.
- Maintain strong typing across frontend and backend via Prisma + tRPC.

