import { RiscosLog } from '@/components/riscos/RiscosLog'

export default function RiscosPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8">
      <div className="mb-6">
        <h1 className="font-display text-2xl text-[var(--color-ink)] mb-1">Decisões & Riscos</h1>
        <p className="text-sm text-[var(--color-ink-muted)]">
          Registro cronológico de decisões metodológicas, riscos identificados e limitações conhecidas do projeto.
        </p>
      </div>
      <RiscosLog />
    </div>
  )
}
