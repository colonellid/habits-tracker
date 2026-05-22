import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { objectiveSchema } from '@/lib/validators'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('objectives')
    .select('*, area:areas(*)')
    .order('created_at', { ascending: false })
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = objectiveSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: parsed.error.errors[0].message } }, { status: 422 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase.from('objectives').insert(parsed.data).select().single()
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
