import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Button, Input, Select, Label, Dialog, EmptyState, ArtefatoStatusBadge } from '@/components/ui'
import type { Artefato, TipoArtefato, StatusArtefato } from '@/types'
import { z } from 'zod'

const artefatoSchema = z.object({
  nome: z.string().min(2, 'Nome obrigatório'),
  tipo: z.enum(['Código/Script', 'Dataset', 'Dashboard', 'Documento', 'Apresentação', 'Modelo/Notebook']),
  status: z.enum(['Não iniciado', 'Em andamento', 'Concluído']),
  descricao: z.string().min(3, 'Descreva o artefato'),
  link: z.string().url().optional().or(z.literal('')),
})

const TIPO_EMOJI: Record<TipoArtefato, string> = {
  'Código/Script': '{}',
  'Dataset': '⊟',
  'Dashboard': '⊞',
  'Documento': '◪',
  'Apresentação': '◧',
  'Modelo/Notebook': '⊗',
}

function ArtefatoModal({ open, onClose, edit }: { open: boolean; onClose: () => void; edit?: Artefato }) {
  const { addArtefato, updateArtefato } = useApp()
  const [form, setForm] = useState({
    nome: edit?.nome ?? '',
    tipo: (edit?.tipo ?? 'Código/Script') as TipoArtefato,
    status: (edit?.status ?? 'Não iniciado') as StatusArtefato,
    descricao: edit?.descricao ?? '',
    link: edit?.link ?? '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [saving, setSaving] = useState(false)
  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const res = artefatoSchema.safeParse(form)
    if (!res.success) {
      const errs: Record<string, string> = {}
      res.error.issues.forEach(i => { errs[String(i.path[0])] = i.message })
      setErrors(errs)
      return
    }
    setSaving(true)
    const data = { ...res.data, link: res.data.link || null, etapa_id: edit?.etapa_id ?? null }
    if (edit) await updateArtefato(edit.id, data)
    else await addArtefato(data)
    setSaving(false)
    onClose()
  }

  return (
    <Dialog open={open} onClose={onClose} title={edit ? 'Editar Artefato' : 'Registrar Artefato'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label>Nome</Label>
          <Input value={form.nome} onChange={set('nome')} placeholder="Ex.: pipeline_coleta.py" />
          {errors.nome && <p className="text-xs text-[var(--color-high)] mt-1">{errors.nome}</p>}
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>Tipo</Label>
            <Select value={form.tipo} onChange={set('tipo')}>
              <option>Código/Script</option>
              <option>Dataset</option>
              <option>Dashboard</option>
              <option>Documento</option>
              <option>Apresentação</option>
              <option>Modelo/Notebook</option>
            </Select>
          </div>
          <div>
            <Label>Status</Label>
            <Select value={form.status} onChange={set('status')}>
              <option>Não iniciado</option>
              <option>Em andamento</option>
              <option>Concluído</option>
            </Select>
          </div>
        </div>
        <div>
          <Label>Descrição</Label>
          <textarea value={form.descricao} onChange={set('descricao')} rows={2}
            className="w-full px-3 py-2 text-sm border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-2 focus:ring-[var(--color-accent)] resize-none"
            placeholder="Descreva o propósito deste artefato..." />
          {errors.descricao && <p className="text-xs text-[var(--color-high)] mt-1">{errors.descricao}</p>}
        </div>
        <div>
          <Label>Link (opcional)</Label>
          <Input value={form.link} onChange={set('link')} placeholder="https://github.com/..." />
          {errors.link && <p className="text-xs text-[var(--color-high)] mt-1">{errors.link}</p>}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
          <Button type="submit" disabled={saving}>{saving ? 'Salvando...' : edit ? 'Salvar' : 'Registrar'}</Button>
        </div>
      </form>
    </Dialog>
  )
}

export function ArtefatosTable() {
  const { artefatos, deleteArtefato } = useApp()
  const [filterTipo, setFilterTipo] = useState<TipoArtefato | 'Todos'>('Todos')
  const [filterStatus, setFilterStatus] = useState<StatusArtefato | 'Todos'>('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Artefato | undefined>()

  const filtered = artefatos.filter(a => {
    const t = filterTipo === 'Todos' || a.tipo === filterTipo
    const s = filterStatus === 'Todos' || a.status === filterStatus
    return t && s
  })

  function openAdd() { setEditTarget(undefined); setModalOpen(true) }
  function openEdit(a: Artefato) { setEditTarget(a); setModalOpen(true) }

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        <Select value={filterTipo} onChange={e => setFilterTipo(e.target.value as TipoArtefato | 'Todos')} className="w-48">
          <option value="Todos">Todos os tipos</option>
          {['Código/Script', 'Dataset', 'Dashboard', 'Documento', 'Apresentação', 'Modelo/Notebook'].map(t => (
            <option key={t}>{t}</option>
          ))}
        </Select>
        <Select value={filterStatus} onChange={e => setFilterStatus(e.target.value as StatusArtefato | 'Todos')} className="w-44">
          <option value="Todos">Todos os status</option>
          <option>Não iniciado</option>
          <option>Em andamento</option>
          <option>Concluído</option>
        </Select>
        <div className="flex-1" />
        <Button onClick={openAdd}>+ Artefato</Button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="◫"
          title={artefatos.length === 0 ? 'Nenhum artefato registrado ainda' : 'Nenhum resultado'}
          description={artefatos.length === 0
            ? 'Registre scripts, datasets, notebooks e documentos conforme os produz.'
            : 'Tente ajustar os filtros.'}
          action={artefatos.length === 0 ? <Button onClick={openAdd}>+ Registrar primeiro artefato</Button> : undefined}
        />
      ) : (
        <div className="overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)]">
          <table className="w-full text-sm">
            <thead className="bg-[var(--color-bg)]">
              <tr>
                {['Artefato', 'Tipo', 'Status', 'Link', 'Ações'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide border-b border-[var(--color-border)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <motion.tr
                  key={a.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--color-border)] last:border-0 hover:bg-[var(--color-bg)] transition-colors"
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-[var(--color-ink)]">{a.nome}</p>
                    {a.descricao && <p className="text-xs text-[var(--color-ink-muted)] mt-0.5 line-clamp-1">{a.descricao}</p>}
                  </td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-2 text-[var(--color-ink-muted)]">
                      <span className="font-mono text-base">{TIPO_EMOJI[a.tipo]}</span>
                      <span className="text-xs">{a.tipo}</span>
                    </span>
                  </td>
                  <td className="px-4 py-3"><ArtefatoStatusBadge status={a.status} /></td>
                  <td className="px-4 py-3">
                    {a.link ? (
                      <a href={a.link} target="_blank" rel="noopener noreferrer"
                        className="text-xs text-[var(--color-accent)] hover:underline">↗ Abrir</a>
                    ) : <span className="text-[var(--color-ink-muted)] text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>✎</Button>
                      <Button variant="danger" size="sm" onClick={() => deleteArtefato(a.id)}>✕</Button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <ArtefatoModal open={modalOpen} onClose={() => setModalOpen(false)} edit={editTarget} />
    </div>
  )
}
