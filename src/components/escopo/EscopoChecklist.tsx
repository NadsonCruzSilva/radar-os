import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { ProgressBar, Card } from '@/components/ui'
import type { ItemEscopo, TipoEscopo } from '@/types'

function ScopeItem({ item, onToggle }: { item: ItemEscopo; onToggle: () => void }) {
  const done = item.status === 'Concluído'
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
      className="flex items-start gap-3 p-3 rounded-[var(--radius-md)] hover:bg-[var(--color-bg)] transition-colors group"
    >
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`mt-0.5 w-5 h-5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all cursor-pointer ${done
          ? 'bg-[var(--color-done)] border-[var(--color-done)] text-white'
          : 'border-[var(--color-border)] hover:border-[var(--color-accent)]'
          }`}
        aria-label={done ? 'Marcar como não iniciado' : 'Marcar como concluído'}
      >
        {done && <span className="text-xs leading-none">✓</span>}
      </button>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={`text-sm font-medium leading-snug transition-colors ${done ? 'line-through text-[var(--color-ink-muted)]' : 'text-[var(--color-ink)]'}`}>
          {item.item}
        </p>
        {item.descricao && (
          <p className="text-xs text-[var(--color-ink-muted)] mt-0.5 line-clamp-2 group-hover:line-clamp-none transition-all">
            {item.descricao}
          </p>
        )}
      </div>

      {/* Priority dot */}
      <span className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${item.prioridade === 'Alta' ? 'bg-[var(--color-high)]' :
        item.prioridade === 'Média' ? 'bg-[var(--color-mid)]' : 'bg-[var(--color-low)]'
        }`} title={`Prioridade: ${item.prioridade}`} />
    </motion.div>
  )
}

function ScopeColumn({ tipo, items }: { tipo: TipoEscopo; items: ItemEscopo[] }) {
  const { toggleItemEscopo } = useApp()
  const done = items.filter(i => i.status === 'Concluído').length
  const isCore = tipo === 'Núcleo (MVP)'

  return (
    <Card className="p-6">
      {/* Column header */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-lg text-[var(--color-ink)]">
            {isCore ? '◎ Núcleo MVP' : '◫ Extensões Opcionais'}
          </h3>
          <span className="font-mono text-sm font-semibold text-[var(--color-ink)]">{done}/{items.length}</span>
        </div>
        <ProgressBar value={done} max={items.length} />
      </div>

      {/* Items */}
      <div className="divide-y divide-[var(--color-border)]">
        {items.map(item => (
          <ScopeItem
            key={item.id}
            item={item}
            onToggle={() => toggleItemEscopo(item.id)}
          />
        ))}
      </div>
    </Card>
  )
}

export function EscopoChecklist() {
  const { itensEscopo } = useApp()
  const core = itensEscopo.filter(i => i.tipo === 'Núcleo (MVP)')
  const ext = itensEscopo.filter(i => i.tipo === 'Extensão opcional')

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ScopeColumn tipo="Núcleo (MVP)" items={core} />
      <ScopeColumn tipo="Extensão opcional" items={ext} />
    </div>
  )
}
