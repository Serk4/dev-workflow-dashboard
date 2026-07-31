import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Task = RouterOutput['task']['list'][number]

interface TaskItemProps {
  task: Task
  isEditing: boolean
  editingTitle: string
  onEditChange: (title: string) => void
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
}

export function TaskItem({
  task,
  isEditing,
  editingTitle,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
}: TaskItemProps) {
  const toggleTask = trpc.task.toggle.useMutation()
  const updateTask = trpc.task.update.useMutation()
  const deleteTask = trpc.task.delete.useMutation()

  const handleToggle = () => {
    toggleTask.mutate({ id: task.id })
  }

  const handleDelete = () => {
    if (confirm(`Delete task "${task.title}"?`)) {
      deleteTask.mutate({ id: task.id })
    }
  }

  return (
    <li className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <div className="task-edit-form">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => onEditChange(e.target.value)}
            maxLength={120}
            autoFocus
            className="task-edit-input"
          />
          <button
            onClick={onEditSave}
            disabled={updateTask.isPending || !editingTitle.trim()}
            className="task-edit-save"
          >
            Save
          </button>
          <button onClick={onEditCancel} className="task-edit-cancel">
            Cancel
          </button>
        </div>
      ) : (
        <>
          <label className="task-label">
            <input
              type="checkbox"
              checked={task.completed}
              onChange={handleToggle}
              disabled={toggleTask.isPending}
              className="task-checkbox"
            />
            <span className="task-title">{task.title}</span>
          </label>
          <div className="task-meta">
            <time className="task-created" title={new Date(task.createdAt).toLocaleString()}>
              {new Date(task.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="task-actions">
            <button
              onClick={onEditStart}
              disabled={updateTask.isPending || deleteTask.isPending}
              className="task-action-btn edit-btn"
              aria-label="Edit task"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteTask.isPending}
              className="task-action-btn delete-btn"
              aria-label="Delete task"
            >
              {deleteTask.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </li>
  )
}
