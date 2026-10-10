import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export default function EtapasPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-display text-xl sm:text-2xl text-[var(--color-ink)] mb-1">Etapas Metodológicas</h1>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
          Arraste os cartões ou utilize os botões de ação para atualizar o status de cada fase do ciclo DSR.
        </p>
      </div>
      <KanbanBoard />
    </div>
  )
}
