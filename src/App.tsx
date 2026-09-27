import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { supabase, isDemoMode } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

// Pages (lazy-imported for code splitting)
import AuthPage from '@/pages/AuthPage'
import OverviewPage from '@/pages/OverviewPage'
import EtapasPage from '@/pages/EtapasPage'
import ArtigosPage from '@/pages/ArtigosPage'
import EscopoPage from '@/pages/EscopoPage'
import RiscosPage from '@/pages/RiscosPage'
import ArtefatosPage from '@/pages/ArtefatosPage'

function AppShell() {
  const [session, setSession] = useState<Session | null>(null)
  const [loadingAuth, setLoadingAuth] = useState(!isDemoMode)

  useEffect(() => {
    if (isDemoMode || !supabase) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setLoadingAuth(false)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <span className="font-mono text-sm text-[var(--color-ink-muted)]">Carregando sistema...</span>
      </div>
    )
  }

  if (!session && !isDemoMode) {
    return <AuthPage />
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<OverviewPage />} />
            <Route path="/etapas" element={<EtapasPage />} />
            <Route path="/artigos" element={<ArtigosPage />} />
            <Route path="/escopo" element={<EscopoPage />} />
            <Route path="/riscos" element={<RiscosPage />} />
            <Route path="/artefatos" element={<ArtefatosPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppShell />
        <Toaster position="bottom-right" richColors />
      </AppProvider>
    </BrowserRouter>
  )
}
