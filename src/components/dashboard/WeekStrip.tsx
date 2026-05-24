'use client'

const DAY_LETTERS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S']

function toDateString(d: Date) {
  return d.toISOString().slice(0, 10)
}

function addDays(date: Date, days: number) {
  const d = new Date(date)
  d.setDate(d.getDate() + days)
  return d
}

interface WeekStripProps {
  selectedDate: string
  onSelect: (date: string) => void
}

export function WeekStrip({ selectedDate, onSelect }: WeekStripProps) {
  const today = toDateString(new Date())
  const selected = new Date(selectedDate + 'T00:00:00')

  const days = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(selected, i - 3)
    const dateStr = toDateString(d)
    return {
      date: dateStr,
      letter: DAY_LETTERS[d.getDay()],
      num: d.getDate(),
      isSelected: dateStr === selectedDate,
      isToday: dateStr === today,
      isFuture: dateStr > today,
    }
  })

  return (
    <div className="flex gap-1 mb-5" role="tablist" aria-label="Selecionar dia">
      {days.map((day) => (
        <button
          key={day.date}
          role="tab"
          aria-selected={day.isSelected}
          onClick={() => onSelect(day.date)}
          className={`flex-1 flex flex-col items-center gap-1 py-1.5 rounded-default transition-all duration-150 ease-out relative ${
            day.isSelected
              ? 'bg-charcoal text-paper'
              : 'text-charcoal hover:bg-[rgba(37,34,30,0.05)]'
          } ${day.isFuture ? 'opacity-55' : ''}`}
        >
          <span
            className={`text-[9px] font-semibold uppercase tracking-[0.08em] ${
              day.isSelected ? 'text-paper/70' : 'text-subtle-ash'
            }`}
          >
            {day.letter}
          </span>
          <span className="font-display text-sm-2 font-bold">{day.num}</span>
          {day.isToday && !day.isSelected && (
            <span className="absolute bottom-1 w-[3px] h-[3px] rounded-full bg-action-red" />
          )}
        </button>
      ))}
    </div>
  )
}
