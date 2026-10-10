import { cn } from '@/lib/utils'
import type { StatusEtapa, ImpactoRisco, TipoRisco, StatusLeitura, StatusArtefato } from '@/types'

// ─── Badge ────────────────────────────────────────────────────────────────────

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'accent' | 'success' | 'warning' | 'muted' | 'high' | 'mid' | 'low'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-widest whitespace-nowrap border',
      variant === 'default' && 'border-[var(--color-border)] text-[var(--color-ink)]',
      variant === 'accent' && 'border-[var(--color-ink)] text-[var(--color-ink)] bg-[var(--color-bg)]',
      variant === 'success' && 'border-[var(--color-done)] text-[var(--color-done)]',
      variant === 'warning' && 'border-[var(--color-progress)] text-[var(--color-progress)]',
      variant === 'muted' && 'border-[var(--color-border)] text-[var(--color-ink-muted)]',
      variant === 'high' && 'border-[var(--color-high)] text-[var(--color-high)]',
      variant === 'mid' && 'border-[var(--color-mid)] text-[var(--color-mid)]',
      variant === 'low' && 'border-[var(--color-low)] text-[var(--color-low)]',
      className
    )}>
      {children}
    </span>
  )
}

// ─── Status Badge helpers ─────────────────────────────────────────────────────

export function StatusBadge({ status }: { status: StatusEtapa }) {
  const variant = status === 'Concluído' ? 'success' : status === 'Em andamento' ? 'warning' : 'default'
  return <Badge variant={variant}>{status}</Badge>
}

export function ImpactoBadge({ impacto }: { impacto: ImpactoRisco }) {
  const variant = impacto === 'Alto' ? 'high' : impacto === 'Médio' ? 'mid' : 'low'
  return <Badge variant={variant}>{impacto}</Badge>
}

export function TipoRiscoBadge({ tipo }: { tipo: TipoRisco }) {
  const variant = tipo === 'Risco' ? 'high' : tipo === 'Decisão' ? 'accent' : 'muted'
  return <Badge variant={variant}>{tipo}</Badge>
}

export function LeituraBadge({ status }: { status: StatusLeitura }) {
  const map: Record<StatusLeitura, BadgeProps['variant']> = {
    'A ler': 'default',
    'Lendo': 'warning',
    'Lido': 'success',
    'Citado no texto': 'accent',
  }
  return <Badge variant={map[status]}>{status}</Badge>
}

export function ArtefatoStatusBadge({ status }: { status: StatusArtefato }) {
  const variant = status === 'Concluído' ? 'success' : status === 'Em andamento' ? 'warning' : 'default'
  return <Badge variant={variant}>{status}</Badge>
}

// ─── Card ─────────────────────────────────────────────────────────────────────

export function Card({
  children, className, ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-xl)]',
        'transition-shadow duration-200',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

// ─── Button ───────────────────────────────────────────────────────────────────

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export function Button({ variant = 'primary', size = 'md', className, children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 font-mono font-bold uppercase tracking-widest rounded-full transition-all duration-150 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border select-none',
        size === 'sm' && 'min-h-[36px] px-3.5 py-1.5 text-[11px]',
        size === 'md' && 'min-h-[44px] px-5 py-2 text-xs',
        size === 'lg' && 'min-h-[48px] px-7 py-3 text-sm',
        variant === 'primary' && 'bg-[var(--color-ink)] border-[var(--color-ink)] text-[var(--color-surface)] hover:bg-transparent hover:text-[var(--color-ink)] active:scale-95',
        variant === 'ghost' && 'border-transparent text-[var(--color-ink-muted)] hover:border-[var(--color-border)] hover:text-[var(--color-ink)]',
        variant === 'outline' && 'border border-[var(--color-border)] text-[var(--color-ink)] hover:bg-[var(--color-bg)]',
        variant === 'danger' && 'border-[var(--color-high)] text-[var(--color-high)] hover:bg-[var(--color-high)] hover:text-white',
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}

// ─── Input ────────────────────────────────────────────────────────────────────

export function Input({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        'w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
        'text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]',
        'outline-none focus:ring-1 focus:ring-[var(--color-ink)] focus:border-[var(--color-ink)] transition-all',
        className
      )}
      {...props}
    />
  )
}

// ─── Textarea ─────────────────────────────────────────────────────────────────

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        'w-full px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
        'text-[var(--color-ink)] placeholder:text-[var(--color-ink-muted)]',
        'outline-none focus:ring-1 focus:ring-[var(--color-ink)] focus:border-[var(--color-ink)] transition-all resize-none',
        className
      )}
      {...props}
    />
  )
}

// ─── Select ───────────────────────────────────────────────────────────────────

export function Select({ className, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        'w-full min-h-[44px] px-3.5 py-2.5 text-base sm:text-sm font-mono bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)]',
        'text-[var(--color-ink)] outline-none focus:ring-1 focus:ring-[var(--color-ink)] focus:border-[var(--color-ink)] transition-all cursor-pointer',
        className
      )}
      {...props}
    />
  )
}

// ─── Label ────────────────────────────────────────────────────────────────────

export function Label({ className, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn('block text-xs font-medium text-[var(--color-ink-muted)] mb-1.5 font-mono uppercase tracking-wide', className)}
      {...props}
    />
  )
}

// ─── Dialog (Modal) ───────────────────────────────────────────────────────────

interface DialogProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
}

export function Dialog({ open, onClose, title, children, size = 'md' }: DialogProps) {
  if (!open) return null
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="fixed inset-0 bg-[var(--color-ink)]/40 backdrop-blur-sm" onClick={onClose} />
      <div className={cn(
        'relative z-10 bg-[var(--color-surface)] rounded-[var(--radius-xl)] shadow-2xl w-full max-h-[92vh] flex flex-col my-auto border border-[var(--color-border)]',
        size === 'sm' && 'max-w-sm',
        size === 'md' && 'max-w-lg',
        size === 'lg' && 'max-w-2xl',
      )}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-[var(--color-border)] shrink-0">
          <h2 className="text-base sm:text-lg font-display text-[var(--color-ink)]">{title}</h2>
          <button
            onClick={onClose}
            className="w-10 h-10 min-h-[40px] min-w-[40px] flex items-center justify-center rounded-full hover:bg-[var(--color-bg)] text-[var(--color-ink-muted)] transition-colors text-2xl leading-none"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>
        <div className="p-4 sm:p-6 overflow-y-auto flex-1">
          {children}
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

interface EmptyStateProps {
  icon?: string
  title: string
  description: string
  action?: React.ReactNode
}

export function EmptyState({ icon = '📭', title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-4xl font-mono text-[var(--color-border)] mb-4">{icon}</span>
      <h3 className="text-sm font-bold font-mono uppercase tracking-widest text-[var(--color-ink)] mb-1">{title}</h3>
      <p className="text-sm text-[var(--color-ink-muted)] mb-6 max-w-xs">{description}</p>
      {action}
    </div>
  )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────

interface ProgressBarProps {
  value: number
  max: number
  label?: string
  className?: string
}

export function ProgressBar({ value, max, label, className }: ProgressBarProps) {
  const pct = max === 0 ? 0 : Math.round((value / max) * 100)
  return (
    <div className={cn('space-y-1', className)}>
      {label && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-[var(--color-ink-muted)] font-mono">{label}</span>
          <span className="text-xs font-mono font-medium text-[var(--color-ink)]">{value}/{max}</span>
        </div>
      )}
      <div className="h-1.5 bg-[var(--color-border)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-accent)] rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}
