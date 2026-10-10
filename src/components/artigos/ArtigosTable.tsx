import { useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/context/AppContext'
import { Button, Input, Select, Label, Dialog, EmptyState, LeituraBadge, Card } from '@/components/ui'
import type { Artigo, StatusLeitura } from '@/types'
import { z } from 'zod'

const artigoSchema = z.object({
  titulo: z.string().min(3, 'Título obrigatório'),
  autores: z.string().min(2, 'Autores obrigatórios'),
  ano: z.coerce.number().min(1990).max(2030),
  temas: z.string().min(1, 'Informe ao menos um tema'),
  status_leitura: z.enum(['A ler', 'Lendo', 'Lido', 'Citado no texto']),
  link: z.string().url().optional().or(z.literal('')),
  notas: z.string().optional(),
  contribuicao: z.string().optional(),
  uso_sugerido: z.string().optional(),
})

const TEMAS_SUGERIDOS = [
  'Isolation Forest', 'XAI', 'Dados abertos', 'Transparência pública',
  'Anomaly Detection', 'Design Science', 'NLP', 'LLM', 'Dashboard',
  'Orçamento público', 'Controle social',
]

interface FormErrors { [k: string]: string }

function ArtigoFormModal({
  open, onClose, editArtigo
}: {
  open: boolean
  onClose: () => void
  editArtigo?: Artigo
}) {
  const { addArtigo, updateArtigo } = useApp()
  const [form, setForm] = useState({
    titulo: editArtigo?.titulo ?? '',
    autores: editArtigo?.autores ?? '',
    ano: String(editArtigo?.ano ?? new Date().getFullYear()),
    temas: editArtigo?.temas.join(', ') ?? '',
    status_leitura: (editArtigo?.status_leitura ?? 'A ler') as StatusLeitura,
    link: editArtigo?.link ?? '',
    notas: editArtigo?.notas ?? '',
    contribuicao: editArtigo?.contribuicao ?? '',
    uso_sugerido: editArtigo?.uso_sugerido ?? '',
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [saving, setSaving] = useState(false)

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const result = artigoSchema.safeParse(form)
    if (!result.success) {
      const errs: FormErrors = {}
      result.error.issues.forEach(i => { errs[String(i.path[0])] = i.message })
      setErrors(errs)
      return
    }
    setErrors({})
    setSaving(true)
    const data = {
      ...result.data,
      temas: result.data.temas.split(',').map(t => t.trim()).filter(Boolean),
      link: result.data.link || null,
      notas: form.notas || null,
      contribuicao: form.contribuicao || null,
      uso_sugerido: form.uso_sugerido || null,
      etapa_id: editArtigo?.etapa_id ?? null,
    }
    if (editArtigo) {
      await updateArtigo(editArtigo.id, data)
    } else {
      await addArtigo(data)
    }
    setSaving(false)
    onClose()
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={editArtigo ? 'Editar Artigo' : 'Adicionar Artigo'}
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="titulo">Título</Label>
          <Input id="titulo" value={form.titulo} onChange={set('titulo')} placeholder="Ex.: Isolation Forest: 100 Trees..." />
          {errors.titulo && <p className="text-xs text-[var(--color-high)] mt-1">{errors.titulo}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="autores">Autores</Label>
            <Input id="autores" value={form.autores} onChange={set('autores')} placeholder="Liu, Ting e Zhou" />
            {errors.autores && <p className="text-xs text-[var(--color-high)] mt-1">{errors.autores}</p>}
          </div>
          <div>
            <Label htmlFor="ano">Ano</Label>
            <Input id="ano" type="number" value={form.ano} onChange={set('ano')} min="1990" max="2030" />
            {errors.ano && <p className="text-xs text-[var(--color-high)] mt-1">{errors.ano}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="temas">Temas (separados por vírgula)</Label>
          <Input id="temas" value={form.temas} onChange={set('temas')} placeholder="Isolation Forest, Dados abertos" />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {TEMAS_SUGERIDOS.map(t => (
              <button
                key={t}
                type="button"
                onClick={() => setForm(f => ({
                  ...f,
                  temas: f.temas ? `${f.temas}, ${t}` : t
                }))}
                className="text-xs px-2.5 py-1 min-h-[32px] rounded-full border border-[var(--color-border)] text-[var(--color-ink-muted)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
              >
                + {t}
              </button>
            ))}
          </div>
          {errors.temas && <p className="text-xs text-[var(--color-high)] mt-1">{errors.temas}</p>}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="status_leitura">Status de Leitura</Label>
            <Select id="status_leitura" value={form.status_leitura} onChange={set('status_leitura')}>
              <option>A ler</option>
              <option>Lendo</option>
              <option>Lido</option>
              <option>Citado no texto</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="link">Link (opcional)</Label>
            <Input id="link" value={form.link} onChange={set('link')} placeholder="https://doi.org/..." />
            {errors.link && <p className="text-xs text-[var(--color-high)] mt-1">{errors.link}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="notas">Notas (opcional)</Label>
          <textarea
            id="notas"
            value={form.notas}
            onChange={set('notas')}
            rows={2}
            placeholder="Anotações sobre relevância, citações-chave..."
            className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-1 focus:ring-[var(--color-ink)] resize-none"
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contribuicao">Contribuição aproveitável</Label>
            <textarea
              id="contribuicao"
              value={form.contribuicao}
              onChange={set('contribuicao')}
              rows={2}
              placeholder="O que de útil este artigo traz?"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-1 focus:ring-[var(--color-ink)] resize-none"
            />
          </div>
          <div>
            <Label htmlFor="uso_sugerido">Uso sugerido no TCC</Label>
            <textarea
              id="uso_sugerido"
              value={form.uso_sugerido}
              onChange={set('uso_sugerido')}
              rows={2}
              placeholder="Como usar na sua pesquisa?"
              className="w-full px-3.5 py-2.5 text-base sm:text-sm bg-[var(--color-surface)] border border-[var(--color-border)] rounded-[var(--radius-md)] outline-none focus:ring-1 focus:ring-[var(--color-ink)] resize-none"
            />
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-2.5 sm:gap-3 pt-3 border-t border-[var(--color-border)]">
          <Button type="button" variant="outline" onClick={onClose} className="w-full sm:w-auto">Cancelar</Button>
          <Button type="submit" disabled={saving} className="w-full sm:w-auto">
            {saving ? 'Salvando...' : editArtigo ? 'Salvar alterações' : 'Adicionar artigo'}
          </Button>
        </div>
      </form>
    </Dialog>
  )
}

// ─── Articles Table ───────────────────────────────────────────────────────────

export function ArtigosTable() {
  const { artigos, deleteArtigo } = useApp()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<StatusLeitura | 'Todos'>('Todos')
  const [filterTema, setFilterTema] = useState('Todos')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<Artigo | undefined>()

  const allTemas = [...new Set(artigos.flatMap(a => a.temas))].sort()

  const filtered = artigos.filter(a => {
    const matchSearch = !search ||
      a.titulo.toLowerCase().includes(search.toLowerCase()) ||
      a.autores.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Todos' || a.status_leitura === filterStatus
    const matchTema = filterTema === 'Todos' || a.temas.includes(filterTema)
    return matchSearch && matchStatus && matchTema
  })

  function openAdd() { setEditTarget(undefined); setModalOpen(true) }
  function openEdit(a: Artigo) { setEditTarget(a); setModalOpen(true) }

  return (
    <div className="space-y-4">
      {/* Responsive Toolbar */}
      <div className="flex flex-col sm:flex-row gap-2.5 sm:gap-3">
        <Input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Buscar por título ou autor..."
          className="flex-1"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:flex gap-2.5 sm:gap-3">
          <Select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value as StatusLeitura | 'Todos')}
            className="w-full sm:w-44"
          >
            <option value="Todos">Todos os status</option>
            <option>A ler</option>
            <option>Lendo</option>
            <option>Lido</option>
            <option>Citado no texto</option>
          </Select>
          <Select
            value={filterTema}
            onChange={e => setFilterTema(e.target.value)}
            className="w-full sm:w-44"
          >
            <option value="Todos">Todos os temas</option>
            {allTemas.map(t => <option key={t}>{t}</option>)}
          </Select>
        </div>
        <Button onClick={openAdd} size="md" className="w-full sm:w-auto shrink-0">+ Artigo</Button>
      </div>

      {/* Empty State */}
      {filtered.length === 0 ? (
        <EmptyState
          icon="📚"
          title={artigos.length === 0 ? 'Nenhum artigo cadastrado ainda' : 'Nenhum resultado'}
          description={artigos.length === 0
            ? 'Adicione o primeiro artigo da sua revisão bibliográfica.'
            : 'Tente ajustar os filtros de busca.'}
          action={artigos.length === 0 ? <Button onClick={openAdd}>+ Adicionar primeiro artigo</Button> : undefined}
        />
      ) : (
        <>
          {/* MOBILE VIEW: Card Feed (< md) */}
          <div className="flex flex-col gap-3.5 md:hidden">
            {filtered.map((a, i) => (
              <motion.div
                key={a.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.02 }}
              >
                <Card className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <LeituraBadge status={a.status_leitura} />
                    <span className="font-mono text-xs text-[var(--color-ink-muted)]">{a.ano}</span>
                  </div>

                  <div>
                    <h3 className="font-semibold text-base text-[var(--color-ink)] leading-snug">
                      {a.titulo}
                    </h3>
                    <p className="text-xs text-[var(--color-ink-muted)] mt-1 font-mono">{a.autores}</p>
                    {a.link && (
                      <a
                        href={a.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-xs text-[var(--color-accent)] hover:underline font-mono"
                      >
                        ↗ Ver link da publicação
                      </a>
                    )}
                  </div>

                  {/* Temas tags */}
                  {a.temas.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {a.temas.map(t => (
                        <span key={t} className="text-[10px] bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-ink-muted)] px-2 py-0.5 rounded-full font-mono">
                          {t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Details / Contribution */}
                  {(a.contribuicao || a.uso_sugerido) && (
                    <div className="pt-2 border-t border-[var(--color-border)]/50 space-y-1.5 text-xs">
                      {a.contribuicao && (
                        <div>
                          <strong className="text-[var(--color-ink-muted)] font-mono text-[11px] block">Contribuição:</strong>
                          <p className="text-[var(--color-ink)] leading-relaxed">{a.contribuicao}</p>
                        </div>
                      )}
                      {a.uso_sugerido && (
                        <div>
                          <strong className="text-[var(--color-ink-muted)] font-mono text-[11px] block">Uso no TCC:</strong>
                          <p className="text-[var(--color-ink)] leading-relaxed">{a.uso_sugerido}</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Mobile Actions with >= 44px touch targets */}
                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-[var(--color-border)]">
                    <button
                      type="button"
                      onClick={() => openEdit(a)}
                      className="flex-1 sm:flex-none px-4 py-2 min-h-[44px] text-xs font-mono font-semibold border border-[var(--color-border)] rounded-[var(--radius-md)] text-[var(--color-ink)] hover:bg-[var(--color-bg)] active:scale-95 transition-all text-center"
                    >
                      ✎ Editar
                    </button>
                    <button
                      type="button"
                      onClick={() => deleteArtigo(a.id)}
                      className="px-4 py-2 min-h-[44px] text-xs font-mono font-semibold border border-[var(--color-high)] rounded-[var(--radius-md)] text-[var(--color-high)] hover:bg-[var(--color-high)] hover:text-white active:scale-95 transition-all"
                    >
                      ✕ Excluir
                    </button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* DESKTOP VIEW: Table (>= md) */}
          <div className="hidden md:block overflow-x-auto rounded-[var(--radius-lg)] border border-[var(--color-border)] bg-[var(--color-surface)]">
            <table className="w-full text-sm">
              <thead className="bg-[var(--color-bg)]">
                <tr>
                  {['Título', 'Autores / Ano', 'Temas / Status', 'Contribuição / Uso', 'Ações'].map(h => (
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
                      <div className="font-medium text-[var(--color-ink)] max-w-xs truncate">{a.titulo}</div>
                      {a.link && (
                        <a href={a.link} target="_blank" rel="noopener noreferrer"
                          className="text-xs text-[var(--color-accent)] hover:underline">↗ Ver fonte</a>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-[var(--color-ink-muted)] max-w-[180px] truncate" title={a.autores}>{a.autores}</div>
                      <div className="font-mono text-xs text-[var(--color-ink-muted)] mt-1">{a.ano}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1 mb-2">
                        {a.temas.slice(0, 2).map(t => (
                          <span key={t} className="text-[10px] bg-[var(--color-border)] text-[var(--color-ink-muted)] px-1.5 py-0.5 rounded-full">{t}</span>
                        ))}
                        {a.temas.length > 2 && (
                          <span className="text-[10px] text-[var(--color-ink-muted)]">+{a.temas.length - 2}</span>
                        )}
                      </div>
                      <LeituraBadge status={a.status_leitura} />
                    </td>
                    <td className="px-4 py-3 min-w-[200px]">
                      {a.contribuicao && (
                        <div className="text-xs text-[var(--color-ink)] mb-1 line-clamp-2" title={a.contribuicao}>
                          <strong className="text-[var(--color-ink-muted)] font-mono">Contribuição: </strong>
                          {a.contribuicao}
                        </div>
                      )}
                      {a.uso_sugerido && (
                        <div className="text-xs text-[var(--color-ink)] line-clamp-2" title={a.uso_sugerido}>
                          <strong className="text-[var(--color-ink-muted)] font-mono">Uso: </strong>
                          {a.uso_sugerido}
                        </div>
                      )}
                      {!a.contribuicao && !a.uso_sugerido && (
                        <span className="text-xs italic text-[var(--color-ink-muted)]">Sem registro</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" onClick={() => openEdit(a)}>✎</Button>
                        <Button variant="danger" size="sm" onClick={() => deleteArtigo(a.id)}>✕</Button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

      <ArtigoFormModal open={modalOpen} onClose={() => setModalOpen(false)} editArtigo={editTarget} />
    </div>
  )
}
