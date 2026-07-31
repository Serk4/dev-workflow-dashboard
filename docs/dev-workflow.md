# Development Workflow (AI-Assisted)
## Project: Dev Workflow Dashboard
## Last Updated: July 31, 2026

This document defines the preferred development workflow for building the Dev Workflow Dashboard
using VS Code, GitHub, and Copilot CLI. It is intentionally concise so Copilot can interpret it
cleanly during scaffolding and iterative development.

---

# 1. Branching Strategy

- Main branch: stable, deployable code.
- Feature branches: one branch per feature or component.
- Naming convention: feature/<feature-name> (e.g., feature/tasks-page).

---

# 2. Commit & PR Workflow

- Small, frequent commits.
- Commit messages follow: <type>: <short description>
  - feat: new feature
  - fix: bug fix
  - docs: documentation
  - refactor: code cleanup
  - chore: tooling or config
- PRs should be short and focused.
- Copilot used for PR review suggestions.

---

# 3. Copilot CLI Usage

## Scaffolding
- Use Copilot CLI to generate:
  - React components
  - tRPC routers
  - Prisma models
  - Utility functions
  - Tests

## Iteration
- Use Copilot CLI to refine code, improve naming, simplify logic, and add comments.

## Documentation
- Use Copilot CLI to update README, architecture docs, and feature notes.

---

# 4. Development Steps

## Step 1: Backend Setup
- Initialize Node project.
- Add tRPC, Prisma, and database connection.
- Generate routers based on api-contract.md.
- Run initial Prisma migration.

## Step 2: Frontend Setup
- Create React + Vite project.
- Add routing and layout components.
- Add React Query for data fetching.
- Generate pages based on ui-map.md.

## Step 3: Core Features
- Implement tasks CRUD.
- Implement recipes CRUD.
- Implement snippets CRUD.
- Implement activity log.

## Step 4: Optional Features
- Add GitHub API integration.
- Add helper agents (task breakdown, recipe generation, snippet generation).

---

# 5. Testing Workflow

- Use Copilot CLI to generate unit tests.
- Use Copilot CLI to generate integration tests for tRPC.
- Run tests locally before PRs.

---

# 6. Deployment Workflow

- Frontend deployed to Vercel.
- Backend deployed to Railway or Fly.io.
- Database migrations run automatically on deploy.

---

# 7. Coding Principles

- Keep components small and focused.
- Keep routers simple and predictable.
- Maintain strong TypeScript typing.
- Avoid unnecessary complexity.
- Prefer clarity over cleverness.

---

# 8. Notes

- This workflow is designed for iterative, AI-assisted development.
- Copilot should be used throughout the entire lifecycle.
- Documentation should evolve as the project evolves.
