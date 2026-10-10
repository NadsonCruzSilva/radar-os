import { NavLink } from 'react-router-dom'
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

export function Sidebar() {
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

  return (
    <aside className="w-64 shrink-0 flex flex-col h-screen sticky top-0 bg-[var(--color-surface)] border-r border-[var(--color-border)]">
      {/* Brand */}
      <div className="p-6 border-b border-[var(--color-border)]">
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
      </div>

      {/* Navigation */}
      <div className="p-4 flex-1 overflow-y-auto">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)] mb-3 px-2">Comandos</p>
        <nav className="flex flex-col gap-1">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              className={({ isActive }) => cn(
                'flex items-center gap-3 px-3 py-2 rounded-[var(--radius-md)] text-sm transition-all border border-transparent',
                'hover:bg-[var(--color-bg)] hover:border-[var(--color-border)]',
                isActive
                  ? 'bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-surface)] font-medium pointer-events-none'
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
      <div className="p-6 border-t border-[var(--color-border)] bg-[var(--color-bg)]">
        <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)] mb-4">Status do Sistema</p>
        <div className="flex flex-col gap-3">
          <KPIChip label="Etapas concluídas" value={`${etapasDone}/7`} icon="✓" />
          <KPIChip label="MVP Completo" value={`${mvpDone}/${mvpItems.length}`} icon="◎" accent />
          <KPIChip label="Artigos lidos" value={String(artigosLidos)} icon="◉" />
          <KPIChip label="Riscos altos" value={String(riscosAltos)} icon="◬" danger={riscosAltos > 0} />
        </div>

        {isDemoMode ? (
          <div className="mt-6">
            <span className="inline-block w-full text-center text-[10px] uppercase tracking-widest font-mono font-bold px-2 py-1.5 rounded-full border border-[var(--color-progress)] text-[var(--color-progress)]">
              Modo Demo (Local)
            </span>
          </div>
        ) : (
          currentUser && (
            <div className="mt-6 pt-4 border-t border-[var(--color-border)] flex items-center justify-between text-xs">
              <span className="truncate max-w-[130px] font-mono text-[11px] text-[var(--color-ink-muted)]" title={currentUser.email || 'Convidado'}>
                {currentUser.isAnonymous ? 'Convidado' : currentUser.email || 'Conectado'}
              </span>
              <button
                onClick={() => logOut()}
                className="text-[10px] uppercase font-mono text-[var(--color-high)] hover:underline"
              >
                Sair
              </button>
            </div>
          )
        )}
      </div>
    </aside>
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
