import { useState } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Repository = RouterOutput['github']['repos'][number]
type PullRequest = RouterOutput['github']['pullRequests'][number]
type Issue = RouterOutput['github']['issues'][number]
type Workflow = {
  id: number
  name: string
  path: string
  html_url: string
}

interface GitHubActivityPageState {
  owner: string
  selectedRepo?: string
  prState: 'open' | 'closed' | 'all'
  issueState: 'open' | 'closed' | 'all'
  activeTab: 'repos' | 'pulls' | 'issues' | 'workflows'
}

export function GitHubActivityPage() {
  const [state, setState] = useState<GitHubActivityPageState>({
    owner: 'Serk4',
    selectedRepo: 'dev-workflow-dashboard',
    prState: 'open',
    issueState: 'open',
    activeTab: 'repos',
  })

  const [showCreateIssue, setShowCreateIssue] = useState(false)
  const [issueTitle, setIssueTitle] = useState('')
  const [issueBody, setIssueBody] = useState('')

  const utils = trpc.useUtils()

  // Queries
  const reposQuery = trpc.github.repos.useQuery(
    { owner: state.owner, per_page: 30 },
    { enabled: state.activeTab === 'repos' },
  )

  const pullsQuery = trpc.github.pullRequests.useQuery(
    { owner: state.owner, repo: state.selectedRepo || '', state: state.prState, per_page: 20 },
    { enabled: state.activeTab === 'pulls' && !!state.selectedRepo },
  )

  const issuesQuery = trpc.github.issues.useQuery(
    { owner: state.owner, repo: state.selectedRepo || '', state: state.issueState, per_page: 20 },
    { enabled: state.activeTab === 'issues' && !!state.selectedRepo },
  )

  const workflowsQuery = trpc.github.workflows.useQuery(
    { owner: state.owner, repo: state.selectedRepo || '' },
    { enabled: state.activeTab === 'workflows' && !!state.selectedRepo },
  )

  const createIssueMutation = trpc.github.createIssue.useMutation({
    onSuccess: async () => {
      setIssueTitle('')
      setIssueBody('')
      setShowCreateIssue(false)
      await utils.github.issues.invalidate()
    },
  })

  // Handlers
  const handleSelectRepo = (repoName: string) => {
    setState((prev) => ({
      ...prev,
      selectedRepo: repoName,
      activeTab: 'pulls',
    }))
  }

  const handleCreateIssue = (e: React.FormEvent) => {
    e.preventDefault()
    if (!issueTitle.trim() || !state.selectedRepo) {
      return
    }

    createIssueMutation.mutate({
      owner: state.owner,
      repo: state.selectedRepo,
      title: issueTitle,
      body: issueBody || undefined,
    })
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'status-open'
      case 'closed':
        return 'status-closed'
      case 'merged':
        return 'status-merged'
      case 'success':
      case 'completed':
        return 'status-success'
      case 'failure':
        return 'status-failure'
      case 'in_progress':
        return 'status-in-progress'
      default:
        return 'status-default'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Render functions
  const renderRepositories = () => {
    if (reposQuery.isLoading) return <p className="loading">Loading repositories...</p>
    if (reposQuery.error) return <p className="error">Failed to load repositories</p>
    if (!reposQuery.data || reposQuery.data.length === 0) {
      return <p className="empty">No repositories found</p>
    }

    return (
      <div className="github-repos-grid">
        {(reposQuery.data as Repository[]).map((repo) => (
          <div
            key={repo.id}
            className={`github-repo-card ${state.selectedRepo === repo.name ? 'selected' : ''}`}
            onClick={() => handleSelectRepo(repo.name)}
          >
            <div className="repo-header">
              <h3>
                <a href={repo.html_url} target="_blank" rel="noopener noreferrer">
                  {repo.name}
                </a>
              </h3>
              {repo.private && <span className="badge-private">Private</span>}
            </div>
            {repo.description && <p className="repo-description">{repo.description}</p>}
            <div className="repo-stats">
              <span className="stat">
                <strong>{repo.stargazers_count}</strong> ⭐
              </span>
              <span className="stat">
                <strong>{repo.forks_count}</strong> 🍴
              </span>
              <span className="stat">
                <strong>{repo.open_issues_count}</strong> 📋
              </span>
            </div>
            {repo.language && <span className="repo-language">{repo.language}</span>}
          </div>
        ))}
      </div>
    )
  }

  const renderPullRequests = () => {
    if (pullsQuery.isLoading) return <p className="loading">Loading pull requests...</p>
    if (pullsQuery.error) return <p className="error">Failed to load pull requests</p>
    if (!pullsQuery.data || pullsQuery.data.length === 0) {
      return <p className="empty">No pull requests found</p>
    }

    return (
      <div className="github-items-section">
        <div className="github-items-list">
          {(pullsQuery.data as PullRequest[]).map((pr) => (
            <div key={pr.id} className="github-item-card">
              <div className="item-header">
                <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="item-title">
                  <span className={`badge ${getStatusColor(pr.state)}`}>{pr.state}</span>
                  {pr.title}
                </a>
              </div>
              <div className="item-meta">
                <span className="meta-item">#{pr.number}</span>
                <span className="meta-item">by {pr.user?.login}</span>
                <span className="meta-item">{formatDate(pr.created_at)}</span>
              </div>
              {pr.body && <div className="item-body">{pr.body.substring(0, 200)}...</div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderIssues = () => {
    if (issuesQuery.isLoading) return <p className="loading">Loading issues...</p>
    if (issuesQuery.error) return <p className="error">Failed to load issues</p>
    if (!issuesQuery.data || issuesQuery.data.length === 0) {
      return <p className="empty">No issues found</p>
    }

    return (
      <div className="github-items-section">
        <div className="github-items-list">
          {(issuesQuery.data as Issue[]).map((issue) => (
            <div key={issue.id} className="github-item-card">
              <div className="item-header">
                <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="item-title">
                  <span className={`badge ${getStatusColor(issue.state)}`}>{issue.state}</span>
                  {issue.title}
                </a>
              </div>
              <div className="item-meta">
                <span className="meta-item">#{issue.number}</span>
                <span className="meta-item">by {issue.user?.login}</span>
                <span className="meta-item">{formatDate(issue.created_at)}</span>
              </div>
              {issue.labels && issue.labels.length > 0 && (
                <div className="item-labels">
                  {(issue.labels as Array<{ name: string }>).map((label) => (
                    <span key={label.name} className="label">
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
              {issue.body && <div className="item-body">{issue.body.substring(0, 200)}...</div>}
            </div>
          ))}
        </div>
      </div>
    )
  }

  const renderWorkflows = () => {
    if (workflowsQuery.isLoading) return <p className="loading">Loading workflows...</p>
    if (workflowsQuery.error) return <p className="error">Failed to load workflows</p>
    if (!workflowsQuery.data?.workflows || workflowsQuery.data.workflows.length === 0) {
      return <p className="empty">No workflows found</p>
    }

    return (
      <div className="github-items-section">
        <div className="github-items-list">
          {(workflowsQuery.data.workflows as Workflow[]).map((workflow) => (
            <div key={workflow.id} className="github-item-card">
              <div className="item-header">
                <a href={workflow.html_url} target="_blank" rel="noopener noreferrer" className="item-title">
                  <span className="badge status-default">workflow</span>
                  {workflow.name}
                </a>
              </div>
              <div className="item-meta">
                <span className="meta-item workflow-path">{workflow.path}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="github-activity-page">
      <header className="page-header">
        <h1>GitHub Activity</h1>
        <p>Monitor repositories, pull requests, issues, and workflows</p>
      </header>

      <div className="github-container">
        {/* Navigation Tabs */}
        <nav className="github-nav-tabs">
          <button
            className={`nav-tab ${state.activeTab === 'repos' ? 'active' : ''}`}
            onClick={() => setState((prev) => ({ ...prev, activeTab: 'repos' }))}
          >
            📚 Repositories
          </button>
          <button
            className={`nav-tab ${state.activeTab === 'pulls' ? 'active' : ''}`}
            onClick={() => setState((prev) => ({ ...prev, activeTab: 'pulls' }))}
            disabled={!state.selectedRepo}
          >
            🔀 Pull Requests
          </button>
          <button
            className={`nav-tab ${state.activeTab === 'issues' ? 'active' : ''}`}
            onClick={() => setState((prev) => ({ ...prev, activeTab: 'issues' }))}
            disabled={!state.selectedRepo}
          >
            📋 Issues
          </button>
          <button
            className={`nav-tab ${state.activeTab === 'workflows' ? 'active' : ''}`}
            onClick={() => setState((prev) => ({ ...prev, activeTab: 'workflows' }))}
            disabled={!state.selectedRepo}
          >
            ⚙️ Workflows
          </button>
        </nav>

        {/* Repositories Tab */}
        {state.activeTab === 'repos' && (
          <div className="github-tab-content">
            <div className="github-header">
              <h2>Repositories</h2>
              <p>Select a repository to view pull requests, issues, and workflows</p>
            </div>
            {renderRepositories()}
          </div>
        )}

        {/* Pull Requests Tab */}
        {state.activeTab === 'pulls' && state.selectedRepo && (
          <div className="github-tab-content">
            <div className="github-header">
              <h2>{state.selectedRepo} - Pull Requests</h2>
              <div className="filter-controls">
                <select
                  value={state.prState}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      prState: e.target.value as 'open' | 'closed' | 'all',
                    }))
                  }
                  className="filter-select"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="all">All</option>
                </select>
              </div>
            </div>
            {renderPullRequests()}
          </div>
        )}

        {/* Issues Tab */}
        {state.activeTab === 'issues' && state.selectedRepo && (
          <div className="github-tab-content">
            <div className="github-header">
              <h2>{state.selectedRepo} - Issues</h2>
              <div className="filter-controls">
                <select
                  value={state.issueState}
                  onChange={(e) =>
                    setState((prev) => ({
                      ...prev,
                      issueState: e.target.value as 'open' | 'closed' | 'all',
                    }))
                  }
                  className="filter-select"
                >
                  <option value="open">Open</option>
                  <option value="closed">Closed</option>
                  <option value="all">All</option>
                </select>
                <button
                  className="action-btn create-btn"
                  onClick={() => setShowCreateIssue(!showCreateIssue)}
                >
                  {showCreateIssue ? '✕ Cancel' : '+ New Issue'}
                </button>
              </div>
            </div>

            {showCreateIssue && (
              <div className="create-issue-form">
                <h3>Create New Issue</h3>
                <form onSubmit={handleCreateIssue}>
                  <input
                    type="text"
                    placeholder="Issue title"
                    value={issueTitle}
                    onChange={(e) => setIssueTitle(e.target.value)}
                    maxLength={200}
                    className="form-input"
                    required
                  />
                  <textarea
                    placeholder="Issue description (optional)"
                    value={issueBody}
                    onChange={(e) => setIssueBody(e.target.value)}
                    maxLength={65536}
                    className="form-textarea"
                    rows={4}
                  />
                  <div className="form-actions">
                    <button type="submit" disabled={createIssueMutation.isPending} className="action-btn save-btn">
                      {createIssueMutation.isPending ? 'Creating...' : 'Create Issue'}
                    </button>
                    {createIssueMutation.error && (
                      <span className="error-message">{createIssueMutation.error.message}</span>
                    )}
                  </div>
                </form>
              </div>
            )}

            {renderIssues()}
          </div>
        )}

        {/* Workflows Tab */}
        {state.activeTab === 'workflows' && state.selectedRepo && (
          <div className="github-tab-content">
            <div className="github-header">
              <h2>{state.selectedRepo} - Workflows</h2>
              <p>GitHub Actions automation and CI/CD pipelines</p>
            </div>
            {renderWorkflows()}
          </div>
        )}
      </div>
    </div>
  )
}
