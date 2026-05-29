'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Check, CheckCircle2 } from 'lucide-react'
import { Button, IconButton, Input } from '@/components/ui'
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
        <div className="w-14 h-14 bg-success-green rounded-full flex items-center justify-center mx-auto mb-4 text-white">
          <Check size={28} strokeWidth={2.5} />
        </div>
        <h2 className="font-display text-xl font-semibold text-charcoal">Conta criada!</h2>
        <p className="text-sm text-subtle-ash mt-1">Redirecionando…</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="-ml-2 mb-2">
        <IconButton aria-label="Voltar" variant="ghost" onClick={() => router.back()}>
          <ArrowLeft size={20} />
        </IconButton>
      </div>

      <div className="mb-2">
        <div className="w-[52px] h-[52px] bg-action-red rounded-[13px] flex items-center justify-center mb-5 text-white">
          <CheckCircle2 size={28} strokeWidth={2} />
        </div>
        <h1 className="font-display text-[32px] font-bold text-charcoal tracking-[-0.01em] leading-[1.15]">
          Criar conta
        </h1>
        <p className="text-base text-subtle-ash mt-2">
          Comece a rastrear seus hábitos.
        </p>
      </div>

      {serverError && (
        <div className="bg-tint-red border border-action-red/20 text-action-red text-sm rounded-default px-4 py-3">
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

      <Button type="submit" loading={isSubmitting} fullWidth size="md" className="!h-[50px] mt-2">
        Criar conta
      </Button>

      <p className="text-center text-xs text-dusty-sage">
        Ao criar conta, você concorda com nossos{' '}
        <Link href="/login" className="text-link-orange hover:underline">
          Termos de uso
        </Link>
      </p>

      <p className="text-center text-sm text-subtle-ash">
        Já tem conta?{' '}
        <Link href="/login" className="text-link-orange hover:underline font-medium">
          Entrar
        </Link>
      </p>
    </form>
  )
}
