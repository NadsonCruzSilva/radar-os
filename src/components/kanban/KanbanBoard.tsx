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
import { formatDate } from '@/lib/utils'
import type { Etapa, StatusEtapa } from '@/types'

type Column = { id: StatusEtapa; label: string; emoji: string }

const COLUMNS: Column[] = [
  { id: 'Não iniciado', label: 'Não Iniciado', emoji: '○' },
  { id: 'Em andamento', label: 'Em Andamento', emoji: '◑' },
  { id: 'Concluído', label: 'Concluído', emoji: '●' },
]

// ─── Sortable Card ────────────────────────────────────────────────────────────

function EtapaCard({ etapa, isDragging }: { etapa: Etapa; isDragging?: boolean }) {
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
          {etapa.prazo && (
            <p className="mt-2 text-xs font-mono text-[var(--color-ink-muted)]">⏰ {formatDate(etapa.prazo)}</p>
          )}
        </Card>
      </motion.div>
    </div>
  )
}

// ─── Column ───────────────────────────────────────────────────────────────────

function KanbanColumn({ col, etapas }: { col: Column; etapas: Etapa[] }) {
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
      <div className="flex flex-col gap-3 min-h-[200px] p-2 rounded-[var(--radius-lg)] bg-[var(--color-bg)]">
        <SortableContext items={etapas.map(e => e.id)} strategy={verticalListSortingStrategy}>
          <AnimatePresence mode="popLayout">
            {etapas.map(etapa => (
              <EtapaCard key={etapa.id} etapa={etapa} />
            ))}
          </AnimatePresence>
          {etapas.length === 0 && (
            <div className="flex items-center justify-center h-20 text-xs text-[var(--color-ink-muted)] border-2 border-dashed border-[var(--color-border)] rounded-[var(--radius-md)]">
              Solte aqui
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

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
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
      // Optimistically update column while dragging
      updateEtapaStatus(active.id as string, targetEtapa.status)
    }
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {COLUMNS.map(col => (
          <KanbanColumn key={col.id} col={col} etapas={byStatus(col.id)} />
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
  )
}
