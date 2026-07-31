# UI Map & Component Structure
## Project: Dev Workflow Dashboard
## Last Updated: July 31, 2026

This document defines the high-level UI structure, page map, and component hierarchy
for the Dev Workflow Dashboard. It is intentionally minimal so Copilot CLI can
interpret it cleanly during scaffolding.

---

# 1. Pages

## DashboardPage
- Overview of tasks
- Recent activity log
- Quick links to other sections

## TasksPage
- List all tasks
- Create/edit/delete tasks
- Filter by category or status

## RecipesPage
- List workflow recipes
- View markdown content
- Create/edit/delete recipes

## SnippetsPage
- List code snippets
- Syntax-highlighted snippet viewer
- Create/edit/delete snippets

## ActivityLogPage
- Chronological list of logged events
- Includes tasks, notes, commits, PRs (optional GitHub integration)

---

# 2. Shared Layout Components

## Header
- App title
- Navigation links

## Sidebar
- Links to all pages
- Optional GitHub integration section

## MainContent
- Wrapper for page content

---

# 3. Reusable Components

## TaskCard
- Displays task title, category, status
- Edit/delete actions

## RecipeCard
- Displays recipe title and tags

## SnippetCard
- Displays snippet title, language, tags

## ActivityItem
- Displays event type, message, timestamp

## MarkdownViewer
- Renders markdown content

## MarkdownEditor
- Simple editor for recipe content

---

# 4. Navigation Structure

Dashboard  
Tasks  
Recipes  
Snippets  
Activity Log  
(Optional) GitHub

---

# 5. Notes

- UI should remain minimal and clean.
- Component hierarchy should stay shallow.
- Prefer small, focused components.
- Avoid unnecessary global state; use React Query for data.
