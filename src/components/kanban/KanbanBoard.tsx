import { useState } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { StatusBadge, Card } from '@/components/ui'
import { formatDate, cn } from '@/lib/utils'
import type { Etapa, StatusEtapa } from '@/types'

type Column = { id: StatusEtapa; label: string; emoji: string }

const COLUMNS: Column[] = [
  { id: 'Não iniciado', label: 'Não Iniciado', emoji: '○' },
  { id: 'Em andamento', label: 'Em Andamento', emoji: '◑' },
  { id: 'Concluído', label: 'Concluído', emoji: '●' },
]

// ─── Sortable Card ────────────────────────────────────────────────────────────

function EtapaCard({
  etapa,
  isDragging,
  onMoveStatus,
}: {
  etapa: Etapa
  isDragging?: boolean
  onMoveStatus: (newStatus: StatusEtapa) => void
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: etapa.id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
      >
        <Card className="p-4 cursor-grab active:cursor-grabbing hover:shadow-[var(--shadow-hover)] select-none">
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-mono text-xs text-[var(--color-ink-muted)]">Fase {etapa.ordem}</span>
            <StatusBadge status={etapa.status} />
          </div>
          <p className="text-sm font-semibold text-[var(--color-ink)] leading-snug mb-1">{etapa.nome}</p>
          <p className="text-xs text-[var(--color-ink-muted)] line-clamp-2">{etapa.descricao}</p>
          
          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[var(--color-border)]/50 gap-2">
            {etapa.prazo ? (
              <span className="text-xs font-mono text-[var(--color-ink-muted)]">⏰ {formatDate(etapa.prazo)}</span>
            ) : <span />}

            {/* Quick action button for mobile touch fallback (no-drag required) */}
            <div className="flex items-center gap-1.5" onClick={e => e.stopPropagation()}>
              {etapa.status !== 'Não iniciado' && (
                <button
                  type="button"
                  onClick={() => onMoveStatus(etapa.status === 'Concluído' ? 'Em andamento' : 'Não iniciado')}
                  className="px-2.5 py-1 min-h-[36px] text-[11px] font-mono border border-[var(--color-border)] rounded hover:bg-[var(--color-surface)] text-[var(--color-ink-muted)] active:scale-95 transition-all"
                  title="Voltar etapa anterior"
                >
                  ← Voltar
                </button>
              )}
              {etapa.status !== 'Concluído' && (
                <button
                  type="button"
                  onClick={() => onMoveStatus(etapa.status === 'Não iniciado' ? 'Em andamento' : 'Concluído')}
                  className="px-2.5 py-1 min-h-[36px] text-[11px] font-mono border border-[var(--color-ink)] bg-[var(--color-ink)] text-[var(--color-surface)] rounded hover:bg-transparent hover:text-[var(--color-ink)] active:scale-95 transition-all font-semibold"
                  title="Avançar próxima etapa"
                >
                  {etapa.status === 'Não iniciado' ? 'Iniciar →' : 'Concluir ✓'}
                </button>
              )}
            </div>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({
  col,
  etapas,
  onMoveStatus,
}: {
  col: Column
  etapas: Etapa[]
  onMoveStatus: (id: string, newStatus: StatusEtapa) => void
}) {
  return (
    <div className="flex flex-col gap-3 min-w-0">
      {/* Column Header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <span className="text-[var(--color-ink-muted)]">{col.emoji}</span>
          <h3 className="text-sm font-semibold text-[var(--color-ink)]">{col.label}</h3>
        </div>
        <span className="font-mono text-xs bg-[var(--color-border)] text-[var(--color-ink-muted)] px-2 py-0.5 rounded-full">
          {etapas.length}
        </span>
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-3 min-h-[160px] p-2.5 rounded-[var(--radius-lg)] bg-[var(--color-bg)] border border-[var(--color-border)]/40">
        <SortableContext items={etapas.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {etapas.map(etapa => (
              <EtapaCard
                key={etapa.id}
                etapa={etapa}
                onMoveStatus={(newStatus) => onMoveStatus(etapa.id, newStatus)}
              />
            ))}
          </AnimatePresence>
          {etapas.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-[var(--color-ink-muted)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
              Nenhuma etapa aqui
            </div>
          )}
        </SortableContext>
      </div>
    </div>
  )
}

// ─── Kanban Board ─────────────────────────────────────────────────────────────

export function KanbanBoard() {
  const { etapas, updateEtapaStatus } = useApp()
  const [activeId, setActiveId] = useState<string | null>(null)
  const [mobileTab, setMobileTab] = useState<StatusEtapa | 'Todas'>('Todas')

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const byStatus = (status: StatusEtapa) =>
    etapas.filter(e => e.status === status).sort((a, b) => a.ordem - b.ordem)

  const activeEtapa = etapas.find(e => e.id === activeId)

  function handleDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string)
  }

  function handleDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null)
    if (!over) return

    // Dropped over a column id (status)
    const targetStatus = COLUMNS.find(c => c.id === over.id)?.id
    if (targetStatus) {
      updateEtapaStatus(active.id as string, targetStatus)
      return
    }

    // Dropped over another card — find its column
    const targetEtapa = etapas.find(e => e.id === over.id)
    if (targetEtapa && targetEtapa.status !== activeEtapa?.status) {
      updateEtapaStatus(active.id as string, targetEtapa.status)
    }
  }

  function handleDragOver({ active, over }: DragOverEvent) {
    if (!over) return
    const targetEtapa = etapas.find(e => e.id === over.id)
    const sourceEtapa = etapas.find(e => e.id === active.id)
    if (targetEtapa && sourceEtapa && targetEtapa.status !== sourceEtapa.status) {
      updateEtapaStatus(active.id as string, targetEtapa.status)
    }
  }

  const columnsToRender = mobileTab === 'Todas'
    ? COLUMNS
    : COLUMNS.filter(c => c.id === mobileTab)

  return (
    <div className="space-y-4">
      {/* Mobile Column Switcher (Visible on small screens) */}
      <div className="flex md:hidden overflow-x-auto pb-1 gap-1.5 scrollbar-hide">
        <button
          onClick={() => setMobileTab('Todas')}
          className={cn(
            'px-3 py-2 min-h-[44px] text-xs font-mono rounded-full border whitespace-nowrap transition-colors flex items-center gap-1.5',
            mobileTab === 'Todas'
              ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)] font-bold'
              : 'border-[var(--color-border)] text-[var(--color-ink)] bg-[var(--color-surface)]'
          )}
        >
          Todas ({etapas.length})
        </button>
        {COLUMNS.map(col => {
          const count = byStatus(col.id).length
          const active = mobileTab === col.id
          return (
            <button
              key={col.id}
              onClick={() => setMobileTab(col.id)}
              className={cn(
                'px-3 py-2 min-h-[44px] text-xs font-mono rounded-full border whitespace-nowrap transition-colors flex items-center gap-1.5',
                active
                  ? 'bg-[var(--color-ink)] text-[var(--color-surface)] border-[var(--color-ink)] font-bold'
                  : 'border-[var(--color-border)] text-[var(--color-ink)] bg-[var(--color-surface)]'
              )}
            >
              <span>{col.emoji}</span>
              <span>{col.label}</span>
              <span className="opacity-75">({count})</span>
            </button>
          )
        })}
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {columnsToRender.map(col => (
            <KanbanColumn
              key={col.id}
              col={col}
              etapas={byStatus(col.id)}
              onMoveStatus={updateEtapaStatus}
            />
          ))}
        </div>

        <DragOverlay>
          {activeEtapa && (
            <Card className="p-4 rotate-2 shadow-[var(--shadow-hover)] opacity-90">
              <p className="text-sm font-semibold text-[var(--color-ink)]">{activeEtapa.nome}</p>
            </Card>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  )
}
