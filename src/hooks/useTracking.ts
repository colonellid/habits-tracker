'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { TrackingEntry, TrackingCreate } from '@/types'

function queryKey(date: string) {
  return ['tracking', date]
}

async function fetchTrackingByDate(date: string): Promise<TrackingEntry[]> {
  const { data, error } = await supabase
    .from('tracking_entries')
    .select('*, habit:habits(*)')
    .eq('tracked_date', date)
  if (error) throw new Error(error.message)
  return data
}

async function upsertTracking(payload: TrackingCreate): Promise<TrackingEntry> {
  const { data: { user } } = await supabase.auth.getUser()
  const { data, error } = await supabase
    .from('tracking_entries')
    .upsert({ ...payload, user_id: user!.id }, { onConflict: 'habit_id,tracked_date' })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data
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
