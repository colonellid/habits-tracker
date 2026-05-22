import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { completeTodoistTask, createTodoistTask } from '@/lib/todoist'

interface SyncBody {
  habitId: string
  action: 'complete' | 'create'
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SyncBody
    const { habitId, action } = body

    const supabase = createServerClient()

    // Get the authorization header to identify the user
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch profile for Todoist token
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('todoist_access_token')
      .eq('id', user.id)
      .single()

    if (profileError || !profile?.todoist_access_token) {
      return NextResponse.json({ error: 'No Todoist token configured' }, { status: 400 })
    }

    const todoistToken = profile.todoist_access_token as string

    // Fetch habit
    const { data: habit, error: habitError } = await supabase
      .from('habits')
      .select('id, title, todoist_task_id')
      .eq('id', habitId)
      .eq('user_id', user.id)
      .single()

    if (habitError || !habit) {
      return NextResponse.json({ error: 'Habit not found' }, { status: 404 })
    }

    if (action === 'complete') {
      const taskId = habit.todoist_task_id as string | null
      if (!taskId) {
        return NextResponse.json({ error: 'Habit has no Todoist task linked' }, { status: 400 })
      }
      await completeTodoistTask(todoistToken, taskId)
      return NextResponse.json({ success: true, action: 'complete' })
    }

    if (action === 'create') {
      const task = await createTodoistTask(todoistToken, habit.title as string)
      // Update habit with the new task id
      await supabase
        .from('habits')
        .update({ todoist_task_id: task.id })
        .eq('id', habitId)
      return NextResponse.json({ success: true, action: 'create', taskId: task.id })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
