import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

interface MobileBottomNavProps {
  onOpenMenu: () => void
}

const mainNavItems = [
  { to: '/', label: 'Geral', icon: '⊞' },
  { to: '/etapas', label: 'Etapas', icon: '◈' },
  { to: '/artigos', label: 'Artigos', icon: '◉' },
  { to: '/escopo', label: 'Escopo', icon: '◎' },
]

export function MobileBottomNav({ onOpenMenu }: MobileBottomNavProps) {
  return (
    <nav
      className="fixed bottom-0 inset-x-0 z-30 lg:hidden bg-[var(--color-surface)]/95 backdrop-blur-md border-t border-[var(--color-border)] shadow-lg"
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center justify-around px-2 py-1.5 h-16 max-w-lg mx-auto">
        {mainNavItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) => cn(
              'flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-[var(--radius-md)] transition-colors select-none',
              isActive
                ? 'text-[var(--color-ink)] font-bold'
                : 'text-[var(--color-ink-muted)] hover:text-[var(--color-ink)]'
            )}
          >
            {({ isActive }) => (
              <>
                <span className={cn(
                  'text-lg font-mono leading-none transition-transform',
                  isActive && 'scale-110 font-bold'
                )}>
                  {item.icon}
                </span>
                <span className="text-[10px] tracking-tight mt-1 truncate max-w-[56px] text-center">
                  {item.label}
                </span>
                {isActive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-ink)] mt-0.5" />
                )}
              </>
            )}
          </NavLink>
        ))}

        {/* Menu / Drawer button in thumb zone */}
        <button
          onClick={onOpenMenu}
          className="flex flex-col items-center justify-center flex-1 min-h-[48px] py-1 px-1 rounded-[var(--radius-md)] text-[var(--color-ink-muted)] hover:text-[var(--color-ink)] transition-colors select-none"
          aria-label="Mais opções e status do sistema"
        >
          <span className="text-lg font-mono leading-none">☰</span>
          <span className="text-[10px] tracking-tight mt-1 text-center">Mais</span>
        </button>
      </div>
    </nav>
  )
}
