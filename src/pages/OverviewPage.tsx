import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, ProgressBar, StatusBadge, ImpactoBadge, TipoRiscoBadge, LeituraBadge } from '@/components/ui'

const container = { hidden: {}, visible: { transition: { staggerChildren: 0.07 } } }
const item = { hidden: { opacity: 0, y: 16 }, visible: { opacity: 1, y: 0, transition: { duration: 0.3 } } }

// ─── Project Identity Card ────────────────────────────────────────────────────

const MVP_ITEMS = [
  'Pipeline de coleta e limpeza (CSV/API pública)',
  'Engenharia de atributos derivados (valor, frequência, desvio da mediana...)',
  'Detecção com Isolation Forest (scikit-learn, CPU)',
  'Ranking: escore_normalizado × log1p(valor_absoluto)',
  'Ficha explicativa em português (template determinístico)',
  'Dashboard de alertas com filtros e detalhe do registro',
  'Estudo de caso + avaliação qualitativa',
]

const STACK_TCC = [
  { label: 'Python', tag: 'Pipeline' },
  { label: 'pandas / polars', tag: 'Dados' },
  { label: 'scikit-learn', tag: 'Isolation Forest' },
  { label: 'Streamlit ou Dash', tag: 'Dashboard' },
  { label: 'SHAP / LIME', tag: 'XAI (opcional)' },
  { label: 'LLM open-source', tag: 'Explicação (opcional)' },
]

const DSR_PHASES = [
  { n: '1', label: 'Problema' },
  { n: '2', label: 'Objetivos' },
  { n: '3', label: 'Projeto & Desenvolvimento' },
  { n: '4', label: 'Demonstração' },
  { n: '5', label: 'Avaliação' },
  { n: '6', label: 'Comunicação' },
]

function ProjectCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.28 }}
    >
      <Card className="overflow-hidden">
        {/* Header strip */}
        <div className="bg-[var(--color-ink)] px-6 py-4 flex items-start justify-between gap-4">
          <div>
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest mb-1">TCC · Sistemas de Informação · IFES Cachoeiro · 2026</p>
            <h2
              className="text-white text-xl leading-snug"
              style={{ fontFamily: 'var(--font-display)', letterSpacing: '0.04em' }}
            >
              Radar Inteligente de Padrões Atípicos<br />
              em Despesas Públicas
            </h2>
          </div>
          <span className="shrink-0 font-mono text-xs px-2 py-1 rounded bg-[var(--color-accent)] text-white">DSR</span>
        </div>

        {/* Body */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Problema + Pergunta de Pesquisa */}
          <div className="lg:col-span-1 space-y-4">
            <div>
              <p className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-2">Problema</p>
              <p className="text-base text-[var(--color-ink)] leading-relaxed">
                Portais de transparência publicam milhares de empenhos, mas não oferecem apoio para distinguir
                rotina orçamentária de registros <em>atípicos</em>. Anomalia estatística ≠ irregularidade;
                o sistema gera <strong>suspeita analítica auditável</strong>, não tipificação de ilícito.
              </p>
            </div>
            <div className="p-4 rounded-[var(--radius-md)] bg-[var(--color-accent-dim)] border-l-2 border-[var(--color-ink)]">
              <p className="font-mono text-xs text-[var(--color-ink)] mb-2 uppercase tracking-wide">Pergunta de Pesquisa</p>
              <p className="text-sm text-[var(--color-ink)] leading-relaxed italic">
                "Como um sistema baseado em dados abertos e detecção não supervisionada pode identificar,
                ranquear e explicar despesas públicas atípicas de forma auditável?"
              </p>
            </div>
            <div>
              <p className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-2">Recorte Empírico</p>
              <p className="text-base text-[var(--color-ink)] font-mono text-sm">
                <span className="text-[var(--color-ink-muted)]">[PRI]</span> <strong>SIGEFES / Portal ES</strong> — 1 órgão, 1 exercício (2024/2025)<br />
                <span className="text-[var(--color-ink-muted)] mt-1 inline-block">[SEC]</span> <em>Fallback:</em> API Portal Transparência Federal
              </p>
            </div>
          </div>

          {/* MVP scope */}
          <div className="lg:col-span-1">
            <p className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-3">Núcleo MVP</p>
            <ul className="space-y-3">
              {MVP_ITEMS.map((m, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-[var(--color-ink)]">
                  <span className="mt-0.5 w-5 h-5 rounded-full border border-[var(--color-border)] text-[var(--color-ink)] text-[10px] font-mono font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-relaxed">{m}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Stack TCC + DSR */}
          <div className="lg:col-span-1 space-y-5">
            <div>
              <p className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-3">Stack do TCC</p>
              <div className="flex flex-wrap gap-2">
                {STACK_TCC.map(s => (
                  <div key={s.label} className="flex flex-col items-start px-3 py-2 rounded-[var(--radius-md)] bg-[var(--color-bg)] border border-[var(--color-border)]">
                    <span className="text-sm font-mono font-semibold text-[var(--color-ink)]">{s.label}</span>
                    <span className="text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)] mt-0.5">{s.tag}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <p className="font-mono text-xs text-[var(--color-ink-muted)] uppercase tracking-wide mb-3">Ciclo DSR</p>
              <div className="flex items-center gap-0">
                {DSR_PHASES.map((p, i) => (
                  <div key={p.n} className="flex items-center">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full border border-[var(--color-ink)] text-[var(--color-ink)] text-xs font-mono font-bold flex items-center justify-center mb-1">
                        {p.n}
                      </div>
                      <span className="text-[10px] uppercase tracking-wide text-[var(--color-ink-muted)] text-center max-w-[54px] leading-tight">{p.label}</span>
                    </div>
                    {i < DSR_PHASES.length - 1 && (
                      <div className="w-4 h-px bg-[var(--color-border)] mb-3" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 rounded-[var(--radius-md)] border border-[var(--color-border)] text-sm text-[var(--color-ink-muted)] leading-relaxed mt-4">
              <strong className="text-[var(--color-ink)] font-medium">Avaliação:</strong> estudo de caso único com inspeção
              humana estruturada de alertas. Sem usuários externos, sem GPU, sem dados pessoais sensíveis.
            </div>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}


export default function OverviewPage() {
  const { etapas, artigos, itensEscopo, decisoes } = useApp()

  // KPI calculations
  const etapasDone = etapas.filter(e => e.status === 'Concluído').length
  const etapasProgress = etapas.filter(e => e.status === 'Em andamento').length
  const mvpItems = itensEscopo.filter(i => i.tipo === 'Núcleo (MVP)')
  const mvpDone = mvpItems.filter(i => i.status === 'Concluído').length
  const artigosLidos = artigos.filter(a => a.status_leitura === 'Lido' || a.status_leitura === 'Citado no texto').length
  const riscosAltos = decisoes.filter(d => d.tipo === 'Risco' && d.impacto === 'Alto').length
  const riscosAbertos = decisoes.filter(d => d.tipo === 'Risco').length

  const recentArtigos = artigos.slice(0, 3)
  const recentRiscos = decisoes.slice(0, 3)

  return (
    <div className="max-w-[1400px] mx-auto px-6 py-8 space-y-8">

      {/* Hero KPIs */}
      <motion.div variants={container} initial="hidden" animate="visible"
        className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Etapas Concluídas', value: `${etapasDone}/7`, sub: `${etapasProgress} em andamento`, icon: '✓', accent: false },
          { label: 'Progresso MVP', value: `${mvpDone}/${mvpItems.length}`, sub: `${Math.round((mvpDone / Math.max(mvpItems.length, 1)) * 100)}% completo`, icon: '◎', accent: true },
          { label: 'Artigos Lidos', value: String(artigosLidos), sub: `de ${artigos.length} cadastrados`, icon: '◉', accent: false },
          { label: 'Riscos Altos Abertos', value: String(riscosAltos), sub: `${riscosAbertos} riscos no total`, icon: '◬', accent: riscosAltos === 0, danger: riscosAltos > 0 },
        ].map(kpi => (
          <motion.div key={kpi.label} variants={item}>
            <Card className="p-5">
              <div className="flex items-start justify-between mb-3">
                <span className="text-2xl leading-none">{kpi.icon}</span>
                {kpi.accent && !kpi.danger && (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-1" />
                )}
                {kpi.danger && (
                  <span className="w-2 h-2 rounded-full bg-[var(--color-high)] mt-1 animate-pulse" />
                )}
              </div>
              <p className="font-display text-4xl text-[var(--color-ink)] leading-none mb-2 mt-1">
                {kpi.value}
              </p>
              <p className="text-sm font-semibold text-[var(--color-ink)] mb-0.5">{kpi.label}</p>
              <p className="text-xs text-[var(--color-ink-muted)]">{kpi.sub}</p>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Project Identity Card */}
      <ProjectCard />

      {/* Progress bars */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <Card className="p-6">
          <h2 className="font-display text-base text-[var(--color-ink)] mb-4">Progresso Geral</h2>
          <div className="space-y-4">
            <ProgressBar value={etapasDone} max={7} label="Etapas do TCC" />
            <ProgressBar value={mvpDone} max={mvpItems.length} label="Núcleo MVP" />
            <ProgressBar value={artigosLidos} max={Math.max(artigos.length, 1)} label="Literatura revisada" />
          </div>
        </Card>
      </motion.div>

      {/* Etapas mini kanban */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-display text-base text-[var(--color-ink)]">Etapas Metodológicas</h2>
          <Link to="/etapas" className="text-xs text-[var(--color-accent)] hover:underline">
            Ver Kanban completo →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...etapas].sort((a, b) => a.ordem - b.ordem).map((e, i) => (
            <motion.div key={e.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">Fase {e.ordem}</span>
                  <StatusBadge status={e.status} />
                </div>
                <p className="text-base font-medium text-[var(--color-ink)] leading-snug">{e.nome}</p>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Bottom row: recent artigos + recent riscos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent artigos */}
        <motion.div initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base text-[var(--color-ink)]">Artigos Recentes</h2>
              <Link to="/artigos" className="text-xs text-[var(--color-accent)] hover:underline">Ver todos →</Link>
            </div>
            {recentArtigos.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-muted)] text-center py-6">
                Nenhum artigo cadastrado ainda.<br />
                <Link to="/artigos" className="text-[var(--color-accent)] hover:underline">Adicionar artigo</Link>
              </p>
            ) : (
              <div className="space-y-3">
                {recentArtigos.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
                    <div className="min-w-0">
                      <p className="text-base font-medium text-[var(--color-ink)] truncate mb-0.5">{a.titulo}</p>
                      <p className="text-sm text-[var(--color-ink-muted)]">{a.autores} · {a.ano}</p>
                    </div>
                    <LeituraBadge status={a.status_leitura} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        {/* Recent riscos */}
        <motion.div initial={{ opacity: 0, x: 12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-display text-base text-[var(--color-ink)]">Riscos & Decisões</h2>
              <Link to="/riscos" className="text-xs text-[var(--color-accent)] hover:underline">Ver todos →</Link>
            </div>
            {recentRiscos.length === 0 ? (
              <p className="text-sm text-[var(--color-ink-muted)] text-center py-6">Nenhum registro ainda.</p>
            ) : (
              <div className="space-y-3">
                {recentRiscos.map(d => (
                  <div key={d.id} className="flex items-start justify-between gap-3 py-3 border-b border-[var(--color-border)] last:border-0">
                    <div className="min-w-0">
                      <p className="text-base font-medium text-[var(--color-ink)] truncate mb-0.5">{d.titulo}</p>
                      <p className="text-sm text-[var(--color-ink-muted)] line-clamp-2">{d.descricao}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <TipoRiscoBadge tipo={d.tipo} />
                      <ImpactoBadge impacto={d.impacto} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
