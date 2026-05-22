'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button, Input } from '@/components/ui'
import { useAuth } from '@/hooks/useAuth'
import { loginSchema, type LoginInput } from '@/lib/validators'

export function LoginForm() {
  const { signIn } = useAuth()
  const router = useRouter()
  const [serverError, setServerError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginInput) {
    setServerError(null)
    try {
      await signIn(data.email, data.password)
      router.push('/dashboard')
    } catch (err) {
      setServerError(err instanceof Error ? err.message : 'Login failed')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
      <div className="text-center mb-2">
        <div className="w-10 h-10 bg-todoist-red rounded-xl flex items-center justify-center mx-auto mb-3">
          <span className="text-white text-xl">✓</span>
        </div>
        <h1 className="text-2xl font-semibold text-todoist-charcoal">Entrar</h1>
        <p className="text-sm text-todoist-gray-500 mt-1">Continue rastreando seus hábitos</p>
      </div>

      {serverError && (
        <div className="bg-todoist-red-light border border-todoist-red/20 text-todoist-red text-sm rounded-lg px-3 py-2">
          {serverError}
        </div>
      )}

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
        autoComplete="current-password"
        error={errors.password?.message}
        {...register('password')}
      />

      <Button type="submit" loading={isSubmitting} className="w-full mt-1">
        Entrar
      </Button>

      <p className="text-center text-sm text-todoist-gray-500">
        Não tem conta?{' '}
        <Link href="/signup" className="text-todoist-red hover:underline font-medium">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
