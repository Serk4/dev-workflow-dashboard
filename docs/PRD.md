Product Requirements Document (PRD)
Project: Dev Workflow Dashboard
Owner: Serk4
Last Updated: July 31, 2026

1. Overview
The Dev Workflow Dashboard is a small, modular web application designed to help engineers visualize, organize, and refine their personal development workflows. The primary purpose of this project is not the app itself, but the opportunity to practice modern software‑development methodologies using AI tools within VS Code, GitHub, and Copilot.

The app provides a simple interface for managing tasks, workflow recipes, reusable snippets, and development activity logs. It serves as a practical sandbox for experimenting with AI‑assisted planning, scaffolding, refactoring, documentation, testing, and automation.

2. Problem Statement
Modern development workflows involve many moving parts: tasks, snippets, patterns, documentation, and personal processes. Engineers often rely on ad‑hoc notes, scattered files, or memory. This leads to inefficiency and inconsistency.

The Dev Workflow Dashboard provides a centralized, minimal interface for organizing these elements while giving the developer a structured project to practice AI‑assisted development methodologies.

3. Goals
Primary Goals
Provide a small, well‑scoped app suitable for practicing:

PRD creation

architecture planning

AI‑assisted scaffolding

agent methodologies

GitHub workflows

VS Code + Copilot workflows

documentation generation

automated testing

iterative development

Create a dashboard that organizes:

tasks

workflow recipes

code snippets

development activity logs

Secondary Goals
Optional GitHub API integration

Optional internal “helper agents” for generating workflow recipes or task breakdowns

Optional theme customization

4. Non‑Goals
These are intentionally not part of the project scope:

Building a complex productivity app

Supporting multi‑user accounts or collaboration

Implementing advanced AI features as core functionality

Creating a mobile app

Providing real‑time sync or offline mode

Building a large backend system

The project must remain small and manageable.

5. Users & Personas
Primary User
Individual Developer (You)

Wants a structured project to practice AI‑assisted development

Prefers clean, minimal, professional interfaces

Values process‑driven workflows

Uses React + Vite + Prisma

Works in VS Code with Copilot

Wants to refine personal development habits

Secondary User (Optional)
Other engineers exploring AI‑assisted development

May fork the repo

May use the dashboard to organize their own workflows

6. Core Features
6.1 Task Manager
Create tasks

Categorize tasks (frontend, backend, docs, testing, etc.)

Mark tasks complete

View task history

6.2 Workflow Recipes
Store reusable “recipes” for development tasks

Markdown-based

Examples:

“How to scaffold a React component”

“How to create a Prisma model”

“How to write a PRD”

“How to set up GitHub Actions”

6.3 Snippet Library
Store reusable code snippets

Tag snippets (React, Prisma, SQL, Bash, etc.)

Copy-to-clipboard functionality

6.4 Activity Log / Timeline
Log completed tasks

Log commits (optional GitHub integration)

Log PR merges

Log notes

6.5 Optional GitHub Integration
Pull issues

Pull PRs

Pull commit history

6.6 Optional Internal Helper Agents
These are not required for the app to function but are ideal for practicing agent methodologies.

Possible helper agents:

Workflow recipe generator

Task breakdown generator

Code snippet generator

Documentation generator

7. Technical Requirements
Frontend
React

Vite

TypeScript

MUI or minimal custom styling

Backend
Choose one:

tRPC (recommended)

Express + REST

Database
Prisma

SQLite (local dev)

Postgres (production optional)

API Integrations
GitHub REST API (optional)

Deployment
Frontend: Vercel

Backend: Railway or Fly.io

8. AI Usage Plan (For Building the App)
AI tools are used to build the app, not power it.

AI Tools to Use
Copilot Chat for:

PRD generation

architecture planning

code scaffolding

refactoring

documentation

test generation

Copilot inline completions for:

boilerplate code

repetitive patterns

Copilot agents for:

generating component skeletons

generating Prisma schema

generating GitHub Actions

generating test suites

GitHub Copilot for PR reviews

GitHub Actions for automated builds/tests

AI Methodologies to Practice
Planner → Executor patterns

ReAct (reason + act)

Tool invocation patterns

Multi-agent orchestration

Structured prompting

Iterative refinement

9. Success Metrics
Primary
You successfully use AI tools throughout the entire development lifecycle

You complete the app with a clean, professional codebase

You establish a repeatable workflow for future projects

Secondary
Optional GitHub integration works

Optional helper agents work

Documentation is polished and complete

10. Risks & Mitigations
Risk: Scope creep
Mitigation: Keep features minimal; follow PRD strictly.

Risk: Overuse of AI leading to unclear code
Mitigation: Use AI for scaffolding, but manually refine final implementations.

Risk: GitHub API complexity
Mitigation: Make GitHub integration optional.

11. Milestones
Milestone 1 — Planning
PRD

Architecture

Repo setup

Milestone 2 — Scaffolding
Frontend structure

Backend structure

Prisma schema

Milestone 3 — Core Features
Task manager

Workflow recipes

Snippet library

Activity log

Milestone 4 — Optional Features
GitHub integration

Helper agents

Milestone 5 — Testing & Deployment
Unit tests

Integration tests

CI/CD

Deployment

Milestone 6 — Documentation
README

Architecture docs

Workflow docs

Demo GIF