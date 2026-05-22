'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Objective, ObjectiveCreate, ObjectiveUpdate } from '@/types'

const QK = ['objectives']

async function fetchObjectives(): Promise<Objective[]> {
  const { data, error } = await supabase
    .from('objectives')
    .select('*, area:areas(*)')
    .order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

async function createObjective(payload: ObjectiveCreate): Promise<Objective> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('objectives')
    .insert({ ...payload, user_id: user!.id })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function updateObjective({ id, ...payload }: ObjectiveUpdate & { id: string }): Promise<Objective> {
  const { data, error } = await supabase
    .from('objectives')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function deleteObjective(id: string): Promise<void> {
  const { error } = await supabase.from('objectives').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function useObjectives() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK, queryFn: fetchObjectives })
  const create = useMutation({ mutationFn: createObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const update = useMutation({ mutationFn: updateObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const remove = useMutation({ mutationFn: deleteObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  return { ...query, create, update, remove }
}
