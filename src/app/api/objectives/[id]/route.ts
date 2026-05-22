import { NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const body = await req.json()
  const supabase = createServerClient()
  const { data, error } = await supabase
    .from('objectives')
    .update(body)
    .eq('id', params.id)
    .select()
    .single()
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return NextResponse.json({ data })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const supabase = createServerClient()
  const { error } = await supabase.from('objectives').delete().eq('id', params.id)
  if (error) return NextResponse.json({ error: { message: error.message } }, { status: 500 })
  return new NextResponse(null, { status: 204 })
}
