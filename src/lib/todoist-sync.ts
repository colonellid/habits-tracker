'use client'

import { supabase } from '@/lib/supabase'

export type TodoistSyncAction = 'link' | 'complete' | 'unlink'

export async function syncTodoistTask(habitId: string, action: TodoistSyncAction): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.access_token) return
  const res = await fetch('/api/todoist/sync', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
    },
    body: JSON.stringify({ habitId, action }),
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.error ?? `Todoist sync error ${res.status}`)
  }
}
