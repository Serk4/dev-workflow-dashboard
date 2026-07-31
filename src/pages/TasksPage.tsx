import { useState } from 'react'
import type { FormEvent } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Task = RouterOutput['task']['list'][number]

export function TasksPage() {
  const [taskTitle, setTaskTitle] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')

  const utils = trpc.useUtils()
  const tasksQuery = trpc.task.list.useQuery()

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      setTaskTitle('')
      await utils.task.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const updateTask = trpc.task.update.useMutation({
    onSuccess: async () => {
      setEditingId(null)
      setEditingTitle('')
      await utils.task.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const toggleTask = trpc.task.toggle.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const deleteTask = trpc.task.delete.useMutation({
    onSuccess: async () => {
      await utils.task.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!taskTitle.trim()) {
      return
    }
    createTask.mutate({ title: taskTitle })
  }

  const startEdit = (task: Task) => {
    setEditingId(task.id)
    setEditingTitle(task.title)
  }

  const submitEdit = () => {
    if (!editingTitle.trim() || editingId === null) {
      return
    }
    updateTask.mutate({ id: editingId, title: editingTitle })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
  }

  return (
    <div className="tasks-page">
      <header>
        <h1>Tasks</h1>
        <p>Organize and track your development tasks</p>
      </header>

      <section className="tasks-form-section">
        <h2>Add New Task</h2>
        <form onSubmit={submitTask}>
          <input
            aria-label="Task title"
            placeholder="Enter a new task"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            maxLength={120}
            disabled={createTask.isPending}
          />
          <button type="submit" disabled={createTask.isPending}>
            {createTask.isPending ? 'Adding...' : 'Add Task'}
          </button>
        </form>
      </section>

      <section className="tasks-list-section">
        <h2>Tasks ({(tasksQuery.data ?? []).length})</h2>
        {tasksQuery.isLoading ? (
          <p className="loading">Loading tasks...</p>
        ) : tasksQuery.error ? (
          <p className="error">Failed to load tasks</p>
        ) : (tasksQuery.data ?? []).length === 0 ? (
          <p className="empty">No tasks yet. Add one to get started!</p>
        ) : (
          <ul className="tasks-list">
            {(tasksQuery.data ?? []).map((task: Task) => (
              <li key={task.id} className={`task-item ${task.completed ? 'completed' : ''}`}>
                {editingId === task.id ? (
                  <div className="task-edit-form">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      maxLength={120}
                      autoFocus
                      className="task-edit-input"
                    />
                    <button
                      onClick={submitEdit}
                      disabled={updateTask.isPending || !editingTitle.trim()}
                      className="task-edit-save"
                    >
                      Save
                    </button>
                    <button onClick={cancelEdit} className="task-edit-cancel">
                      Cancel
                    </button>
                  </div>
                ) : (
                  <>
                    <label className="task-label">
                      <input
                        type="checkbox"
                        checked={task.completed}
                        onChange={() => toggleTask.mutate({ id: task.id })}
                        disabled={toggleTask.isPending}
                        className="task-checkbox"
                      />
                      <span className="task-title">{task.title}</span>
                    </label>
                    <div className="task-actions">
                      <button
                        onClick={() => startEdit(task)}
                        disabled={updateTask.isPending || deleteTask.isPending}
                        className="task-action-btn edit-btn"
                        aria-label="Edit task"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask.mutate({ id: task.id })}
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
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
