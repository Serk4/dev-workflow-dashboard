# Minimal GitHub Router Specification
## Mode: B2 (Moderately Strict Guardrails)
## Purpose: Optional read-only GitHub activity viewer

This router provides simple, read-only access to public GitHub repository data.
It is optional and should remain minimal. No authentication, no write operations,
and no expanded GitHub feature set.

---

# Endpoints

## getIssues
- Method: Query
- Input:
  {
    repo: string   // "owner/repo"
  }
- Output:
  Array<{
    id: number
    title: string
    state: string
    createdAt: string
    url: string
  }>

## getPullRequests
- Method: Query
- Input:
  {
    repo: string   // "owner/repo"
  }
- Output:
  Array<{
    id: number
    title: string
    state: string
    createdAt: string
    url: string
  }>

## getCommits
- Method: Query
- Input:
  {
    repo: string   // "owner/repo"
  }
- Output:
  Array<{
    sha: string
    message: string
    author: string
    date: string
    url: string
  }>

---

# Behavior & Constraints

- Only public GitHub API endpoints are used.
- No authentication required.
- No pagination required; return the first page only.
- No write operations (no creating issues, PRs, comments, etc.).
- No expanded GitHub features (labels, milestones, reviews, etc.).
- If the repo does not exist or rate limits are hit, return a simple error:
  {
    error: string
  }

---

# Notes

- This router is optional; the app functions fully without it.
- It should remain small and focused.
- It should not grow beyond issues, PRs, and commits.
- It should not introduce new pages or UI sections unless explicitly requested.
