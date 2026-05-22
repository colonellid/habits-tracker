import type { MetricType, TrackingValue } from '@/types'

export function getDefaultValue(type: MetricType): TrackingValue {
  switch (type) {
    case 'binary':    return { type: 'binary', completed: false }
    case 'quantity':  return { type: 'quantity', amount: 0 }
    case 'duration':  return { type: 'duration', minutes: 0 }
    case 'rating':    return { type: 'rating', score: 0, max: 5 }
    case 'checklist': return { type: 'checklist', items: [] }
    case 'note':      return { type: 'note', text: '' }
  }
}

export function isCompleted(value: TrackingValue): boolean {
  switch (value.type) {
    case 'binary':    return value.completed
    case 'quantity':  return value.amount > 0
    case 'duration':  return value.minutes > 0
    case 'rating':    return value.score > 0
    case 'checklist': return value.items.length > 0 && value.items.every((i) => i.checked)
    case 'note':      return value.text.trim().length > 0
  }
}

export function formatValue(value: TrackingValue): string {
  switch (value.type) {
    case 'binary':    return value.completed ? 'Done' : 'Not done'
    case 'quantity':  return `${value.amount}${value.unit ? ' ' + value.unit : ''}`
    case 'duration': {
      const h = Math.floor(value.minutes / 60)
      const m = value.minutes % 60
      return h > 0 ? `${h}h ${m}m` : `${m}m`
    }
    case 'rating':    return `${value.score}/${value.max}`
    case 'checklist': {
      const done = value.items.filter((i) => i.checked).length
      return `${done}/${value.items.length}`
    }
    case 'note':      return value.text.slice(0, 40)
  }
}

export const METRIC_LABELS: Record<MetricType, string> = {
  binary: 'Binary (Yes/No)',
  quantity: 'Quantity',
  duration: 'Duration',
  rating: 'Rating',
  checklist: 'Checklist',
  note: 'Note',
}
