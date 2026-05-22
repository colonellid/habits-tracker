'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import type { Area, AreaCreate, AreaUpdate } from '@/types'

const QK = ['areas']

async function fetchAreas(): Promise<Area[]> {
  const { data } = await apiClient.get<{ data: Area[] }>('/areas')
  return data.data
}

async function createArea(payload: AreaCreate): Promise<Area> {
  const { data } = await apiClient.post<{ data: Area }>('/areas', payload)
  return data.data
}

async function updateArea({ id, ...payload }: AreaUpdate & { id: string }): Promise<Area> {
  const { data } = await apiClient.patch<{ data: Area }>(`/areas/${id}`, payload)
  return data.data
}

async function deleteArea(id: string): Promise<void> {
  await apiClient.delete(`/areas/${id}`)
}

export function useAreas() {
  const qc = useQueryClient()
  const query = useQuery({ queryKey: QK, queryFn: fetchAreas })
  const create = useMutation({ mutationFn: createArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const update = useMutation({ mutationFn: updateArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  const remove = useMutation({ mutationFn: deleteArea, onSuccess: () => qc.invalidateQueries({ queryKey: QK }) })
  return { ...query, create, update, remove }
}
