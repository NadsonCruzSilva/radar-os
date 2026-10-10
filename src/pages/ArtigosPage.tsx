import { ArtigosTable } from '@/components/artigos/ArtigosTable'

export default function ArtigosPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
      <div className="mb-5 sm:mb-6">
        <h1 className="font-display text-xl sm:text-2xl text-[var(--color-ink)] mb-1">Artigos & Referências</h1>
        <p className="text-xs sm:text-sm text-[var(--color-ink-muted)]">
          Gerencie sua revisão bibliográfica — busque, filtre por tema ou status de leitura, e adicione novas referências.
        </p>
      </div>
      <ArtigosTable />
    </div>
  )
}
