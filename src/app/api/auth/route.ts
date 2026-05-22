import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function POST(req: Request) {
  const { action, email, password, name } = await req.json()
  const supabase = createServerClient()

  if (action === 'signup') {
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { name },
      email_confirm: true,
    })
    if (error) return NextResponse.json({ error: { message: error.message } }, { status: 400 })
    return NextResponse.json({ data })
  }

  return NextResponse.json({ error: { message: 'Unknown action' } }, { status: 400 })
}
