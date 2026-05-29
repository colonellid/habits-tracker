'use client'

import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { habitSchema, type HabitInput } from '@/lib/validators'
import { Input, Button, Select, Toggle } from '@/components/ui'
import { HabitIcon, HABIT_ICON_OPTIONS } from '@/components/habits/HabitIcon'
import type { Area, Objective } from '@/types'

const COLOR_SWATCHES = [
  { value: '#e34432', label: 'Vermelho' },
  { value: '#cf3520', label: 'Laranja' },
  { value: '#0f66ae', label: 'Azul' },
  { value: '#4c7a45', label: 'Verde' },
]

const METRIC_TYPES = [
  { value: 'binary', label: 'Binário', desc: 'Feito / Não feito' },
  { value: 'quantity', label: 'Quantidade', desc: 'Valor numérico' },
  { value: 'duration', label: 'Duração', desc: 'Tempo em minutos' },
  { value: 'rating', label: 'Avaliação', desc: 'Escala 1-5 ou 1-10' },
  { value: 'checklist', label: 'Checklist', desc: 'Múltiplos itens' },
  { value: 'note', label: 'Nota', desc: 'Texto livre' },
] as const

interface HabitFormProps {
  defaultValues?: Partial<HabitInput>
  areas: Area[]
  objectives: Objective[]
  onSubmit: (data: HabitInput) => void
  loading?: boolean
}

export function HabitForm({ defaultValues, areas, objectives, onSubmit, loading }: HabitFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: '',
      description: '',
      area_id: null,
      objective_id: null,
      metric_type: 'binary',
      metric_config: {},
      frequency: 'daily',
      frequency_config: {},
      color: '#e34432',
      icon: null,
      is_active: true,
      order_index: 0,
      ...defaultValues,
    },
  })

  const selectedAreaId = useWatch({ control, name: 'area_id' })
  const selectedIcon = watch('icon')
  const selectedColor = watch('color')
  const isActive = watch('is_active')
  const metricType = watch('metric_type')

  const filteredObjectives = selectedAreaId
    ? objectives.filter((o) => o.area_id === selectedAreaId)
    : objectives

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <Input
        label="Título"
        placeholder="Ex: Meditar 10 min, Beber água..."
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1.5">
        <label className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash">
          Descrição
        </label>
        <textarea
          className="w-full min-h-[64px] resize-none p-3 bg-paper border border-soft-gray rounded-default text-sm-2 text-charcoal placeholder:text-dusty-sage focus:outline-none focus:border-action-red focus:shadow-[0_0_0_3px_rgba(227,68,50,0.08)]"
          rows={2}
          placeholder="Descreva este hábito..."
          {...register('description')}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Área"
          {...register('area_id', {
            setValueAs: (v: string) => v || null,
            onChange: () => setValue('objective_id', null),
          })}
          options={[
            { value: '', label: 'Sem área' },
            ...areas.map((a) => ({ value: a.id, label: a.name })),
          ]}
        />
        <Select
          label="Objetivo"
          {...register('objective_id', { setValueAs: (v: string) => v || null })}
          options={[
            { value: '', label: 'Sem objetivo' },
            ...filteredObjectives.map((o) => ({ value: o.id, label: o.title })),
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash">
          Tipo de métrica
        </span>
        <div className="grid grid-cols-2 gap-2">
          {METRIC_TYPES.map((mt) => (
            <label
              key={mt.value}
              className={`flex flex-col gap-0.5 p-3 rounded-default border cursor-pointer transition-all ${
                metricType === mt.value
                  ? 'border-action-red bg-tint-red'
                  : 'border-soft-gray hover:border-charcoal'
              }`}
            >
              <input
                type="radio"
                value={mt.value}
                className="sr-only"
                {...register('metric_type')}
              />
              <span className="text-sm-2 font-semibold text-charcoal">{mt.label}</span>
              <span className="text-xs text-subtle-ash">{mt.desc}</span>
            </label>
          ))}
        </div>
      </div>

      <Select
        label="Frequência"
        {...register('frequency')}
        options={[
          { value: 'daily', label: 'Diário' },
          { value: 'weekly', label: 'Semanal' },
          { value: 'monthly', label: 'Mensal' },
          { value: 'custom', label: 'Personalizado' },
        ]}
      />

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <div className="flex flex-col gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash">
              Cor
            </span>
            <div className="flex gap-2">
              {COLOR_SWATCHES.map((c) => (
                <button
                  key={c.value}
                  type="button"
                  onClick={() => field.onChange(c.value)}
                  aria-label={c.label}
                  className={`w-10 h-10 rounded-default transition-all ${
                    selectedColor === c.value
                      ? 'ring-2 ring-offset-2 ring-charcoal scale-105'
                      : 'hover:scale-105'
                  }`}
                  style={{ backgroundColor: c.value }}
                />
              ))}
            </div>
          </div>
        )}
      />

      <div className="flex flex-col gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-subtle-ash">
          Ícone
        </span>
        <div className="grid grid-cols-6 gap-2">
          {HABIT_ICON_OPTIONS.map((opt) => {
            const selected = selectedIcon === opt.name
            return (
              <button
                key={opt.name}
                type="button"
                onClick={() => setValue('icon', opt.name)}
                aria-label={opt.label}
                title={opt.label}
                className={`w-10 h-10 rounded-default flex items-center justify-center transition-all ${
                  selected
                    ? 'bg-tint-red text-action-red ring-1 ring-action-red'
                    : 'bg-bg-muted text-charcoal hover:bg-bg-muted-strong'
                }`}
              >
                <HabitIcon name={opt.name} size={18} />
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-sm-2 font-semibold text-charcoal">Ativo</p>
          <p className="text-xs text-subtle-ash">Aparecer no dashboard e rastreamento</p>
        </div>
        <Toggle checked={isActive} onChange={(v) => setValue('is_active', v)} />
      </div>

      <Button type="submit" loading={loading} fullWidth>
        Salvar
      </Button>
    </form>
  )
}
