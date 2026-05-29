'use client'

interface MiniGridProps {
  /** 30 booleans (oldest → newest) representando os últimos 30 dias */
  data: boolean[]
  accentColor?: string
  className?: string
}

export function MiniGrid({ data, accentColor = '#e34432', className = '' }: MiniGridProps) {
  const cells = Array.from({ length: 30 }, (_, i) => data[i] ?? false)

  return (
    <div
      className={`grid grid-cols-[repeat(15,minmax(0,1fr))] gap-[2.5px] ${className}`}
      aria-hidden
    >
      {cells.map((filled, i) => (
        <div
          key={i}
          className="aspect-square rounded-[2px]"
          style={{
            backgroundColor: filled ? accentColor : 'rgba(37, 34, 30, 0.07)',
            opacity: filled ? 1 : 0.6,
          }}
        />
      ))}
    </div>
  )
}
