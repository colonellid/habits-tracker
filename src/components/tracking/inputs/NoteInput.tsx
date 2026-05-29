'use client'

import { useEffect, useRef } from 'react'

interface NoteInputProps {
  value: string
  onChange: (text: string) => void
}

export function NoteInput({ value, onChange }: NoteInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const el = textareaRef.current
    if (!el) return
    el.style.height = 'auto'
    el.style.height = `${el.scrollHeight}px`
  }, [value])

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder="Escreva sua nota aqui…"
      className="w-full min-h-[120px] resize-none p-4 bg-paper border border-soft-gray rounded-default text-base text-charcoal placeholder:text-dusty-sage focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)]"
      rows={4}
    />
  )
}
