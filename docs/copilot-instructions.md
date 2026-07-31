# Copilot Instructions
## Mode: B2 (Moderately Strict Guardrails)
## Project: Dev Workflow Dashboard

These instructions define how Copilot should behave when generating or modifying code
for this project. Copilot must follow these rules to maintain scope, consistency, and
predictability.

---

# 1. Scope Control

- Follow the existing documentation in /docs closely.
- Do not introduce new major features, pages, models, or architectural patterns.
- Small helpful suggestions are allowed (naming, formatting, minor refactors).
- If unsure about intent, ask for clarification instead of inventing solutions.
- Never expand the project vision beyond what is documented.

---

# 2. Architecture & Structure

- Follow the architecture.md file for backend and frontend structure.
- Follow the data-model.md file for Prisma schema and relationships.
- Follow the ui-map.md file for pages and components.
- Follow the api-contract.md file for router structure and CRUD operations.
- Do not add new routers, models, or pages unless explicitly requested.

---

# 3. Coding Principles

- Keep components small, focused, and minimal.
- Keep tRPC procedures simple and predictable.
- Maintain strong TypeScript typing across the stack.
- Prefer clarity over cleverness.
- Avoid unnecessary abstractions or complexity.

---

# 4. Behavior Expectations

- Stay aligned with the project’s small, personal-scope nature.
- Suggest improvements only when they fit the existing architecture.
- Do not propose redesigns, rewrites, or alternative frameworks.
- Do not generate boilerplate unrelated to the documented features.
- Do not assume future features or expansions.

---

# 5. Output Expectations

- When generating code, follow the documented file structure.
- When generating components, follow the UI map.
- When generating routers, follow the API contract.
- When generating database code, follow the Prisma schema.
- When generating utilities, keep them minimal and scoped.

---

# 6. Interaction Rules

- Ask for clarification when the request is ambiguous.
- Provide small helpful suggestions when appropriate.
- Never override or reinterpret the project’s documented intent.
- Never introduce scope creep.

---

# 7. Project Identity

This project is intentionally small, personal, and minimal.
Copilot must preserve this identity at all times.
