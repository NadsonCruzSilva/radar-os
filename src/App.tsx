import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AppProvider } from '@/context/AppContext'
import { Sidebar } from '@/components/layout/Sidebar'
import { MobileHeader } from '@/components/layout/MobileHeader'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { Toaster } from 'sonner'
import { useEffect, useState } from 'react'
import { auth, isDemoMode } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'

// Pages
import AuthPage from '@/pages/AuthPage'
import OverviewPage from '@/pages/OverviewPage'
import EtapasPage from '@/pages/EtapasPage'
import ArtigosPage from '@/pages/ArtigosPage'
import EscopoPage from '@/pages/EscopoPage'
import RiscosPage from '@/pages/RiscosPage'
import ArtefatosPage from '@/pages/ArtefatosPage'

function AppShell() {
  const [loadingAuth, setLoadingAuth] = useState(() => !isDemoMode && !!auth)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (!auth || isDemoMode) return

    const unsubscribe = onAuthStateChanged(auth, () => {
      setLoadingAuth(false)
    })

    return () => unsubscribe()
  }, [])

  if (loadingAuth) {
    return (
      <div className="flex h-screen items-center justify-center bg-[var(--color-bg)]">
        <span className="font-mono text-sm text-[var(--color-ink-muted)]">Carregando sistema...</span>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={<AuthPage />} />
      <Route
        path="/*"
        element={
          <div className="flex h-screen overflow-hidden bg-[var(--color-bg)]">
            {/* Sidebar: persistent on desktop (lg+), animated drawer on mobile */}
            <Sidebar
              mobileOpen={mobileMenuOpen}
              onClose={() => setMobileMenuOpen(false)}
            />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
              {/* Mobile Top Header (compact with brand and drawer toggle) */}
              <MobileHeader onOpenMenu={() => setMobileMenuOpen(true)} />

              {/* Main Content Area */}
              <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
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

              {/* Mobile Bottom Navigation (Thumb Zone friendly) */}
              <MobileBottomNav onOpenMenu={() => setMobileMenuOpen(true)} />
            </div>
          </div>
        }
      />
    </Routes>
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
