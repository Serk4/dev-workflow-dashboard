# GitHub Activity Page - Integration Guide

## Quick Start

### 1. Import the Component
Add to your App.tsx or routing file:

```tsx
import { GitHubActivityPage } from './pages/GitHubActivityPage'
```

### 2. Add Navigation
Include in your app's main navigation:

```tsx
<nav>
  <Link to="/github-activity">GitHub Activity</Link>
</nav>
```

### 3. Set Environment Variable
Create or update `.env` file:

```bash
GITHUB_TOKEN=ghp_your_github_token_here
```

### 4. Test the Page
Run the dev server:

```bash
npm run dev
```

Navigate to the GitHub Activity page and:
1. Verify repositories load
2. Click a repository to select it
3. Switch between tabs (PRs, Issues, Workflows)
4. Test issue creation
5. Test state filters

## Features Overview

### Repositories Tab
- Lists all user repositories
- Shows stars, forks, and issue counts
- Displays language and private status
- Click to select a repository

### Pull Requests Tab
- Available after selecting a repository
- Filter by: Open, Closed, All
- Shows PR title, number, author, and date
- Links to GitHub

### Issues Tab
- Available after selecting a repository
- Filter by: Open, Closed, All
- Create new issues with "+ New Issue" button
- View existing issues with labels
- Links to GitHub

### Workflows Tab
- Available after selecting a repository
- Shows CI/CD workflows
- Displays file paths
- Links to workflow configuration

## Component Structure

```
GitHubActivityPage
├── Navigation Tabs
│   ├── Repositories Tab
│   ├── Pull Requests Tab
│   ├── Issues Tab
│   └── Workflows Tab
├── Repository Grid
│   └── Repository Cards (clickable)
├── Pull Requests List
│   └── PR Cards with metadata
├── Issues Section
│   ├── Issue Filter Controls
│   ├── Create Issue Form (conditional)
│   └── Issues List
└── Workflows List
    └── Workflow Cards
```

## Type Safety

All data is fully typed through tRPC:

```typescript
type Repository = RouterOutput['github']['repos'][number]
type PullRequest = RouterOutput['github']['pullRequests'][number]
type Issue = RouterOutput['github']['issues'][number]
```

## Error Handling

The component handles:
- Missing GitHub token (shows API error)
- Network errors (displays error message)
- Empty states (shows "No items found")
- Form validation (required field checks)
- API failures (shows error details)

## Performance Considerations

- **Lazy Loading**: Tabs only load data when clicked
- **Caching**: tRPC caches queries automatically
- **Limits**: Default 30 repos, 20 PRs/issues per request
- **Pagination Ready**: Can add pagination in future

## Customization

### Change Default Owner
Edit the initial state:

```typescript
const [state, setState] = useState<GitHubActivityPageState>({
  owner: 'your-username',  // Change this
  selectedRepo: undefined,
  prState: 'open',
  issueState: 'open',
  activeTab: 'repos',
})
```

### Adjust Result Limits
Modify query parameters:

```typescript
const pullsQuery = trpc.github.pullRequests.useQuery(
  { owner, repo, state: state.prState, per_page: 50 },  // Change per_page
  // ...
)
```

### Change Colors
Modify CSS in `App.css`:

```css
.status-open { background: #your-color; }
.github-repo-card.selected { background: #your-color; }
```

## CSS Classes Reference

Main container:
- `.github-activity-page`
- `.github-container`
- `.github-tab-content`

Repositories:
- `.github-repos-grid`
- `.github-repo-card`
- `.repo-language`
- `.badge-private`

Items:
- `.github-items-list`
- `.github-item-card`
- `.item-title`
- `.status-open`, `.status-closed`, etc.

Forms:
- `.create-issue-form`
- `.form-input`
- `.form-textarea`
- `.action-btn`

## Testing Checklist

- [ ] Repositories load on page load
- [ ] Can select a repository
- [ ] PR tab shows pull requests
- [ ] Can filter PRs by state
- [ ] Issue tab shows issues
- [ ] Can filter issues by state
- [ ] Can create new issue
- [ ] Issue form validates required fields
- [ ] Workflows tab shows workflows
- [ ] Links open in new tabs correctly
- [ ] Responsive on mobile
- [ ] Error handling works
- [ ] Loading states display

## Troubleshooting

### No repositories appear
- Check `GITHUB_TOKEN` is set correctly
- Token needs `repo` scope
- Verify token is not expired

### "GitHub token not configured" error
- Add `GITHUB_TOKEN` to `.env`
- Restart dev server
- Verify token format: `ghp_...`

### Issues tab is disabled
- Make sure you've selected a repository first
- Click on a repository card to select it

### Form submission fails
- Verify issue title is not empty
- Check GitHub token has write permissions
- Check API rate limits haven't been exceeded

### Styling looks wrong
- Clear browser cache
- Rebuild with `npm run build`
- Check `App.css` was updated

## Future Enhancements

Consider implementing:
1. Pagination for large result sets
2. Search/filter for repositories
3. Workflow run history
4. Branch protection display
5. Commit history viewer
6. Issue/PR templates
7. Milestone tracking
8. Release management
9. GitHub Actions secrets
10. Repository statistics

## File Location
- Component: `src/pages/GitHubActivityPage.tsx`
- Styles: `src/App.css` (GitHub Activity section)
- Backend: `server/routers/github-router.ts`
- Documentation: `GITHUB_ACTIVITY_DOCUMENTATION.md`

## API Endpoints Used

The component uses these endpoints from your tRPC backend:
- `trpc.github.repos` - List repositories
- `trpc.github.pullRequests` - List pull requests
- `trpc.github.issues` - List issues
- `trpc.github.workflows` - List workflows
- `trpc.github.createIssue` - Create new issue

All endpoints require the `GITHUB_TOKEN` environment variable.

## Support

For issues or questions:
1. Check the component props and state
2. Verify GitHub token is configured
3. Check browser console for errors
4. Review `GITHUB_ACTIVITY_DOCUMENTATION.md`
5. Test individual API calls with curl

---

**Happy GitHub-integrated development!** 🚀
