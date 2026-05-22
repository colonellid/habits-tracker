// ─── Auth ────────────────────────────────────────────────────────────────────

export interface User {
  id: string
  email: string
  name: string | null
  avatar_url: string | null
  todoist_access_token: string | null
  created_at: string
}

// ─── Areas ───────────────────────────────────────────────────────────────────

export interface Area {
  id: string
  user_id: string
  name: string
  description: string | null
  color: string
  icon: string | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type AreaCreate = Omit<Area, 'id' | 'user_id' | 'created_at' | 'updated_at'>
export type AreaUpdate = Partial<AreaCreate>

// ─── Objectives ──────────────────────────────────────────────────────────────

export interface Objective {
  id: string
  user_id: string
  area_id: string | null
  title: string
  description: string | null
  target_date: string | null
  status: 'active' | 'completed' | 'paused'
  color: string
  created_at: string
  updated_at: string
  area?: Area
}

export type ObjectiveCreate = Omit<Objective, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'area'>
export type ObjectiveUpdate = Partial<ObjectiveCreate>

// ─── Habits ──────────────────────────────────────────────────────────────────

export type MetricType =
  | 'binary'        // done / not done
  | 'quantity'      // numeric value
  | 'duration'      // time in minutes
  | 'rating'        // 1-5 or 1-10 scale
  | 'checklist'     // multiple sub-items
  | 'note'          // free text entry

export type HabitFrequency = 'daily' | 'weekly' | 'monthly' | 'custom'

export interface Habit {
  id: string
  user_id: string
  area_id: string | null
  objective_id: string | null
  title: string
  description: string | null
  metric_type: MetricType
  metric_config: Record<string, unknown>
  frequency: HabitFrequency
  frequency_config: Record<string, unknown>
  color: string
  icon: string | null
  is_active: boolean
  order_index: number
  todoist_task_id: string | null
  created_at: string
  updated_at: string
  area?: Area
  objective?: Objective
}

export type HabitCreate = Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'area' | 'objective'>
export type HabitUpdate = Partial<HabitCreate>

// ─── Tracking ─────────────────────────────────────────────────────────────────

export interface TrackingEntry {
  id: string
  user_id: string
  habit_id: string
  tracked_date: string
  value: TrackingValue
  notes: string | null
  created_at: string
  updated_at: string
  habit?: Habit
}

export type TrackingValue =
  | { type: 'binary'; completed: boolean }
  | { type: 'quantity'; amount: number; unit?: string }
  | { type: 'duration'; minutes: number }
  | { type: 'rating'; score: number; max: number }
  | { type: 'checklist'; items: { label: string; checked: boolean }[] }
  | { type: 'note'; text: string }

export type TrackingCreate = Omit<TrackingEntry, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'habit'>
export type TrackingUpdate = Partial<Pick<TrackingCreate, 'value' | 'notes'>>

// ─── Dashboard ────────────────────────────────────────────────────────────────

export interface DashboardStats {
  todayTotal: number
  todayCompleted: number
  streakDays: number
  weekCompletion: number
  monthCompletion: number
}

export interface HabitWithTracking extends Habit {
  todayEntry?: TrackingEntry
  streakDays: number
  completionRate7d: number
}

// ─── API Responses ────────────────────────────────────────────────────────────

export interface ApiResponse<T> {
  data: T
  error: null
}

export interface ApiError {
  data: null
  error: { message: string; code?: string }
}

export type ApiResult<T> = ApiResponse<T> | ApiError

// ─── Todoist ─────────────────────────────────────────────────────────────────

export interface TodoistTask {
  id: string
  content: string
  description: string
  project_id: string
  due: { date: string; string: string } | null
  priority: number
  labels: string[]
  is_completed: boolean
}
