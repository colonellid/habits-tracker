'use client'

import {
  BookOpen,
  Activity,
  Leaf,
  Droplet,
  Pen,
  Moon,
  Sun,
  Code,
  Heart,
  Target,
  Coffee,
  Dumbbell,
  Music,
  Brain,
  Footprints,
  Apple,
  Smile,
  Star,
  CheckCircle2,
  type LucideIcon,
} from 'lucide-react'

const ICON_MAP: Record<string, LucideIcon> = {
  book: BookOpen,
  'book-open': BookOpen,
  reading: BookOpen,
  activity: Activity,
  exercise: Activity,
  dumbbell: Dumbbell,
  workout: Dumbbell,
  leaf: Leaf,
  meditation: Leaf,
  droplet: Droplet,
  water: Droplet,
  pen: Pen,
  writing: Pen,
  moon: Moon,
  sleep: Moon,
  sun: Sun,
  wake: Sun,
  code: Code,
  coding: Code,
  heart: Heart,
  cardio: Heart,
  target: Target,
  goal: Target,
  coffee: Coffee,
  music: Music,
  brain: Brain,
  footprints: Footprints,
  walking: Footprints,
  apple: Apple,
  nutrition: Apple,
  smile: Smile,
  star: Star,
  default: CheckCircle2,
}

export const HABIT_ICON_OPTIONS: { name: string; label: string }[] = [
  { name: 'book', label: 'Leitura' },
  { name: 'activity', label: 'Exercício' },
  { name: 'dumbbell', label: 'Treino' },
  { name: 'leaf', label: 'Meditação' },
  { name: 'droplet', label: 'Água' },
  { name: 'pen', label: 'Escrita' },
  { name: 'moon', label: 'Sono' },
  { name: 'sun', label: 'Despertar' },
  { name: 'code', label: 'Código' },
  { name: 'heart', label: 'Cardio' },
  { name: 'target', label: 'Meta' },
  { name: 'coffee', label: 'Café' },
  { name: 'music', label: 'Música' },
  { name: 'brain', label: 'Mente' },
  { name: 'footprints', label: 'Caminhada' },
  { name: 'apple', label: 'Nutrição' },
  { name: 'smile', label: 'Humor' },
  { name: 'star', label: 'Outro' },
]

interface HabitIconProps {
  name?: string | null
  size?: number
  className?: string
  strokeWidth?: number
}

export function HabitIcon({ name, size = 20, className = '', strokeWidth = 1.5 }: HabitIconProps) {
  const key = (name ?? 'default').toLowerCase()
  const Icon = ICON_MAP[key] ?? ICON_MAP.default
  return <Icon size={size} strokeWidth={strokeWidth} className={className} />
}
