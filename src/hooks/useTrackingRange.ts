'use client'

import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import type { TrackingEntry } from '@/types'

async function fetchTrackingRange(from: string, to: string): Promise<TrackingEntry[]> {
  const { data, error } = await supabase
    .from('tracking_entries')
    .select('*, habit:habits(*)')
    .gte('tracked_date', from)
    .lte('tracked_date', to)
    .order('tracked_date', { ascending: false })
  if (error) throw new Error(error.message)
  return data
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().slice(0, 10)
}

export function useTrackingRange(days: number) {
  const to = new Date().toISOString().slice(0, 10)
  const from = daysAgo(days - 1)

  return useQuery({
    queryKey: ['tracking-range', from, to],
    queryFn: () => fetchTrackingRange(from, to),
    staleTime: 60_000,
  })
}
