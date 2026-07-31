import { useState } from 'react'
import type { FormEvent } from 'react'
import type { inferRouterOutputs } from '@trpc/server'
import './App.css'
import { trpc } from './lib/trpc'
import type { AppRouter } from '../server/router'

type RouterOutput = inferRouterOutputs<AppRouter>
type Task = RouterOutput['task']['list'][number]
type Recipe = RouterOutput['recipe']['list'][number]
type Snippet = RouterOutput['snippet']['list'][number]
type Activity = RouterOutput['activity']['list'][number]

function App() {
  const [taskTitle, setTaskTitle] = useState('')
  const [recipeName, setRecipeName] = useState('')
  const [recipeSteps, setRecipeSteps] = useState('')
  const [snippetTitle, setSnippetTitle] = useState('')
  const [snippetContent, setSnippetContent] = useState('')

  const utils = trpc.useUtils()

  const tasksQuery = trpc.task.list.useQuery()
  const recipesQuery = trpc.recipe.list.useQuery()
  const snippetsQuery = trpc.snippet.list.useQuery()
  const activityQuery = trpc.activity.list.useQuery({ limit: 20 })

  const refreshDashboard = () =>
    Promise.all([
      utils.task.list.invalidate(),
      utils.recipe.list.invalidate(),
      utils.snippet.list.invalidate(),
      utils.activity.list.invalidate(),
    ])

  const createTask = trpc.task.create.useMutation({
    onSuccess: async () => {
      setTaskTitle('')
      await refreshDashboard()
    },
  })

  const toggleTask = trpc.task.toggle.useMutation({
    onSuccess: refreshDashboard,
  })

  const createRecipe = trpc.recipe.create.useMutation({
    onSuccess: async () => {
      setRecipeName('')
      setRecipeSteps('')
      await refreshDashboard()
    },
  })

  const createSnippet = trpc.snippet.create.useMutation({
    onSuccess: async () => {
      setSnippetTitle('')
      setSnippetContent('')
      await refreshDashboard()
    },
  })

  const submitTask = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!taskTitle.trim()) {
      return
    }
    createTask.mutate({ title: taskTitle })
  }

  const submitRecipe = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!recipeName.trim() || !recipeSteps.trim()) {
      return
    }
    createRecipe.mutate({ name: recipeName, steps: recipeSteps })
  }

  const submitSnippet = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!snippetTitle.trim() || !snippetContent.trim()) {
      return
    }
    createSnippet.mutate({ title: snippetTitle, content: snippetContent })
  }

  return (
    <main>
      <header>
        <h1>Dev Workflow Dashboard</h1>
        <p>Track tasks, workflow recipes, snippets, and recent activity in one place.</p>
      </header>

      <section>
        <h2>Tasks</h2>
        <form onSubmit={submitTask}>
          <input
            aria-label="Task title"
            placeholder="Add task"
            value={taskTitle}
            onChange={(event) => setTaskTitle(event.target.value)}
            maxLength={120}
          />
          <button type="submit" disabled={createTask.isPending}>
            Add
          </button>
        </form>
        <ul>
          {(tasksQuery.data ?? []).map((task: Task) => (
            <li key={task.id}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask.mutate({ id: task.id })}
                  disabled={toggleTask.isPending}
                />
                <span className={task.completed ? 'completed' : ''}>{task.title}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Workflow Recipes</h2>
        <form onSubmit={submitRecipe}>
          <input
            aria-label="Recipe name"
            placeholder="Recipe name"
            value={recipeName}
            onChange={(event) => setRecipeName(event.target.value)}
            maxLength={120}
          />
          <textarea
            aria-label="Recipe steps"
            placeholder="Workflow steps"
            value={recipeSteps}
            onChange={(event) => setRecipeSteps(event.target.value)}
            maxLength={2000}
          />
          <button type="submit" disabled={createRecipe.isPending}>
            Save recipe
          </button>
        </form>
        <ul>
          {(recipesQuery.data ?? []).map((recipe: Recipe) => (
            <li key={recipe.id}>
              <strong>{recipe.name}</strong>
              <p>{recipe.steps}</p>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Snippet Library</h2>
        <form onSubmit={submitSnippet}>
          <input
            aria-label="Snippet title"
            placeholder="Snippet title"
            value={snippetTitle}
            onChange={(event) => setSnippetTitle(event.target.value)}
            maxLength={120}
          />
          <textarea
            aria-label="Snippet content"
            placeholder="Reusable snippet"
            value={snippetContent}
            onChange={(event) => setSnippetContent(event.target.value)}
            maxLength={2000}
          />
          <button type="submit" disabled={createSnippet.isPending}>
            Save snippet
          </button>
        </form>
        <ul>
          {(snippetsQuery.data ?? []).map((snippet: Snippet) => (
            <li key={snippet.id}>
              <strong>{snippet.title}</strong>
              <pre>{snippet.content}</pre>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Recent Activity</h2>
        <ul>
          {(activityQuery.data ?? []).map((activity: Activity) => (
            <li key={activity.id}>{activity.message}</li>
          ))}
        </ul>
      </section>
    </main>
  )
}

export default App
