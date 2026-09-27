import { useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { Button } from '@/components/ui'
import { toast } from 'sonner'

export default function AuthPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (isDemoMode || !supabase) {
      toast.error('Modo Demo ativo. Configure as chaves do Supabase primeiro.')
      return
    }

    setLoading(true)
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: window.location.origin,
      },
    })

    setLoading(false)
    if (error) {
      toast.error(error.message)
    } else {
      setSent(true)
      toast.success('Link mágico enviado! Verifique seu email.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] p-6">
      <div className="w-full max-w-sm">
        {/* Brand */}
        <div className="flex items-center gap-3 mb-12 justify-center">
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

        <div className="border border-[var(--color-border)] bg-[var(--color-surface)] p-6 shadow-[var(--shadow-card)]">
          <h1 className="font-mono text-sm tracking-wide uppercase text-[var(--color-ink)] mb-6 text-center">
            Acesso Restrito
          </h1>

          {sent ? (
            <div className="text-center">
              <p className="text-sm text-[var(--color-ink-muted)] mb-4">
                Enviamos um link mágico para <strong>{email}</strong>.
              </p>
              <p className="text-xs text-[var(--color-ink-muted)] mb-6">
                Clique no link para acessar o painel. Você pode fechar esta aba.
              </p>
              <Button variant="outline" className="w-full" onClick={() => setSent(false)}>
                Tentar outro email
              </Button>
            </div>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-xs font-mono text-[var(--color-ink-muted)] uppercase tracking-wide">
                  Email Institucional ou Pessoal
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="seu@email.com"
                  className="px-3 py-2 bg-[var(--color-bg)] border border-[var(--color-border)] rounded-[var(--radius-sm)] text-sm text-[var(--color-ink)] focus:outline-none focus:border-[var(--color-ink)] transition-colors placeholder:text-[var(--color-ink-muted)] font-mono"
                />
              </div>
              <Button type="submit" disabled={loading} className="w-full justify-center">
                {loading ? 'Enviando...' : 'Receber Link Mágico'}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
