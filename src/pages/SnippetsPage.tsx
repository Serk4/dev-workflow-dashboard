import { useState } from 'react'
import type { FormEvent } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Snippet = RouterOutput['snippet']['list'][number]

export function SnippetsPage() {
  const [snippetTitle, setSnippetTitle] = useState('')
  const [snippetContent, setSnippetContent] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingTitle, setEditingTitle] = useState('')
  const [editingContent, setEditingContent] = useState('')

  const utils = trpc.useUtils()
  const snippetsQuery = trpc.snippet.list.useQuery()

  const createSnippet = trpc.snippet.create.useMutation({
    onSuccess: async () => {
      setSnippetTitle('')
      setSnippetContent('')
      await utils.snippet.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const updateSnippet = trpc.snippet.update.useMutation({
    onSuccess: async () => {
      setEditingId(null)
      setEditingTitle('')
      setEditingContent('')
      await utils.snippet.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const deleteSnippet = trpc.snippet.delete.useMutation({
    onSuccess: async () => {
      await utils.snippet.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const submitSnippet = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!snippetTitle.trim() || !snippetContent.trim()) {
      return
    }
    createSnippet.mutate({ title: snippetTitle, content: snippetContent })
  }

  const startEdit = (snippet: Snippet) => {
    setEditingId(snippet.id)
    setEditingTitle(snippet.title)
    setEditingContent(snippet.content)
  }

  const submitEdit = () => {
    if (!editingTitle.trim() || !editingContent.trim() || editingId === null) {
      return
    }
    updateSnippet.mutate({ id: editingId, title: editingTitle, content: editingContent })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingTitle('')
    setEditingContent('')
  }

  return (
    <div className="snippets-page">
      <header>
        <h1>Snippet Library</h1>
        <p>Save and organize reusable code snippets</p>
      </header>

      <section className="snippets-form-section">
        <h2>Create New Snippet</h2>
        <form onSubmit={submitSnippet}>
          <input
            aria-label="Snippet title"
            placeholder="Snippet title (e.g., React Hook Template)"
            value={snippetTitle}
            onChange={(event) => setSnippetTitle(event.target.value)}
            maxLength={120}
            disabled={createSnippet.isPending}
          />
          <textarea
            aria-label="Snippet content"
            placeholder="Paste your code snippet here"
            value={snippetContent}
            onChange={(event) => setSnippetContent(event.target.value)}
            maxLength={2000}
            disabled={createSnippet.isPending}
            className="snippet-textarea"
          />
          <button type="submit" disabled={createSnippet.isPending || !snippetTitle.trim() || !snippetContent.trim()}>
            {createSnippet.isPending ? 'Saving...' : 'Save Snippet'}
          </button>
        </form>
      </section>

      <section className="snippets-list-section">
        <h2>Snippets ({(snippetsQuery.data ?? []).length})</h2>
        {snippetsQuery.isLoading ? (
          <p className="loading">Loading snippets...</p>
        ) : snippetsQuery.error ? (
          <p className="error">Failed to load snippets</p>
        ) : (snippetsQuery.data ?? []).length === 0 ? (
          <p className="empty">No snippets yet. Create one to get started!</p>
        ) : (
          <ul className="snippets-list">
            {(snippetsQuery.data ?? []).map((snippet: Snippet) => (
              <li key={snippet.id} className="snippet-item">
                {editingId === snippet.id ? (
                  <div className="snippet-edit-form">
                    <input
                      type="text"
                      value={editingTitle}
                      onChange={(e) => setEditingTitle(e.target.value)}
                      maxLength={120}
                      autoFocus
                      className="snippet-edit-input"
                      placeholder="Snippet title"
                    />
                    <textarea
                      value={editingContent}
                      onChange={(e) => setEditingContent(e.target.value)}
                      maxLength={2000}
                      className="snippet-edit-textarea"
                      placeholder="Snippet content"
                    />
                    <div className="snippet-edit-actions">
                      <button
                        onClick={submitEdit}
                        disabled={updateSnippet.isPending || !editingTitle.trim() || !editingContent.trim()}
                        className="snippet-edit-save"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="snippet-edit-cancel">
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
                        onClick={() => startEdit(snippet)}
                        disabled={updateSnippet.isPending || deleteSnippet.isPending}
                        className="snippet-action-btn edit-btn"
                        aria-label="Edit snippet"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete snippet "${snippet.title}"?`)) {
                            deleteSnippet.mutate({ id: snippet.id })
                          }
                        }}
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
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}
