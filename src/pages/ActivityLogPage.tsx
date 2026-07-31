import { useState } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Activity = RouterOutput['activity']['list'][number]

export function ActivityLogPage() {
  const [filterType, setFilterType] = useState<string | 'all'>('all')
  const [limit, setLimit] = useState(50)

  const listQuery = trpc.activity.list.useQuery({ limit })
  const filteredQuery = trpc.activity.listFiltered.useQuery(
    filterType !== 'all'
      ? { entityType: filterType, limit }
      : undefined,
    { enabled: filterType !== 'all' }
  )
  const statsQuery = trpc.activity.getStats.useQuery()

  const activities = filterType === 'all' ? listQuery.data ?? [] : filteredQuery.data ?? []
  const isLoading = filterType === 'all' ? listQuery.isLoading : filteredQuery.isLoading
  const error = filterType === 'all' ? listQuery.error : filteredQuery.error

  const getActionColor = (action: string) => {
    switch (action) {
      case 'create':
        return 'action-create'
      case 'update':
        return 'action-update'
      case 'delete':
        return 'action-delete'
      default:
        return 'action-default'
    }
  }

  const getEntityColor = (entityType: string) => {
    switch (entityType) {
      case 'task':
        return 'entity-task'
      case 'recipe':
        return 'entity-recipe'
      case 'snippet':
        return 'entity-snippet'
      default:
        return 'entity-default'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'just now'
    if (diffMins < 60) return `${diffMins}m ago`
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays < 7) return `${diffDays}d ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="activity-log-page">
      <header>
        <h1>Activity Log</h1>
        <p>Track all changes and actions across your workflow</p>
      </header>

      <section className="activity-stats-section">
        <h2>Statistics</h2>
        {statsQuery.isLoading ? (
          <p className="loading">Loading stats...</p>
        ) : statsQuery.error ? (
          <p className="error">Failed to load stats</p>
        ) : statsQuery.data ? (
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">{statsQuery.data.total}</div>
              <div className="stat-label">Total Activities</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsQuery.data.byEntity.task}</div>
              <div className="stat-label">Task Activities</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsQuery.data.byEntity.recipe}</div>
              <div className="stat-label">Recipe Activities</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{statsQuery.data.byEntity.snippet}</div>
              <div className="stat-label">Snippet Activities</div>
            </div>
          </div>
        ) : null}
      </section>

      <section className="activity-filter-section">
        <h2>Filter Activities</h2>
        <div className="filter-buttons">
          <button
            className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
            onClick={() => setFilterType('all')}
          >
            All Activities
          </button>
          <button
            className={`filter-btn ${filterType === 'task' ? 'active' : ''}`}
            onClick={() => setFilterType('task')}
          >
            Tasks
          </button>
          <button
            className={`filter-btn ${filterType === 'recipe' ? 'active' : ''}`}
            onClick={() => setFilterType('recipe')}
          >
            Recipes
          </button>
          <button
            className={`filter-btn ${filterType === 'snippet' ? 'active' : ''}`}
            onClick={() => setFilterType('snippet')}
          >
            Snippets
          </button>
        </div>
        <div className="limit-control">
          <label htmlFor="limit">Show:</label>
          <select
            id="limit"
            value={limit}
            onChange={(e) => setLimit(Number(e.target.value))}
            className="limit-select"
          >
            <option value={25}>Last 25</option>
            <option value={50}>Last 50</option>
            <option value={100}>Last 100</option>
          </select>
        </div>
      </section>

      <section className="activity-list-section">
        <h2>Recent Activities ({activities.length})</h2>
        {isLoading ? (
          <p className="loading">Loading activities...</p>
        ) : error ? (
          <p className="error">Failed to load activities</p>
        ) : activities.length === 0 ? (
          <p className="empty">No activities yet. Start creating tasks, recipes, or snippets!</p>
        ) : (
          <ul className="activity-list">
            {activities.map((activity: Activity) => (
              <li key={activity.id} className="activity-item">
                <div className="activity-header">
                  <span className={`action-badge ${getActionColor(activity.action)}`}>
                    {activity.action}
                  </span>
                  <span className={`entity-badge ${getEntityColor(activity.entityType)}`}>
                    {activity.entityType}
                  </span>
                  <time className="activity-time" title={new Date(activity.createdAt).toLocaleString()}>
                    {formatDate(activity.createdAt)}
                  </time>
                </div>
                <div className="activity-message">
                  <p>{activity.message}</p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
