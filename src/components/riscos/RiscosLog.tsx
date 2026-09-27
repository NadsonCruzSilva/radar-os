import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Button, Card, EmptyState, ImpactoBadge, TipoRiscoBadge, Label, Input, Select, Dialog } from '@/components/ui'
import { formatDate } from '@/lib/utils'
import type { DecisaoRisco } from '@/types'
import { z } from 'zod'

const decisaoSchema = z.object({
  titulo: z.string().min(3),
  tipo: z.enum(['Decisão', 'Risco', 'Limitação']),
  data: z.string().min(1, 'Data obrigatória'),
  impacto: z.enum(['Alto', 'Médio', 'Baixo']),
  descricao: z.string().min(5, 'Descrição obrigatória'),
  mitigacao: z.string().min(3, 'Descreva a mitigação ou observação'),
})

function AddDecisaoModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { addDecisao } = useApp()
  const today = new Date().toISOString().split('T')[0]
  const [form, setForm] = useState({ titulo: '', tipo: 'Risco', data: today, impacto: 'Médio', descricao: '', mitigacao: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = decisaoSchema.safeParse(form)
    if (!result.success) {
      const errs: Record<string, string> = {}
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message })
      setErrors(errs)
      return
    }
    setSaving(true)
    await addDecisao({ ...result.data, etapa_id: null })
    setSaving(false)
    onClose()
    setForm({ titulo: '', tipo: 'Risco', data: today, impacto: 'Médio', descricao: '', mitigacao: '' })
  }

  return (
    <Dialog open={open} onClose={onClose} title="Registrar Decisão / Risco" size="lg">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Título</Label>
          <Input value={form.titulo} onChange={set('titulo')} placeholder="Ex.: Dependência da qualidade dos dados" />
          {errors.titulo && <p className="text-xs text-[var(--color-high)] mt-1">{errors.titulo}</p>}
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div>
            <Label>Tipo</Label>
            <Select value={form.tipo} onChange={set('tipo')}>
              <option>Risco</option>
              <option>Decisão</option>
              <option>Limitação</option>
            </Select>
          </div>
          <div>
            <Label>Impacto</Label>
            <Select value={form.impacto} onChange={set('impacto')}>
              <option>Alto</option>
              <option>Médio</option>
              <option>Baixo</option>
            </Select>
          </div>
          <div>
            <Label>Data</Label>
            <Input type="date" value={form.data} onChange={set('data')} />
            {errors.data && <p className="text-xs text-[var(--color-high)] mt-1">{errors.data}</p>}
          </div>
        </div>
        <div>
          <Label>Descrição</Label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={3}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
            placeholder="Descreva o risco, decisão ou limitação..." />
          {errors.descricao && <p className="text-xs text-[var(--color-high)] mt-1">{errors.descricao}</p>}
        </div>
        <div>
          <Label>Mitigação / Observação</Label>
          <textarea value={form.mitigacao} onChange={set('mitigacao')} rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
            placeholder="Como mitigar ou o que foi decidido..." />
          {errors.mitigacao && <p className="text-xs text-[var(--color-high)] mt-1">{errors.mitigacao}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : 'Registrar'}</Button>
        </div>
      </form>
    </Dialog>
  )
}

function RiscoCard({ d, onDelete }: { d: DecisaoRisco; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div className="flex items-center gap-2 flex-wrap">
          <TipoRiscoBadge tipo={d.tipo} />
          <ImpactoBadge impacto={d.impacto} />
          <span className="font-mono text-xs text-[var(--color-ink-muted)]">{formatDate(d.data)}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={onDelete} className="shrink-0 text-[var(--color-ink-muted)] hover:text-[var(--color-high)]">✕</Button>
      </div>

      <h3 className="font-semibold text-[var(--color-ink)] mb-2">{d.titulo}</h3>

      <p className={`text-sm text-[var(--color-ink-muted)] leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
        {d.descricao}
      </p>

      {d.mitigacao && (
        <div className="mt-3 pt-3 border-t border-[var(--color-border)]">
          <p className="text-xs font-mono text-[var(--color-ink-muted)] mb-1 uppercase tracking-wide">Mitigação</p>
          <p className={`text-sm text-[var(--color-ink)] leading-relaxed ${expanded ? '' : 'line-clamp-2'}`}>
            {d.mitigacao}
          </p>
        </div>
      )}

      <button
        onClick={() => setExpanded(e => !e)}
        className="mt-3 text-xs text-[var(--color-accent)] hover:underline cursor-pointer"
      >
        {expanded ? '↑ Menos' : '↓ Ver mais'}
      </button>
    </Card>
  )
}

export function RiscosLog() {
  const { decisoes, deleteDecisao } = useApp()
  const [modalOpen, setModalOpen] = useState(false)
  const sorted = [...decisoes].sort((a, b) => b.data.localeCompare(a.data))

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-[var(--color-ink-muted)]">{decisoes.length} entradas · mais recentes primeiro</p>
        <Button onClick={() => setModalOpen(true)}>+ Registrar</Button>
      </div>

      {sorted.length === 0 ? (
        <EmptyState
          icon="◬"
          title="Nenhum registro ainda"
          description="Adicione decisões metodológicas, riscos identificados e limitações do projeto."
          action={<Button onClick={() => setModalOpen(true)}>+ Registrar primeiro item</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {sorted.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <RiscoCard d={d} onDelete={() => deleteDecisao(d.id)} />
            </motion.div>
          ))}
        </div>
      )}

      <AddDecisaoModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </div>
  )
}
