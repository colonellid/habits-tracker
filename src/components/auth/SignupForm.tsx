'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { signupSchema, type SignupInput } from '@/lib/validators'

export function SignupForm() {
  const { signUp } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({ resolver: zodResolver(signupSchema) })

  async function onSubmit(data: SignupInput) {
    setServerError(null)
    try {
      await signUp(data.email, data.password, data.name)
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 1500)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Erro ao criar conta')
    }
  }

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-12 h-12 bg-todoist-green rounded-full flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-2xl">✓</span>
        </div>
        <h2 className="text-lg font-semibold text-todoist-charcoal">Conta criada!</h2>
        <p className="text-sm text-todoist-gray-500 mt-1">Redirecionando…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-10 h-10 bg-todoist-red rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold text-todoist-charcoal">Criar conta</h1>
        <p className="text-sm text-todoist-gray-500 mt-1">Comece a rastrear seus hábitos</p>
      </div>

      {serverError && (
        <div className="bg-todoist-red-light border border-todoist-red/20 text-todoist-red text-sm rounded-lg px-3 py-2">
          {serverError}
        </div>
      )}

      <Input
        label="Nome"
        type="text"
        placeholder="Seu nome"
        autoComplete="name"
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        hint="Mínimo 6 caracteres"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full mt-1">
        Criar conta
      </Button>

      <p className="text-center text-sm text-todoist-gray-500">
        Já tem conta?{' '}
        <Link href="/login" className="text-todoist-red hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </form>
  )
}
