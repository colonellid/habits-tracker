import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'
import { trackingSchema } from '@/lib/validators'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')
  const habitId = searchParams.get('habit_id')

  const supabase = createServerClient()
  let query = supabase.from('tracking_entries').select('*, habit:habits(*)')

  if (date) query = query.eq('tracked_date', date)
  if (habitId) query = query.eq('habit_id', habitId)

  const { data, error } = await query.order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

export async function POST(req: Request) {
  const body = await req.json()
  const parsed = trackingSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: { message: parsed.error.errors[0].message } }, { status: 422 })
  }

  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('tracking_entries')
    .upsert(parsed.data, { onConflict: 'habit_id,tracked_date' })
    .select()
    .single()

  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data }, { status: 201 })
}
