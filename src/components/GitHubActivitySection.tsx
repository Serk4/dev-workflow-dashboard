import { useState } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type PullRequest = RouterOutput['github']['pullRequests'][number]
type Issue = RouterOutput['github']['issues'][number]

interface GitHubActivitySectionProps {
  owner?: string
  repo?: string
}

export function GitHubActivitySection({ owner = 'Serk4', repo = 'dev-workflow-dashboard' }: GitHubActivitySectionProps) {
  const [activeTab, setActiveTab] = useState<'pulls' | 'issues' | 'workflows'>('pulls')

  const pullsQuery = trpc.github.pullRequests.useQuery(
    { owner, repo, state: 'open', per_page: 10 },
    { enabled: activeTab === 'pulls' },
  )

  const issuesQuery = trpc.github.issues.useQuery(
    { owner, repo, state: 'open', per_page: 10 },
    { enabled: activeTab === 'issues' },
  )

  const workflowsQuery = trpc.github.workflows.useQuery(
    { owner, repo },
    { enabled: activeTab === 'workflows' },
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'status-open'
      case 'closed':
        return 'status-closed'
      case 'merged':
        return 'status-merged'
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

  const renderPulls = () => {
    if (pullsQuery.isLoading) return <p className="loading">Loading pull requests...</p>
    if (pullsQuery.error) return <p className="error">Failed to load pull requests</p>
    if (!pullsQuery.data || pullsQuery.data.length === 0) {
      return <p className="empty">No open pull requests</p>
    }

    return (
      <ul className="github-items-list">
        {(pullsQuery.data as PullRequest[]).map((pr) => (
          <li key={pr.id} className="github-item">
            <a href={pr.html_url} target="_blank" rel="noopener noreferrer" className="github-item-title">
              <span className={`badge ${getStatusColor(pr.state)}`}>{pr.state}</span>
              {pr.title}
            </a>
            <div className="github-item-meta">
              <span className="github-user">#{pr.number}</span>
              <span className="github-user">by {pr.user?.login}</span>
            </div>
          </li>
        ))}
      </ul>
    )
  }

  const renderIssues = () => {
    if (issuesQuery.isLoading) return <p className="loading">Loading issues...</p>
    if (issuesQuery.error) return <p className="error">Failed to load issues</p>
    if (!issuesQuery.data || issuesQuery.data.length === 0) {
      return <p className="empty">No open issues</p>
    }

    return (
      <ul className="github-items-list">
        {(issuesQuery.data as Issue[]).map((issue) => (
          <li key={issue.id} className="github-item">
            <a href={issue.html_url} target="_blank" rel="noopener noreferrer" className="github-item-title">
              <span className={`badge ${getStatusColor(issue.state)}`}>{issue.state}</span>
              {issue.title}
            </a>
            <div className="github-item-meta">
              <span className="github-issue-num">#{issue.number}</span>
              <span className="github-user">by {issue.user?.login}</span>
              {issue.labels && issue.labels.length > 0 && (
                <div className="github-labels">
                  {(issue.labels as Array<{ name: string }>).map((label) => (
                    <span key={label.name} className="label">
                      {label.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>
    )
  }

  const renderWorkflows = () => {
    if (workflowsQuery.isLoading) return <p className="loading">Loading workflows...</p>
    if (workflowsQuery.error) return <p className="error">Failed to load workflows</p>
    if (!workflowsQuery.data?.workflows || workflowsQuery.data.workflows.length === 0) {
      return <p className="empty">No workflows found</p>
    }

    return (
      <ul className="github-items-list">
        {workflowsQuery.data.workflows.map(
          (workflow: { id: number; name: string; path: string; html_url: string }) => (
            <li key={workflow.id} className="github-item">
              <a href={workflow.html_url} target="_blank" rel="noopener noreferrer" className="github-item-title">
                <span className="badge status-default">workflow</span>
                {workflow.name}
              </a>
              <div className="github-item-meta">
                <span className="workflow-path">{workflow.path}</span>
              </div>
            </li>
          ),
        )}
      </ul>
    )
  }

  return (
    <section className="github-activity-section">
      <header>
        <h2>GitHub Activity</h2>
        <p>
          {owner}/{repo}
        </p>
      </header>

      <div className="github-tabs">
        <button
          className={`tab ${activeTab === 'pulls' ? 'active' : ''}`}
          onClick={() => setActiveTab('pulls')}
        >
          Pull Requests
        </button>
        <button
          className={`tab ${activeTab === 'issues' ? 'active' : ''}`}
          onClick={() => setActiveTab('issues')}
        >
          Issues
        </button>
        <button
          className={`tab ${activeTab === 'workflows' ? 'active' : ''}`}
          onClick={() => setActiveTab('workflows')}
        >
          Workflows
        </button>
      </div>

      <div className="github-content">
        {activeTab === 'pulls' && renderPulls()}
        {activeTab === 'issues' && renderIssues()}
        {activeTab === 'workflows' && renderWorkflows()}
      </div>
    </section>
  )
}
