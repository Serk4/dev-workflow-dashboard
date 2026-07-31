# API Contract (High-Level)
## Project: Dev Workflow Dashboard
## Last Updated: July 31, 2026

This document defines the high-level API structure for the Dev Workflow Dashboard.  
All routes are implemented using tRPC.  
Each router supports basic CRUD operations.

---

# Routers

## taskRouter
- getAll: returns all tasks
- getById(id)
- create({ title, description?, category? })
- update({ id, title?, description?, category?, status? })
- delete(id)

## recipeRouter
- getAll: returns all workflow recipes
- getById(id)
- create({ title, content, tags? })
- update({ id, title?, content?, tags? })
- delete(id)

## snippetRouter
- getAll: returns all snippets
- getById(id)
- create({ title, code, language, tags? })
- update({ id, title?, code?, language?, tags? })
- delete(id)

## activityRouter
- getAll: returns all activity logs
- logEvent({ type, message, metadata? })

## githubRouter (optional)
- getIssues(repo)
- getPullRequests(repo)
- getCommits(repo)

---

# Notes
- All inputs/outputs are strongly typed via TypeScript + Prisma.
- Routers should remain small and focused.
- GitHub integration is optional and isolated.
- No authentication required for core features.
