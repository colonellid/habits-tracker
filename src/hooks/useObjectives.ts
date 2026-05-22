'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import type { Objective, ObjectiveCreate, ObjectiveUpdate } from '@/types'

const QK = ['objectives']

async function fetchObjectives(): Promise<Objective[]> {
  const { data } = await apiClient.get<{ data: Objective[] }>('/objectives')
  return data.data
}

async function createObjective(payload: ObjectiveCreate): Promise<Objective> {
  const { data } = await apiClient.post<{ data: Objective }>('/objectives', payload)
  return data.data
}

async function updateObjective({ id, ...payload }: ObjectiveUpdate & { id: string }): Promise<Objective> {
  const { data } = await apiClient.patch<{ data: Objective }>(`/objectives/${id}`, payload)
  return data.data
}

async function deleteObjective(id: string): Promise<void> {
  await apiClient.delete(`/objectives/${id}`)
}

export function useObjectives() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK, queryFn: fetchObjectives })
  const create = useMutation({ mutationFn: createObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const update = useMutation({ mutationFn: updateObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const remove = useMutation({ mutationFn: deleteObjective, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  return { ...query, create, update, remove }
}
