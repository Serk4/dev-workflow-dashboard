import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Snippet = RouterOutput['snippet']['list'][number]

interface SnippetItemProps {
  snippet: Snippet
  isEditing: boolean
  editingTitle: string
  editingContent: string
  onEditChange: (title: string, content: string) => void
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
}

export function SnippetItem({
  snippet,
  isEditing,
  editingTitle,
  editingContent,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
}: SnippetItemProps) {
  const updateSnippet = trpc.snippet.update.useMutation()
  const deleteSnippet = trpc.snippet.delete.useMutation()

  const handleDelete = () => {
    if (confirm(`Delete snippet "${snippet.title}"?`)) {
      deleteSnippet.mutate({ id: snippet.id })
    }
  }

  return (
    <li className="snippet-item">
      {isEditing ? (
        <div className="snippet-edit-form">
          <input
            type="text"
            value={editingTitle}
            onChange={(e) => onEditChange(e.target.value, editingContent)}
            maxLength={120}
            autoFocus
            className="snippet-edit-input"
            placeholder="Snippet title"
          />
          <textarea
            value={editingContent}
            onChange={(e) => onEditChange(editingTitle, e.target.value)}
            maxLength={2000}
            className="snippet-edit-textarea"
            placeholder="Snippet content"
          />
          <div className="snippet-edit-actions">
            <button
              onClick={onEditSave}
              disabled={updateSnippet.isPending || !editingTitle.trim() || !editingContent.trim()}
              className="snippet-edit-save"
            >
              Save
            </button>
            <button onClick={onEditCancel} className="snippet-edit-cancel">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="snippet-header">
            <h3 className="snippet-title">{snippet.title}</h3>
            <time className="snippet-created" title={new Date(snippet.createdAt).toLocaleString()}>
              {new Date(snippet.createdAt).toLocaleDateString()}
            </time>
          </div>
          <div className="snippet-content">
            <pre>{snippet.content}</pre>
          </div>
          <div className="snippet-actions">
            <button
              onClick={onEditStart}
              disabled={updateSnippet.isPending || deleteSnippet.isPending}
              className="snippet-action-btn edit-btn"
              aria-label="Edit snippet"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
              disabled={deleteSnippet.isPending}
              className="snippet-action-btn delete-btn"
              aria-label="Delete snippet"
            >
              {deleteSnippet.isPending ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </li>
  )
}
