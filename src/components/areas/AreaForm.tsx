'use client'

import { useForm, Controller, type DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { areaSchema, type AreaInput } from '@/lib/validators'
import { Input, Button, ColorPicker } from '@/components/ui'

const EMOJI_LIST = ['🏠', '💼', '🏋️', '📚', '🎨', '🌿', '❤️', '🎯', '⚡', '🧘', '🍎', '💡', '🎵', '🌍', '🧠', '💰']

interface AreaFormProps {
  defaultValues?: Partial<AreaInput>
  onSubmit: (data: AreaInput) => void
  loading?: boolean
}

export function AreaForm({ defaultValues, onSubmit, loading }: AreaFormProps) {
  const formDefaults: DefaultValues<AreaInput> = {
    name: '',
    description: '',
    color: '#246fe0',
    icon: null,
    is_active: true,
    ...defaultValues,
  }

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } = useForm<AreaInput, any, AreaInput>({
    resolver: zodResolver(areaSchema),
    defaultValues: formDefaults,
  })

  const selectedIcon = watch('icon')
  const isActive = watch('is_active')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <Input
        label="Nome"
        placeholder="Ex: Saúde, Trabalho..."
        error={errors.name?.message}
        {...register('name')}
      />

      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-todoist-charcoal">Descrição</label>
        <textarea
          className="input-field resize-none"
          rows={3}
          placeholder="Descreva esta área..."
          {...register('description')}
        />
        {errors.description && (
          <p className="text-xs text-todoist-red">{errors.description.message}</p>
        )}
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
        <span className="text-sm font-medium text-todoist-charcoal">Ativa</span>
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
