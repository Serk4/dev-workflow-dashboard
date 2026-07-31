Architecture Document — Dev Workflow Dashboard
Project: Dev Workflow Dashboard
Owner: Serk4
Last Updated: July 31, 2026

1. System Overview
The Dev Workflow Dashboard is a small, modular full‑stack web application built to serve as a sandbox for practicing AI‑assisted development workflows. The architecture emphasizes clarity, maintainability, and a clean separation of concerns. It uses a modern React + Vite frontend, a lightweight Node/tRPC backend, and Prisma for data modeling.

The system is intentionally simple but structured enough to support iterative development, refactoring, and automation using Copilot CLI and VS Code.

2. High-Level Architecture
Frontend
React + Vite + TypeScript

Component-driven architecture

State management: React Query (preferred) or SWR

UI library: MUI (or minimal custom styling)

Routing: React Router

Data fetching: tRPC client or REST fetch wrappers

Backend
Node.js

tRPC (recommended) for type-safe API contracts
or

Express + REST (fallback option)

Prisma ORM

SQLite (dev) / Postgres (prod)

Database
Prisma schema defines:

Task

WorkflowRecipe

Snippet

ActivityLog

User (optional)

Optional Integrations
GitHub REST API

Internal helper agents (task breakdown, recipe generation, snippet generation)

Deployment
Frontend: Vercel

Backend: Railway or Fly.io

Database: Railway Postgres or local SQLite for dev

CI/CD: GitHub Actions (lint, test, build)

3. Frontend Architecture
3.1 Directory Structure

```
/src
  /app
    /components
    /pages
    /hooks
    /utils
    /styles
  /lib
  /types
```

3.2 Component Map
Pages
DashboardPage  
Overview of tasks, recent activity, and quick actions.

TasksPage  
CRUD interface for tasks.

RecipesPage  
Markdown viewer/editor for workflow recipes.

SnippetsPage  
Code snippet library with copy-to-clipboard.

ActivityLogPage  
Timeline of commits, PRs, completed tasks, and notes.

Shared Components
Header

Sidebar

TaskCard

RecipeCard

SnippetCard

ActivityItem

MarkdownEditor

MarkdownViewer

3.3 State & Data Flow
React Query handles:

caching

background refresh

optimistic updates

tRPC client provides type-safe API calls

Global state kept minimal; local state preferred

3.4 UI/UX Principles
Clean, minimal, professional

Material Design-inspired

No flashy animations

Fast keyboard-friendly interactions

4. Backend Architecture
4.1 Directory Structure

```
/src/server
  /trpc
    /routers
    /context.ts
  /db
    prisma.ts
  /services
  /utils
```

4.2 API Design (tRPC)
Routers
taskRouter

getAll

create

update

delete

recipeRouter

getAll

create

update

delete

snippetRouter

getAll

create

update

delete

activityRouter

getAll

logEvent

githubRouter (optional)

getIssues

getPullRequests

getCommits

4.3 Services Layer
Encapsulates logic for:

GitHub API calls

Markdown processing

Snippet formatting

Activity logging

4.4 Error Handling
Centralized error formatter in tRPC

Graceful fallback UI on frontend

Logging via console or optional service

5. Database Schema (Prisma)
5.1 Models
Task
id

title

description

category

status

createdAt

updatedAt

WorkflowRecipe
id

title

content (markdown)

tags

createdAt

updatedAt

Snippet
id

title

code

language

tags

createdAt

updatedAt

ActivityLog
id

type (task, commit, PR, note)

message

metadata (JSON)

createdAt

User (optional)
id

name

email

6. Integration Points
6.1 GitHub API (Optional)
Used to pull:

issues

PRs

commits

Authentication via:

Personal Access Token

GitHub App (optional)

6.2 Internal Helper Agents (Optional)
Agents can be implemented as:

backend services

CLI tools

VS Code tasks

Possible agent tasks:

generate workflow recipes

break down tasks

generate code snippets

generate documentation

7. Deployment Architecture
Frontend (Vercel)
Automatic builds on push

Environment variables for API URL

Static asset optimization

Backend (Railway/Fly.io)
Node server

tRPC endpoints

Prisma migrations on deploy

Database
SQLite for local dev

Postgres for production

CI/CD
GitHub Actions:

lint.yml

test.yml

build.yml

8. Security & Permissions
No user authentication required (single-user app)

GitHub API tokens stored in environment variables

Rate limiting on GitHub API calls

Input validation in tRPC routers

9. Future Enhancements
Dark mode

Drag-and-drop task reordering

Workflow visualization graph

AI-assisted workflow recipe generation

Multi-user support

10. Summary
This architecture keeps the project small, clean, and highly suitable for practicing AI-assisted development. It provides enough structure to explore agents, automation, refactoring, and iterative workflows without becoming a large or unwieldy system.