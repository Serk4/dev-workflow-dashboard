import type { inferRouterOutputs } from '@trpc/server'
import { trpc } from '../lib/trpc'
import type { AppRouter } from '../../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Recipe = RouterOutput['recipe']['list'][number]

interface RecipeItemProps {
  recipe: Recipe
  isEditing: boolean
  editingName: string
  editingSteps: string
  onEditChange: (name: string, steps: string) => void
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
}

export function RecipeItem({
  recipe,
  isEditing,
  editingName,
  editingSteps,
  onEditChange,
  onEditStart,
  onEditSave,
  onEditCancel,
}: RecipeItemProps) {
  const updateRecipe = trpc.recipe.update.useMutation()
  const deleteRecipe = trpc.recipe.delete.useMutation()

  const handleDelete = () => {
    if (confirm(`Delete recipe "${recipe.name}"?`)) {
      deleteRecipe.mutate({ id: recipe.id })
    }
  }

  return (
    <li className="recipe-item">
      {isEditing ? (
        <div className="recipe-edit-form">
          <input
            type="text"
            value={editingName}
            onChange={(e) => onEditChange(e.target.value, editingSteps)}
            maxLength={120}
            autoFocus
            className="recipe-edit-input"
            placeholder="Recipe name"
          />
          <textarea
            value={editingSteps}
            onChange={(e) => onEditChange(editingName, e.target.value)}
            maxLength={2000}
            className="recipe-edit-textarea"
            placeholder="Recipe steps"
          />
          <div className="recipe-edit-actions">
            <button
              onClick={onEditSave}
              disabled={updateRecipe.isPending || !editingName.trim() || !editingSteps.trim()}
              className="recipe-edit-save"
            >
              Save
            </button>
            <button onClick={onEditCancel} className="recipe-edit-cancel">
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
              onClick={onEditStart}
              disabled={updateRecipe.isPending || deleteRecipe.isPending}
              className="recipe-action-btn edit-btn"
              aria-label="Edit recipe"
            >
              Edit
            </button>
            <button
              onClick={handleDelete}
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
  )
}
