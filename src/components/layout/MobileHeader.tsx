import { isDemoMode } from '@/lib/firebase'

interface MobileHeaderProps {
  onOpenMenu: () => void
}

export function MobileHeader({ onOpenMenu }: MobileHeaderProps) {
  return (
    <header className="sticky top-0 z-30 lg:hidden bg-[var(--color-surface)]/95 backdrop-blur-md border-b border-[var(--color-border)] px-4 py-2.5 flex items-center justify-between">
      {/* Brand */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 bg-[var(--color-ink)] rounded flex items-center justify-center shrink-0">
          <span className="text-[var(--color-surface)] text-xs font-mono font-bold">R</span>
        </div>
        <span
          className="font-display text-base tracking-widest text-[var(--color-ink)] uppercase font-semibold"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          Radar OS
        </span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {isDemoMode && (
          <span className="text-[9px] uppercase tracking-wider font-mono font-bold px-2 py-1 rounded-full border border-[var(--color-progress)] text-[var(--color-progress)]">
            Demo
          </span>
        )}
        <button
          onClick={onOpenMenu}
          className="w-10 h-10 min-h-[44px] min-w-[44px] flex items-center justify-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-bg)] text-[var(--color-ink)] hover:bg-[var(--color-surface)] active:scale-95 transition-all text-base"
          aria-label="Abrir menu de comandos e status"
        >
          ☰
        </button>
      </div>
    </header>
  )
}
