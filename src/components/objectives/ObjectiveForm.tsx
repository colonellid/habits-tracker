'use client'

import { useForm, Controller, type DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { objectiveSchema, type ObjectiveInput } from '@/lib/validators'
import { Input, Button, ColorPicker } from '@/components/ui'
import type { Area } from '@/types'

interface ObjectiveFormProps {
  defaultValues?: Partial<ObjectiveInput>
  areas: Area[]
  onSubmit: (data: ObjectiveInput) => void
  loading?: boolean
}

export function ObjectiveForm({ defaultValues, areas, onSubmit, loading }: ObjectiveFormProps) {
  const formDefaults: DefaultValues<ObjectiveInput> = {
    title: '',
    description: '',
    area_id: null,
    status: 'active',
    target_date: null,
    color: '#246fe0',
    ...defaultValues,
  }

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<ObjectiveInput, any, ObjectiveInput>({
    resolver: zodResolver(objectiveSchema),
    defaultValues: formDefaults,
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Título"
        placeholder="Ex: Perder 5kg, Ler 12 livros..."
        error={errors.title?.message}
        {...register('title')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Descrição</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Descreva este objetivo..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-todoist-red">{errors.description.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Área</label>
        <select className="input-field" {...register('area_id')}>
          <option value="">Sem área</option>
          {areas.map((area) => (
            <option key={area.id} value={area.id}>
              {area.icon ? `${area.icon} ` : ''}{area.name}
            </option>
          ))}
        </select>
        {errors.area_id && (
          <p className="text-xs text-todoist-red">{errors.area_id.message}</p>
        )}
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Status</label>
        <select className="input-field" {...register('status')}>
          <option value="active">Ativo</option>
          <option value="paused">Pausado</option>
          <option value="completed">Concluído</option>
        </select>
      </div>

      <Input
        label="Data alvo"
        type="date"
        error={errors.target_date?.message}
        {...register('target_date')}
      />

      <Controller
        name="color"
        control={control}
        render={({ field }) => (
          <ColorPicker label="Cor" value={field.value} onChange={field.onChange} />
        )}
      />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="submit" loading={loading}>
          Salvar
        </Button>
      </div>
    </form>
  )
}
