'use client'

import { useState, useEffect } from 'react'
import { ChevronRight, Lock, Link2, Link2Off, LogOut, ExternalLink } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Input, Button, Modal, ErrorMessage, Toast, ScreenHeader } from '@/components/ui'

interface SectionProps {
  title: string
  children: React.ReactNode
}

function Section({ title, children }: SectionProps) {
  return (
    <section className="mb-5">
      <h2 className="text-[11px] font-semibold uppercase tracking-[0.08em] text-subtle-ash mb-2 px-1">
        {title}
      </h2>
      <div className="bg-paper border border-soft-gray rounded-card overflow-hidden">
        {children}
      </div>
    </section>
  )
}

interface RowProps {
  icon?: React.ReactNode
  label: string
  hint?: string
  onClick?: () => void
  trailing?: React.ReactNode
  destructive?: boolean
}

function Row({ icon, label, hint, onClick, trailing, destructive }: RowProps) {
  const content = (
    <div className="flex items-center gap-3 py-3.5 px-4">
      {icon && (
        <span className={`shrink-0 ${destructive ? 'text-action-red' : 'text-charcoal'}`}>
          {icon}
        </span>
      )}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm-2 font-medium ${
            destructive ? 'text-action-red' : 'text-charcoal'
          }`}
        >
          {label}
        </p>
        {hint && <p className="text-xs text-subtle-ash mt-0.5">{hint}</p>}
      </div>
      {trailing ?? (onClick && <ChevronRight size={16} className="text-dusty-sage shrink-0" />)}
    </div>
  )

  if (onClick) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="block w-full text-left hover:bg-[rgba(37,34,30,0.04)] transition-colors border-b border-soft-gray last:border-b-0"
      >
        {content}
      </button>
    )
  }
  return <div className="border-b border-soft-gray last:border-b-0">{content}</div>
}

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function handleClose() {
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (newPassword.length < 6) return setError('Senha deve ter pelo menos 6 caracteres.')
    if (newPassword !== confirmPassword) return setError('Senhas não coincidem.')
    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw new Error(updateError.message)
      setSuccess(true)
      setTimeout(handleClose, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Alterar senha" size="sm">
      {success ? (
        <p className="text-success-green text-sm font-medium text-center py-2">
          Senha alterada com sucesso!
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {error && <ErrorMessage message={error} />}
          <Input
            label="Nova senha"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Mínimo 6 caracteres"
            autoFocus
            required
          />
          <Input
            label="Confirmar"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
            required
          />
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading} fullWidth>
              Cancelar
            </Button>
            <Button type="submit" loading={loading} fullWidth>
              Salvar
            </Button>
          </div>
        </form>
      )}
    </Modal>
  )
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { user, signOut, avatarInitial } = useAuth()
  const { profile, loading, isError, updateProfile, isUpdating } = useProfile()

  const [name, setName] = useState('')
  const [profileToast, setProfileToast] = useState<string | null>(null)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)
  const [todoistModalOpen, setTodoistModalOpen] = useState(false)
  const [todoistToken, setTodoistToken] = useState('')
  const [todoistToast, setTodoistToast] = useState<string | null>(null)
  const [savingTodoist, setSavingTodoist] = useState(false)

  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setTodoistToken(profile.todoist_access_token ?? '')
    }
  }, [profile])

  async function handleSaveProfile() {
    try {
      await updateProfile({ name: name.trim() || null })
      setProfileToast('Perfil salvo!')
    } catch (err) {
      setProfileToast(err instanceof Error ? err.message : 'Erro ao salvar')
    }
  }

  async function handleSaveTodoist() {
    setSavingTodoist(true)
    try {
      await updateProfile({ todoist_access_token: todoistToken.trim() || null })
      setTodoistToast('Token salvo!')
      setTodoistModalOpen(false)
    } catch (err) {
      setTodoistToast(err instanceof Error ? err.message : 'Erro')
    } finally {
      setSavingTodoist(false)
    }
  }

  async function handleDisconnectTodoist() {
    setSavingTodoist(true)
    try {
      await updateProfile({ todoist_access_token: null })
      setTodoistToken('')
      setTodoistToast('Todoist desconectado.')
    } catch (err) {
      setTodoistToast(err instanceof Error ? err.message : 'Erro')
    } finally {
      setSavingTodoist(false)
    }
  }

  const isConnected = !!profile?.todoist_access_token
  const displayInitial = name ? name[0].toUpperCase() : avatarInitial

  if (loading) {
    return (
      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-action-red border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <ErrorMessage message="Erro ao carregar perfil. Tente recarregar." />
      </main>
    )
  }

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto pb-24">
      <ScreenHeader title="Configurações" />

      {/* Profile card */}
      <div className="bg-peach rounded-[14px] p-4 flex items-center gap-3 mb-6">
        <div className="w-[52px] h-[52px] rounded-full bg-charcoal text-paper flex items-center justify-center font-display text-xl font-bold shrink-0">
          {displayInitial}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-base-2 font-semibold text-charcoal truncate">{name || 'Sem nome'}</p>
          <p className="text-xs text-subtle-ash truncate">{user?.email}</p>
        </div>
      </div>

      <Section title="Conta">
        <Row
          label="Nome"
          trailing={
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={handleSaveProfile}
              className="text-sm-2 text-charcoal bg-transparent text-right focus:outline-none w-40"
              disabled={isUpdating}
              placeholder="Seu nome"
            />
          }
        />
        <Row label="E-mail" hint={user?.email ?? ''} />
        <Row
          icon={<Lock size={18} strokeWidth={1.5} />}
          label="Alterar senha"
          onClick={() => setPasswordModalOpen(true)}
        />
      </Section>

      <Section title="Integrações">
        {isConnected ? (
          <>
            <Row
              icon={<Link2 size={18} strokeWidth={1.5} />}
              label="Todoist"
              hint="Conectado"
              onClick={() => setTodoistModalOpen(true)}
            />
            <Row
              icon={<Link2Off size={18} strokeWidth={1.5} />}
              label="Desconectar Todoist"
              destructive
              onClick={handleDisconnectTodoist}
            />
          </>
        ) : (
          <Row
            icon={<Link2 size={18} strokeWidth={1.5} />}
            label="Conectar Todoist"
            hint="Sincronize hábitos como tarefas"
            onClick={() => setTodoistModalOpen(true)}
          />
        )}
      </Section>

      <Section title="Conta">
        <Row
          icon={<LogOut size={18} strokeWidth={1.5} />}
          label="Sair da conta"
          destructive
          onClick={signOut}
        />
      </Section>

      <p className="text-center text-xs text-dusty-sage mt-8">Habits · versão 1.0.0</p>

      <ChangePasswordModal open={passwordModalOpen} onClose={() => setPasswordModalOpen(false)} />

      <Modal
        open={todoistModalOpen}
        onClose={() => setTodoistModalOpen(false)}
        title="Integração Todoist"
        size="md"
      >
        <p className="text-sm text-subtle-ash mb-4">
          Cole seu token de API do Todoist para sincronizar hábitos como tarefas recorrentes.
        </p>
        <Input
          label="API Token"
          type="password"
          value={todoistToken}
          onChange={(e) => setTodoistToken(e.target.value)}
          placeholder="Cole seu token aqui"
        />
        <a
          href="https://todoist.com/app/settings/integrations/developer"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-link-orange hover:underline mt-2 inline-flex items-center gap-1"
        >
          Onde encontrar meu token? <ExternalLink size={11} />
        </a>
        <div className="flex gap-2 mt-5">
          <Button variant="secondary" onClick={() => setTodoistModalOpen(false)} fullWidth>
            Cancelar
          </Button>
          <Button
            onClick={handleSaveTodoist}
            loading={savingTodoist}
            disabled={!todoistToken.trim()}
            fullWidth
          >
            Salvar token
          </Button>
        </div>
      </Modal>

      {profileToast && (
        <Toast message={profileToast} type="success" onClose={() => setProfileToast(null)} />
      )}
      {todoistToast && (
        <Toast message={todoistToast} type="success" onClose={() => setTodoistToast(null)} />
      )}
    </main>
  )
}
