const TODOIST_API = 'https://api.todoist.com/rest/v2'

export interface TodoistProject {
  id: string
  name: string
  color: string
  comment_count: number
  is_inbox_project: boolean
}

export interface TodoistTask {
  id: string
  content: string
  description: string
  project_id: string
  due: { date: string; string: string } | null
  priority: number
  labels: string[]
  is_completed: boolean
}

async function todoistFetch<T>(
  token: string,
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(`${TODOIST_API}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Todoist API error ${res.status}: ${text}`)
  }
  if (res.status === 204) return undefined as unknown as T
  return res.json() as Promise<T>
}

export async function getTodoistProjects(token: string): Promise<TodoistProject[]> {
  return todoistFetch<TodoistProject[]>(token, '/projects')
}

export async function getTodoistTasks(token: string, projectId?: string): Promise<TodoistTask[]> {
  const qs = projectId ? `?project_id=${projectId}` : ''
  return todoistFetch<TodoistTask[]>(token, `/tasks${qs}`)
}

export async function createTodoistTask(
  token: string,
  content: string,
  projectId?: string
): Promise<TodoistTask> {
  return todoistFetch<TodoistTask>(token, '/tasks', {
    method: 'POST',
    body: JSON.stringify({ content, ...(projectId ? { project_id: projectId } : {}) }),
  })
}

export async function completeTodoistTask(token: string, taskId: string): Promise<void> {
  return todoistFetch<void>(token, `/tasks/${taskId}/close`, { method: 'POST' })
}
