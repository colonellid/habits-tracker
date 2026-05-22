'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiClient from '@/lib/api-client'
import type { TrackingEntry, TrackingCreate } from '@/types'

function queryKey(date: string) {
  return ['tracking', date]
}

async function fetchTrackingByDate(date: string): Promise<TrackingEntry[]> {
  const { data } = await apiClient.get<{ data: TrackingEntry[] }>(`/tracking?date=${date}`)
  return data.data
}

async function upsertTracking(payload: TrackingCreate): Promise<TrackingEntry> {
  const { data } = await apiClient.post<{ data: TrackingEntry }>('/tracking', payload)
  return data.data
}

export function useTracking(date: string) {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: queryKey(date),
    queryFn: () => fetchTrackingByDate(date),
  })

  const track = useMutation({
    mutationFn: upsertTracking,
    onSuccess: (_, variables) => {
      qc.invalidateQueries({ queryKey: queryKey(variables.tracked_date) })
    },
  })

  return { ...query, track }
}
