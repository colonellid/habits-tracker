import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { areaSchema } from '@/lib/validators'

export async function GET() {
  const supabase = createServerClient()
  const { data, error } = await supabase.from('areas').select('*').order('name')
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = areaSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: parsed.error.errors[0].message } }, { status: 422 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase.from('areas').insert(parsed.data).select().single()
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
