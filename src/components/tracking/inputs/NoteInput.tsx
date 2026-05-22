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
      placeholder="Escreva sua nota aqui..."
      className="input-field w-full resize-none overflow-hidden min-h-[80px]"
      rows={3}
    />
  )
}
