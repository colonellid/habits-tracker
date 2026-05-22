'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useProfile } from '@/hooks/useProfile'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { ErrorMessage } from '@/components/ui/ErrorMessage'
import { Toast } from '@/components/ui/Toast'

// ─── Change Password Modal ────────────────────────────────────────────────────

function ChangePasswordModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  function resetState() {
    setNewPassword('')
    setConfirmPassword('')
    setError(null)
    setSuccess(false)
  }

  function handleClose() {
    resetState()
    onClose()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (newPassword.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem.')
      return
    }

    setLoading(true)
    try {
      const { error: updateError } = await supabase.auth.updateUser({ password: newPassword })
      if (updateError) throw new Error(updateError.message)
      setSuccess(true)
      setTimeout(() => { handleClose() }, 1500)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao alterar senha.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal open={open} onClose={handleClose} title="Alterar senha" size="sm">
      {success ? (
        <p className="text-todoist-green text-sm font-medium text-center py-2">
          ✓ Senha alterada com sucesso!
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
            label="Confirmar senha"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Repita a nova senha"
            required
          />
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="secondary" onClick={handleClose} disabled={loading}>
              Cancelar
            </Button>
            <Button type="submit" loading={loading}>
              Salvar senha
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

  // Profile section state
  const [name, setName] = useState('')
  const [profileError, setProfileError] = useState<string | null>(null)
  const [profileToast, setProfileToast] = useState<string | null>(null)

  // Password modal
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  // Todoist section state
  const [todoistToken, setTodoistToken] = useState('')
  const [todoistError, setTodoistError] = useState<string | null>(null)
  const [todoistToast, setTodoistToast] = useState<string | null>(null)
  const [savingTodoist, setSavingTodoist] = useState(false)

  // Sign out state
  const [signingOut, setSigningOut] = useState(false)

  // Sync name and todoist token from profile
  useEffect(() => {
    if (profile) {
      setName(profile.name ?? '')
      setTodoistToken(profile.todoist_access_token ?? '')
    }
  }, [profile])

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault()
    setProfileError(null)
    try {
      await updateProfile({ name: name.trim() || null })
      setProfileToast('Perfil salvo com sucesso!')
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : 'Erro ao salvar perfil.')
    }
  }

  async function handleSaveTodoist(e: React.FormEvent) {
    e.preventDefault()
    setTodoistError(null)
    setSavingTodoist(true)
    try {
      await updateProfile({ todoist_access_token: todoistToken.trim() || null })
      setTodoistToast('Token Todoist salvo!')
    } catch (err) {
      setTodoistError(err instanceof Error ? err.message : 'Erro ao salvar token.')
    } finally {
      setSavingTodoist(false)
    }
  }

  async function handleDisconnectTodoist() {
    setTodoistError(null)
    setSavingTodoist(true)
    try {
      await updateProfile({ todoist_access_token: null })
      setTodoistToken('')
      setTodoistToast('Todoist desconectado.')
    } catch (err) {
      setTodoistError(err instanceof Error ? err.message : 'Erro ao desconectar.')
    } finally {
      setSavingTodoist(false)
    }
  }

  async function handleSignOut() {
    setSigningOut(true)
    await signOut()
  }

  const isConnected = !!(profile?.todoist_access_token)
  const displayInitial = name ? name[0].toUpperCase() : avatarInitial

  if (loading) {
    return (
      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-todoist-red border-t-transparent rounded-full animate-spin" />
        </div>
      </main>
    )
  }

  if (isError) {
    return (
      <main className="p-4 md:p-6 max-w-2xl mx-auto">
        <ErrorMessage message="Erro ao carregar perfil. Tente recarregar a página." />
      </main>
    )
  }

  return (
    <main className="p-4 md:p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-todoist-charcoal mb-6">Configurações</h1>

      {/* ── Perfil ── */}
      <section className="card mb-4">
        <h2 className="text-base font-semibold text-todoist-charcoal mb-4">Perfil</h2>

        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-full bg-todoist-red text-white flex items-center justify-center text-2xl font-semibold flex-shrink-0">
            {displayInitial}
          </div>
          <div>
            <p className="font-medium text-todoist-charcoal">{name || 'Sem nome'}</p>
            <p className="text-sm text-todoist-gray-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          {profileError && <ErrorMessage message={profileError} />}
          <Input
            label="Nome"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Seu nome"
          />
          <Input
            label="E-mail"
            value={user?.email ?? ''}
            readOnly
            disabled
            hint="O e-mail não pode ser alterado aqui."
          />
          <div>
            <Button type="submit" loading={isUpdating}>
              Salvar perfil
            </Button>
          </div>
        </form>
      </section>

      {/* ── Segurança ── */}
      <section className="card mb-4">
        <h2 className="text-base font-semibold text-todoist-charcoal mb-1">Segurança</h2>
        <p className="text-sm text-todoist-gray-500 mb-4">
          Altere sua senha de acesso à conta.
        </p>
        <Button variant="secondary" onClick={() => setPasswordModalOpen(true)}>
          Alterar senha
        </Button>
      </section>

      {/* ── Todoist ── */}
      <section className="card mb-4">
        <h2 className="text-base font-semibold text-todoist-charcoal mb-1">Integração Todoist</h2>
        <p className="text-sm text-todoist-gray-500 mb-4">
          Conecte seu Todoist para sincronizar hábitos como tarefas.
        </p>

        {todoistError && <div className="mb-4"><ErrorMessage message={todoistError} /></div>}

        {isConnected ? (
          <div className="flex items-center gap-3 flex-wrap">
            <span className="flex items-center gap-1.5 text-sm text-todoist-green font-medium">
              <span>✅</span> Conectado ao Todoist
            </span>
            <Button
              variant="tertiary"
              size="sm"
              onClick={handleDisconnectTodoist}
              loading={savingTodoist}
            >
              Desconectar
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSaveTodoist} className="flex flex-col gap-4">
            <Input
              label="API Token"
              type="password"
              value={todoistToken}
              onChange={(e) => setTodoistToken(e.target.value)}
              placeholder="Cole seu token aqui"
              hint="Encontre seu token em Todoist → Configurações → Integrações → Developer"
            />
            <div className="flex items-center gap-4 flex-wrap">
              <Button type="submit" loading={savingTodoist} disabled={!todoistToken.trim()}>
                Salvar token
              </Button>
              <a
                href="https://todoist.com/app/settings/integrations/developer"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-todoist-blue hover:underline"
              >
                Onde encontrar meu token? →
              </a>
            </div>
          </form>
        )}
      </section>

      {/* ── Dados ── */}
      <section className="card">
        <h2 className="text-base font-semibold text-todoist-charcoal mb-1">Dados da conta</h2>
        <p className="text-sm text-todoist-gray-500 mb-4">
          Encerre sua sessão no aplicativo.
        </p>
        <Button
          variant="primary"
          className="bg-todoist-red hover:bg-todoist-red-dark"
          onClick={handleSignOut}
          loading={signingOut}
        >
          Sair da conta
        </Button>
      </section>

      {/* ── Modals & Toasts ── */}
      <ChangePasswordModal
        open={passwordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
      />

      {profileToast && (
        <Toast message={profileToast} type="success" onClose={() => setProfileToast(null)} />
      )}
      {todoistToast && (
        <Toast message={todoistToast} type="success" onClose={() => setTodoistToast(null)} />
      )}
    </main>
  )
}
