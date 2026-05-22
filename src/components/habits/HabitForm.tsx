'use client'

import { useForm, Controller, useWatch } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { habitSchema, type HabitInput } from '@/lib/validators'
import { Input, Button, ColorPicker } from '@/components/ui'
import type { Area, Objective } from '@/types'

const EMOJI_LIST = ['🏋️', '📚', '🧘', '🍎', '💡', '🎵', '🌿', '💼', '🎯', '⚡', '❤️', '🌍', '🧠', '💰', '🎨', '🏃']

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
      color: '#246fe0',
      icon: null,
      is_active: true,
      order_index: 0,
      ...defaultValues,
    },
  })

  const selectedAreaId = useWatch({ control, name: 'area_id' })
  const selectedIcon = watch('icon')
  const isActive = watch('is_active')
  const metricType = watch('metric_type')

  const filteredObjectives = selectedAreaId
    ? objectives.filter((o) => o.area_id === selectedAreaId)
    : objectives

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Ex: Meditar 10 min, Beber água..."
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Descrição</label>
        <textarea
          className="input-field resize-none"
          rows={2}
          placeholder="Descreva este hábito..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-todoist-red">{errors.description.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-todoist-charcoal">Área</label>
          <select
            className="input-field"
            {...register('area_id')}
            onChange={(e) => {
              setValue('area_id', e.target.value || null)
              setValue('objective_id', null)
            }}
          >
            <option value="">Sem área</option>
            {areas.map((area) => (
              <option key={area.id} value={area.id}>
                {area.icon ? `${area.icon} ` : ''}{area.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium text-todoist-charcoal">Objetivo</label>
          <select className="input-field" {...register('objective_id')}>
            <option value="">Sem objetivo</option>
            {filteredObjectives.map((obj) => (
              <option key={obj.id} value={obj.id}>
                {obj.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-todoist-charcoal">Tipo de métrica</span>
        <div className="grid grid-cols-2 gap-2">
          {METRIC_TYPES.map((mt) => (
            <label
              key={mt.value}
              className={`flex flex-col gap-0.5 p-2.5 rounded border cursor-pointer transition-all ${
                metricType === mt.value
                  ? 'border-todoist-red bg-todoist-red-light'
                  : 'border-todoist-gray-300 hover:border-todoist-gray-400'
              }`}
            >
              <input
                type="radio"
                value={mt.value}
                className="sr-only"
                {...register('metric_type')}
              />
              <span className="text-sm font-medium text-todoist-charcoal">{mt.label}</span>
              <span className="text-xs text-todoist-gray-500">{mt.desc}</span>
            </label>
          ))}
        </div>
        {errors.metric_type && (
          <p className="text-xs text-todoist-red">{errors.metric_type.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Frequência</label>
        <select className="input-field" {...register('frequency')}>
          <option value="daily">Diário</option>
          <option value="weekly">Semanal</option>
          <option value="monthly">Mensal</option>
          <option value="custom">Personalizado</option>
        </select>
      </div>

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <ColorPicker label="Cor" value={field.value} onChange={field.onChange} />
        )}
      />

      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-todoist-charcoal">Ícone</span>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setValue('icon', null)}
            className={`w-8 h-8 rounded flex items-center justify-center text-xs border transition-all ${
              !selectedIcon
                ? 'border-todoist-red bg-todoist-red-light text-todoist-red'
                : 'border-todoist-gray-300 hover:border-todoist-gray-400 text-todoist-gray-500'
            }`}
          >
            —
          </button>
          {EMOJI_LIST.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setValue('icon', emoji)}
              className={`w-8 h-8 rounded flex items-center justify-center text-base border transition-all ${
                selectedIcon === emoji
                  ? 'border-todoist-red bg-todoist-red-light'
                  : 'border-todoist-gray-300 hover:border-todoist-gray-400'
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-todoist-charcoal">Ativo</span>
        <button
          type="button"
          onClick={() => setValue('is_active', !isActive)}
          className={`relative w-10 h-5 rounded-full transition-colors ${
            isActive ? 'bg-todoist-red' : 'bg-todoist-gray-300'
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${
              isActive ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </div>
    </form>
  )
}
