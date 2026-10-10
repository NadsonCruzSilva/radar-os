import { EscopoChecklist } from '@/components/escopo/EscopoChecklist'
import { useApp } from '@/context/AppContext'
import { ProgressBar } from '@/components/ui'

export default function EscopoPage() {
  const { itensEscopo } = useApp()
  const core = itensEscopo.filter(i => i.tipo === 'Núcleo (MVP)')
  const coreDone = core.filter(i => i.status === 'Concluído').length

  return (
    <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="font-display text-xl sm:text-2xl text-[var(--color-ink)] mb-1">Checklist de Escopo</h1>
            <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
              Marque os itens conforme avança. O núcleo MVP deve ser concluído antes de considerar as extensões.
            </p>
          </div>
          <div className="w-full sm:w-64 pt-1 sm:pt-0">
            <ProgressBar value={coreDone} max={core.length} label="Progresso do MVP" />
          </div>
        </div>
      </div>
      <EscopoChecklist />
    </div>
  )
}
