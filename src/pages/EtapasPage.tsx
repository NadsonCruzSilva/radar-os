import { KanbanBoard } from '@/components/kanban/KanbanBoard'

export default function EtapasPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[var(--color-ink)] mb-1">Etapas Metodológicas</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Arraste os cartões entre as colunas para atualizar o status de cada fase do ciclo DSR.
        </p>
      </div>
      <KanbanBoard />
    </div>
  )
}
