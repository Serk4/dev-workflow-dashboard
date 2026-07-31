# Functional & Non‑Functional Requirements
## Project: Dev Workflow Dashboard
## Last Updated: July 31, 2026

---

## 1. Functional Requirements

### 1.1 Task Management
- Create new tasks with title, description, category, and status.
- Edit existing tasks.
- Mark tasks as complete.
- Delete tasks.
- View all tasks in a list.
- Filter tasks by category or status.

### 1.2 Workflow Recipes
- Create new workflow recipes stored as markdown.
- Edit recipe content.
- Tag recipes (e.g., frontend, backend, docs).
- View recipes in a markdown viewer.
- Delete recipes.

### 1.3 Snippet Library
- Store reusable code snippets.
- Tag snippets by language or purpose.
- View snippets with syntax highlighting.
- Copy snippet content to clipboard.
- Delete snippets.

### 1.4 Activity Log
- Log completed tasks.
- Log notes.
- Log commit/PR events (optional GitHub integration).
- View chronological timeline.

### 1.5 Optional GitHub Integration
- Fetch issues from a repository.
- Fetch pull requests.
- Fetch recent commits.
- Display GitHub metadata inside the dashboard.

### 1.6 Optional Helper Agents
- Generate workflow recipes.
- Break down tasks into subtasks.
- Generate code snippets.
- Generate documentation sections.

---

## 2. Non‑Functional Requirements

### 2.1 Performance
- Fast load times (<200ms for main dashboard on modern hardware).
- Efficient rendering using React Query caching.

### 2.2 Reliability
- Backend must handle basic CRUD operations without failure.
- Database migrations must be deterministic and reversible.

### 2.3 Usability
- Clean, minimal UI.
- Keyboard-friendly navigation.
- Consistent layout across pages.

### 2.4 Maintainability
- Clear separation of concerns between frontend, backend, and database.
- Strong TypeScript typing across the stack.
- tRPC used for type-safe API contracts.

### 2.5 Security
- GitHub API tokens stored in environment variables.
- No user authentication required (single-user app).
- Input validation on all backend routes.

### 2.6 Scope Control
- App must remain small and easy to iterate on.
- Optional features must not complicate core architecture.

---

## 3. Constraints

### 3.1 Technical Constraints
- React + Vite + TypeScript for frontend.
- Node.js + tRPC or Express for backend.
- Prisma ORM.
- SQLite for development; Postgres optional for production.

### 3.2 Project Constraints
- Built primarily using AI-assisted workflows (Copilot CLI, Copilot Chat).
- Must support iterative development and refactoring.
- Must remain easy to extend with optional features.

---

## 4. Success Criteria

### 4.1 Primary
- All core CRUD features implemented cleanly.
- Architecture remains small, modular, and maintainable.
- AI tools successfully used throughout development.

### 4.2 Secondary
- Optional GitHub integration works.
- Optional helper agents implemented.
- Documentation is complete and polished.

