import type { inferRouterOutputs } from '@trpc/server'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Activity = RouterOutput['activity']['list'][number]

interface ActivityItemProps {
  activity: Activity
}

export function ActivityItem({ activity }: ActivityItemProps) {
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
    <li className="activity-item">
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
  )
}
