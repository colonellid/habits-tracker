'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2 } from 'lucide-react'
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
      setServerError(err instanceof Error ? err.message : 'Falha ao entrar')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
      <div className="mb-2">
        <div className="w-[52px] h-[52px] bg-action-red rounded-[13px] flex items-center justify-center mb-5 text-white">
          <CheckCircle2 size={28} strokeWidth={2} />
        </div>
        <h1 className="font-display text-[32px] font-bold text-charcoal tracking-[-0.01em] leading-[1.15]">
          Bem-vindo de volta.
        </h1>
        <p className="text-base text-subtle-ash mt-2">
          Continue rastreando seus hábitos.
        </p>
      </div>

      {serverError && (
        <div className="bg-tint-red border border-action-red/20 text-action-red text-sm rounded-default px-4 py-3">
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

      <div>
        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register('password')}
        />
        <div className="text-right mt-1.5">
          <Link href="/login" className="text-sm text-link-orange hover:underline">
            Esqueceu a senha?
          </Link>
        </div>
      </div>

      <Button type="submit" loading={isSubmitting} fullWidth size="md" className="!h-[50px] mt-2">
        Entrar
      </Button>

      <p className="text-center text-sm text-subtle-ash">
        Novo por aqui?{' '}
        <Link href="/signup" className="text-link-orange hover:underline font-medium">
          Criar conta
        </Link>
      </p>
    </form>
  )
}
