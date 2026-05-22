'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { Habit, HabitCreate, HabitUpdate } from '@/types'

const QK = ['habits']

async function fetchHabits(): Promise<Habit[]> {
  const { data, error } = await supabase
    .from('habits')
    .select('*, area:areas(*), objective:objectives(*)')
    .order('order_index')
  if (error) throw new Error(error.message)
  return data
}

async function createHabit(payload: HabitCreate): Promise<Habit> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('habits')
    .insert({ ...payload, user_id: user!.id })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function updateHabit({ id, ...payload }: HabitUpdate & { id: string }): Promise<Habit> {
  const { data, error } = await supabase
    .from('habits')
    .update(payload)
    .eq('id', id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
}

async function deleteHabit(id: string): Promise<void> {
  const { error } = await supabase.from('habits').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

export function useHabits() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK, queryFn: fetchHabits })
  const create = useMutation({ mutationFn: createHabit, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const update = useMutation({ mutationFn: updateHabit, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const remove = useMutation({ mutationFn: deleteHabit, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  return { ...query, create, update, remove }
}
