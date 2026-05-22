'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import type { Habit, HabitCreate, HabitUpdate } from '@/types'

const QUERY_KEY = ['habits']

async function fetchHabits(): Promise<Habit[]> {
  const { data } = await apiClient.get<{ data: Habit[] }>('/habits')
  return data.data
}

async function createHabit(payload: HabitCreate): Promise<Habit> {
  const { data } = await apiClient.post<{ data: Habit }>('/habits', payload)
  return data.data
}

async function updateHabit({ id, ...payload }: HabitUpdate & { id: string }): Promise<Habit> {
  const { data } = await apiClient.patch<{ data: Habit }>(`/habits/${id}`, payload)
  return data.data
}

async function deleteHabit(id: string): Promise<void> {
  await apiClient.delete(`/habits/${id}`)
}

export function useHabits() {
  const qc = useQueryClient()

  const query = useQuery({ queryKey: QUERY_KEY, queryFn: fetchHabits })

  const create = useMutation({
    mutationFn: createHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const update = useMutation({
    mutationFn: updateHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  const remove = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })

  return { ...query, create, update, remove }
}
