import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
})

export const signupSchema = loginSchema.extend({
  name: z.string().min(2, 'Name must be at least 2 characters').max(80),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

export const areaSchema = z.object({
  name: z.string().min(1).max(80),
  description: z.string().max(500).optional().nullable(),
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/),
  icon: z.string().max(10).optional().nullable(),
  is_active: z.boolean(),
})

export const objectiveSchema = z.object({
  area_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  target_date: z.string().optional().nullable(),
  status: z.enum(['active', 'completed', 'paused']),
  color: z.string().regex(/^#[0-9a-fA-F]{6}/),
})

export const habitSchema = z.object({
  area_id: z.string().uuid().optional().nullable(),
  objective_id: z.string().uuid().optional().nullable(),
  title: z.string().min(1).max(200),
  description: z.string().max(1000).optional().nullable(),
  metric_type: z.enum(['binary', 'quantity', 'duration', 'rating', 'checklist', 'note']),
  metric_config: z.record(z.unknown()),
  frequency: z.enum(['daily', 'weekly', 'monthly', 'custom']),
  frequency_config: z.record(z.unknown()),
  color: z.string().regex(/^#[0-9a-fA-F]{6}/),
  icon: z.string().max(10).optional().nullable(),
  is_active: z.boolean(),
  order_index: z.number().int(),
})

export const trackingSchema = z.object({
  habit_id: z.string().uuid(),
  tracked_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  value: z.record(z.unknown()),
  notes: z.string().max(2000).optional().nullable(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type AreaInput = z.infer<typeof areaSchema>
export type ObjectiveInput = z.infer<typeof objectiveSchema>
export type HabitInput = z.infer<typeof habitSchema>
export type TrackingInput = z.infer<typeof trackingSchema>
