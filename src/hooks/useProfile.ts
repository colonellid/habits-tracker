'use client'

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export interface Profile {
  id: string
  name: string | null
  email: string | null
  avatar_url: string | null
  todoist_access_token: string | null
  created_at: string
  updated_at: string
}

export type ProfileUpdate = Partial<Pick<Profile, 'name' | 'todoist_access_token'>>

const QK = ['profile']

async function fetchProfile(): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()
  if (error) throw new Error(error.message)
  return data as Profile
}

async function updateProfileFn(payload: ProfileUpdate): Promise<Profile> {
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...payload, updated_at: new Date().toISOString() })
    .eq('id', user.id)
    .select()
    .single()
  if (error) throw new Error(error.message)
  return data as Profile
}

export function useProfile() {
  const qc = useQueryClient()

  const query = useQuery({
    queryKey: QK,
    queryFn: fetchProfile,
  })

  const update = useMutation({
    mutationFn: updateProfileFn,
    onSuccess: () => qc.invalidateQueries({ queryKey: QK }),
  })

  return {
    profile: query.data ?? null,
    loading: query.isLoading,
    isError: query.isError,
    error: query.error,
    updateProfile: (data: ProfileUpdate) => update.mutateAsync(data),
    isUpdating: update.isPending,
    updateError: update.error,
  }
}
