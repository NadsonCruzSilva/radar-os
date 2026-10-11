import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { isDemoMode, auth, logOut } from '@/lib/firebase'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Visão Geral', icon: '⊞' },
  { to: '/etapas', label: 'Etapas', icon: '◈' },
  { to: '/artigos', label: 'Artigos', icon: '◉' },
  { to: '/escopo', label: 'Escopo', icon: '◎' },
  { to: '/riscos', label: 'Riscos', icon: '◬' },
  { to: '/artefatos', label: 'Artefatos', icon: '◫' },
]

interface SidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

export function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const { etapas, itensEscopo, artigos, decisoes } = useApp()
  const currentUser = auth?.currentUser

  // KPIs
  const etapasDone = etapas.filter(e => e.status === 'Concluído').length
  const mvpItems = itensEscopo.filter(i => i.tipo === 'Núcleo (MVP)')
  const mvpDone = mvpItems.filter(i => i.status === 'Concluído').length
  const artigosLidos = artigos.filter(a =>
    a.status_leitura === 'Lido' || a.status_leitura === 'Citado no texto'
  ).length
  const riscosAltos = decisoes.filter(d => d.tipo === 'Risco' && d.impacto === 'Alto').length

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[var(--color-surface)]">
      {/* Brand & Optional Close Button */}
      <div className="p-5 sm:p-6 border-b border-[var(--color-border)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--color-ink)] rounded flex items-center justify-center shrink-0">
            <span className="text-[var(--color-surface)] text-sm font-mono font-bold">R</span>
          </div>
          <span
            className="font-display text-xl tracking-widest text-[var(--color-ink)] uppercase"
            style={{ fontFamily: 'var(--font-display)' }}
          >
            Radar OS
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-full hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] text-xl transition-colors"
            aria-label="Fechar menu"
          >
            ✕
          </button>
        )}
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)] mb-3 px-2">Comandos</p>
        <nav className="flex flex-col gap-1.5">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3.5 py-2.5 min-h-[44px] rounded-[var(--radius-md)] text-sm transition-all border border-transparent select-none',
                'hover:bg-[var(--color-bg)] hover:border-[var(--color-border)]',
                isActive
                  ? 'bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-surface)] font-medium'
                  : 'text-[var(--color-ink)]'
              )}
            >
              {({ isActive }) => (
                <>
                  <span className={cn('text-base leading-none w-5 text-center font-mono', isActive ? 'text-[var(--color-surface)]' : 'text-[var(--color-ink-muted)]')}>{item.icon}</span>
                  <span>{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* System Status / KPIs */}
      <div className="p-5 sm:p-6 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)] mb-3 sm:mb-4">Status do Sistema</p>
        <div className="flex flex-col gap-2.5 sm:gap-3">
          <KPIChip label="Etapas concluídas" value={`${etapasDone}/7`} icon="✓" />
          <KPIChip label="MVP Completo" value={`${mvpDone}/${mvpItems.length}`} icon="◎" accent />
          <KPIChip label="Artigos lidos" value={String(artigosLidos)} icon="◉" />
          <KPIChip label="Riscos altos" value={String(riscosAltos)} icon="◬" danger={riscosAltos > 0} />
        </div>

        {isDemoMode ? (
          <div className="mt-5 sm:mt-6">
            <span className="inline-block w-full text-center text-[10px] uppercase tracking-widest font-mono font-bold px-2 py-1.5 rounded-full border border-[var(--color-progress)] text-[var(--color-progress)]">
              Modo Demo (Local)
            </span>
          </div>
        ) : currentUser ? (
          <div className="mt-5 sm:mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
            <span className="truncate max-w-[130px] font-mono text-[11px] text-[var(--color-ink-muted)]" title={currentUser.email || 'Convidado'}>
              {currentUser.isAnonymous ? 'Convidado' : currentUser.email || 'Conectado'}
            </span>
            <button
              onClick={() => logOut()}
              className="text-[10px] uppercase font-mono text-[var(--color-high)] hover:underline min-h-[36px] flex items-center cursor-pointer"
            >
              Sair
            </button>
          </div>
        ) : (
          <div className="mt-5 sm:mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
              <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-ink-muted)]">Modo Visitante</span>
            </div>
            <NavLink
              to="/login"
              onClick={onClose}
              className="px-3 py-1.5 text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--color-ink)] text-[var(--color-surface)] rounded-full hover:bg-[var(--color-ink)]/90 transition-colors"
            >
              Entrar
            </NavLink>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col h-screen sticky top-0 border-r border-[var(--color-border)]">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden flex">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm"
              onClick={onClose}
            />

            {/* Slide-in drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 280 }}
              className="relative z-10 w-72 max-w-[85vw] h-full shadow-2xl border-r border-[var(--color-border)]"
            >
              {sidebarContent}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  )
}

function KPIChip({ label, value, icon, accent, danger }: {
  label: string; value: string; icon: string; accent?: boolean; danger?: boolean
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className={cn(
          'text-sm font-mono',
          accent && 'text-[var(--color-ink)]',
          danger && 'text-[var(--color-high)]',
          !accent && !danger && 'text-[var(--color-ink-muted)]',
        )}>
          {icon}
        </span>
        <span className="text-xs font-medium text-[var(--color-ink-muted)]">{label}</span>
      </div>
      <span className="font-mono text-sm font-bold text-[var(--color-ink)]">{value}</span>
    </div>
  )
}
