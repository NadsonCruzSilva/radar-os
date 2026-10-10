import { useState } from 'react'
import {
  signInWithGoogle,
  signInGuest,
  signInEmail,
  signUpEmail,
  isDemoMode,
} from '@/lib/firebase'
import { Button } from '@/components/ui'
import { toast } from 'sonner'

export default function AuthPage() {
  const [mode, setMode] = useState<'login' | 'signup'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleEmailAuth(e: React.FormEvent) {
    e.preventDefault()
    if (isDemoMode) {
      toast.error('Modo Demo ativo. Configure as chaves do Firebase no .env.local primeiro.')
      return
    }

    if (!email || !password) {
      toast.error('Preencha email e senha')
      return
    }

    setLoading(true)
    try {
      if (mode === 'login') {
        await signInEmail(email, password)
        toast.success('Login realizado com sucesso!')
      } else {
        await signUpEmail(email, password)
        toast.success('Conta criada com sucesso!')
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Erro ao autenticar')
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogleLogin() {
    if (isDemoMode) {
      toast.error('Modo Demo ativo. Configure as chaves do Firebase primeiro.')
      return
    }
    setLoading(true)
    try {
      await signInWithGoogle()
      toast.success('Autenticado com Google!')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Erro ao conectar com Google')
    } finally {
      setLoading(false)
    }
  }

  async function handleGuestLogin() {
    if (isDemoMode) {
      toast.error('Modo Demo ativo.')
      return
    }
    setLoading(true)
    try {
      await signInGuest()
      toast.success('Entrando como convidado...')
    } catch (err: any) {
      console.error(err)
      toast.error(err?.message || 'Erro ao entrar como convidado')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-3.5 sm:p-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-6 sm:mb-8 justify-center">
          <div className="w-10 h-10 bg-[var(--color-ink)] rounded flex items-center justify-center shrink-0">
            <span className="text-[var(--color-surface)] text-lg font-mono font-bold">R</span>
          </div>
          <span
            className="font-display text-2xl tracking-widest text-[var(--color-ink)] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Radar OS
          </span>
        </div>

        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:p-6 shadow-[var(--shadow-card)] rounded-[var(--radius-lg)]">
          <h1 className="font-mono text-sm tracking-wide uppercase text-[var(--color-ink)] mb-6 text-center font-bold">
            {mode === 'login' ? 'Entrar no Radar OS' : 'Criar Conta no Radar OS'}
          </h1>

          {/* Quick 1-click Google Sign-in */}
          <div className="flex flex-col gap-2.5 mb-6">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full justify-center gap-2 border-[var(--color-border)] min-h-[44px]"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Continuar com Google</span>
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleGuestLogin}
              disabled={loading}
              className="w-full justify-center text-xs text-[var(--color-ink-muted)] min-h-[44px]"
            >
              Entrar como Convidado / Anônimo
            </Button>
          </div>

          <div className="relative flex items-center justify-center mb-6">
            <hr className="w-full border-[var(--color-border)]" />
            <span className="absolute bg-[var(--color-surface)] px-2 text-[10px] uppercase font-mono text-[var(--color-ink-muted)]">
              ou com email
            </span>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-[11px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wide"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className="px-3.5 py-2.5 min-h-[44px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-base sm:text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink-muted)] font-mono"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="password"
                className="text-[11px] font-mono text-[var(--color-ink-muted)] uppercase tracking-wide"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="px-3.5 py-2.5 min-h-[44px] bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-base sm:text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink-muted)] font-mono"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full justify-center mt-2 min-h-[44px]">
              {loading
                ? 'Processando...'
                : mode === 'login'
                ? 'Entrar'
                : 'Criar Conta'}
            </Button>
          </form>

          <div className="mt-6 text-center border-t border-[var(--color-border)] pt-4">
            {mode === 'login' ? (
              <button
                type="button"
                onClick={() => setMode('signup')}
                className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors font-mono min-h-[44px] inline-flex items-center"
              >
                Não tem conta?&nbsp;<span className="underline font-bold text-[var(--color-ink)]">Criar conta</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-xs text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors font-mono min-h-[44px] inline-flex items-center"
              >
                Já tem conta?&nbsp;<span className="underline font-bold text-[var(--color-ink)]">Entrar</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
