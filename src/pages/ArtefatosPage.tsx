import { ArtefatosTable } from '@/components/artefatos/ArtefatosTable'

export default function ArtefatosPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[var(--color-ink)] mb-1">Artefatos & Entregáveis</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Catálogo de scripts, datasets, notebooks, documentos e apresentações produzidos ao longo do TCC.
        </p>
      </div>
      <ArtefatosTable />
    </div>
  )
}
