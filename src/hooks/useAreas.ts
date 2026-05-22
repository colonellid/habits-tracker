'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Area, AreaCreate, AreaUpdate } from '@/types'

const QK = ['areas']

async function fetchAreas(): Promise<Area[]> {
  const { data, error } = await supabase.from('areas').select('*').order('name')
  if (error) throw new Error(error.message)
  return data
}

async function createArea(payload: AreaCreate): Promise<Area> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('areas')
    .insert({ ...payload, user_id: user!.id })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function updateArea({ id, ...payload }: AreaUpdate & { id: string }): Promise<Area> {
  const { data, error } = await supabase
    .from('areas')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function deleteArea(id: string): Promise<void> {
  const { error } = await supabase.from('areas').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function useAreas() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK, queryFn: fetchAreas })
  const create = useMutation({ mutationFn: createArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const update = useMutation({ mutationFn: updateArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const remove = useMutation({ mutationFn: deleteArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  return { ...query, create, update, remove }
}
