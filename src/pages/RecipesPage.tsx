import { useState } from 'react'
import type { FormEvent } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Recipe = RouterOutput['recipe']['list'][number]

export function RecipesPage() {
  const [recipeName, setRecipeName] = useState('')
  const [recipeSteps, setRecipeSteps] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editingName, setEditingName] = useState('')
  const [editingSteps, setEditingSteps] = useState('')

  const utils = trpc.useUtils()
  const recipesQuery = trpc.recipe.list.useQuery()

  const createRecipe = trpc.recipe.create.useMutation({
    onSuccess: async () => {
      setRecipeName('')
      setRecipeSteps('')
      await utils.recipe.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const updateRecipe = trpc.recipe.update.useMutation({
    onSuccess: async () => {
      setEditingId(null)
      setEditingName('')
      setEditingSteps('')
      await utils.recipe.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const deleteRecipe = trpc.recipe.delete.useMutation({
    onSuccess: async () => {
      await utils.recipe.list.invalidate()
      await utils.activity.list.invalidate()
    },
  })

  const submitRecipe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!recipeName.trim() || !recipeSteps.trim()) {
      return
    }
    createRecipe.mutate({ name: recipeName, steps: recipeSteps })
  }

  const startEdit = (recipe: Recipe) => {
    setEditingId(recipe.id)
    setEditingName(recipe.name)
    setEditingSteps(recipe.steps)
  }

  const submitEdit = () => {
    if (!editingName.trim() || !editingSteps.trim() || editingId === null) {
      return
    }
    updateRecipe.mutate({ id: editingId, name: editingName, steps: editingSteps })
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditingName('')
    setEditingSteps('')
  }

  return (
    <div className="recipes-page">
      <header>
        <h1>Workflow Recipes</h1>
        <p>Save and reuse your development workflows</p>
      </header>

      <section className="recipes-form-section">
        <h2>Create New Recipe</h2>
        <form onSubmit={submitRecipe}>
          <input
            aria-label="Recipe name"
            placeholder="Recipe name (e.g., Frontend Setup)"
            value={recipeName}
            onChange={(event) => setRecipeName(event.target.value)}
            maxLength={120}
            disabled={createRecipe.isPending}
          />
          <textarea
            aria-label="Recipe steps"
            placeholder="Enter workflow steps (each step on a new line, or detailed instructions)"
            value={recipeSteps}
            onChange={(event) => setRecipeSteps(event.target.value)}
            maxLength={2000}
            disabled={createRecipe.isPending}
          />
          <button type="submit" disabled={createRecipe.isPending || !recipeName.trim() || !recipeSteps.trim()}>
            {createRecipe.isPending ? 'Saving...' : 'Save Recipe'}
          </button>
        </form>
      </section>

      <section className="recipes-list-section">
        <h2>Recipes ({(recipesQuery.data ?? []).length})</h2>
        {recipesQuery.isLoading ? (
          <p className="loading">Loading recipes...</p>
        ) : recipesQuery.error ? (
          <p className="error">Failed to load recipes</p>
        ) : (recipesQuery.data ?? []).length === 0 ? (
          <p className="empty">No recipes yet. Create one to get started!</p>
        ) : (
          <ul className="recipes-list">
            {(recipesQuery.data ?? []).map((recipe: Recipe) => (
              <li key={recipe.id} className="recipe-item">
                {editingId === recipe.id ? (
                  <div className="recipe-edit-form">
                    <input
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      maxLength={120}
                      autoFocus
                      className="recipe-edit-input"
                      placeholder="Recipe name"
                    />
                    <textarea
                      value={editingSteps}
                      onChange={(e) => setEditingSteps(e.target.value)}
                      maxLength={2000}
                      className="recipe-edit-textarea"
                      placeholder="Recipe steps"
                    />
                    <div className="recipe-edit-actions">
                      <button
                        onClick={submitEdit}
                        disabled={updateRecipe.isPending || !editingName.trim() || !editingSteps.trim()}
                        className="recipe-edit-save"
                      >
                        Save
                      </button>
                      <button onClick={cancelEdit} className="recipe-edit-cancel">
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="recipe-header">
                      <h3 className="recipe-name">{recipe.name}</h3>
                      <time className="recipe-created" title={new Date(recipe.createdAt).toLocaleString()}>
                        {new Date(recipe.createdAt).toLocaleDateString()}
                      </time>
                    </div>
                    <div className="recipe-steps">
                      <p>{recipe.steps}</p>
                    </div>
                    <div className="recipe-actions">
                      <button
                        onClick={() => startEdit(recipe)}
                        disabled={updateRecipe.isPending || deleteRecipe.isPending}
                        className="recipe-action-btn edit-btn"
                        aria-label="Edit recipe"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(`Delete recipe "${recipe.name}"?`)) {
                            deleteRecipe.mutate({ id: recipe.id })
                          }
                        }}
                        disabled={deleteRecipe.isPending}
                        className="recipe-action-btn delete-btn"
                        aria-label="Delete recipe"
                      >
                        {deleteRecipe.isPending ? 'Deleting...' : 'Delete'}
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
