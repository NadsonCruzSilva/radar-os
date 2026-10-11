import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { useApp } from '@/context/AppContext'
import { Card, ProgressBar, ImpactoBadge, TipoRiscoBadge, LeituraBadge, Button } from '@/components/ui'
import { ExportAIDialog } from '@/components/overview/ExportAIDialog'

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
  { n: '3', label: 'Projeto & Desenv.' },
  { n: '4', label: 'Demonstração' },
  { n: '5', label: 'Avaliação' },
  { n: '6', label: 'Comunicação' },
]

function HeroContextCard() {
  return (
    <Card className="h-full bg-[var(--color-ink)] text-[var(--color-surface)] p-4 sm:p-6 md:p-8 flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 p-32 bg-[var(--color-accent)]/10 blur-[100px] rounded-full pointer-events-none" />
      <div>
        <p className="font-mono text-[11px] sm:text-xs text-white/40 uppercase tracking-widest mb-2 sm:mb-3">TCC · Sistemas de Informação · 2026</p>
        <h2 className="text-2xl sm:text-3xl md:text-5xl leading-[1.15] tracking-tight mb-6 sm:mb-8" style={{ fontFamily: 'var(--font-display)' }}>
          Radar Inteligente de Padrões Atípicos em Despesas Públicas
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mt-auto relative z-10">
        <div>
          <p className="font-mono text-[10px] text-white/50 uppercase tracking-wide mb-1.5 sm:mb-2">O Problema</p>
          <p className="text-xs sm:text-sm text-white/80 leading-relaxed">
            Portais de transparência publicam milhares de empenhos, mas não apoiam a distinção entre rotina orçamentária e registros atípicos. O sistema gera uma suspeita analítica auditável baseada em dados abertos.
          </p>
        </div>
        <div className="pl-0 md:pl-6 border-l-0 md:border-l border-white/10">
          <p className="font-mono text-[10px] text-white/50 uppercase tracking-wide mb-1.5 sm:mb-2">Pergunta de Pesquisa</p>
          <p className="text-xs sm:text-sm text-white/90 leading-relaxed italic">
            "Como um sistema baseado em dados abertos e detecção não supervisionada pode identificar, ranquear e explicar despesas públicas atípicas de forma auditável?"
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function OverviewPage() {
  const { etapas, artigos, itensEscopo, decisoes } = useApp()
  const [exportOpen, setExportOpen] = useState(false)

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
    <div className="max-w-[1400px] mx-auto px-3.5 sm:px-6 py-4 sm:py-8">
      {/* Top action bar */}
      <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
        <div>
          <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-ink-muted)]">Painel Central</span>
          <h1 className="text-xl sm:text-2xl font-bold uppercase tracking-wider text-[var(--color-ink)]" style={{ fontFamily: 'var(--font-display)' }}>
            Visão Geral do TCC
          </h1>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={() => setExportOpen(true)}
          className="text-xs flex items-center gap-2 border-[var(--color-border)] hover:border-[var(--color-ink)] bg-[var(--color-surface)] shadow-xs"
        >
          <span className="text-[var(--color-accent)] font-bold text-sm">✦</span>
          <span>Copiar Resumo p/ IA</span>
        </Button>
      </div>

      <motion.div 
        variants={container} 
        initial="hidden" 
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3.5 sm:gap-6"
      >
        {/* ROW 1: Hero (8) + KPIs (4) */}
        <motion.div variants={item} className="xl:col-span-8">
          <HeroContextCard />
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4 grid grid-cols-2 gap-2.5 sm:gap-4">
          {[
            { label: 'Etapas Concluídas', value: `${etapasDone}/7`, sub: `${etapasProgress} em andamento`, icon: '✓', accent: false },
            { label: 'Progresso MVP', value: `${mvpDone}/${mvpItems.length}`, sub: `${Math.round((mvpDone / Math.max(mvpItems.length, 1)) * 100)}%`, icon: '◎', accent: true },
            { label: 'Artigos Lidos', value: String(artigosLidos), sub: `de ${artigos.length}`, icon: '◉', accent: false },
            { label: 'Riscos Altos', value: String(riscosAltos), sub: `${riscosAbertos} abertos`, icon: '◬', accent: riscosAltos === 0, danger: riscosAltos > 0 },
          ].map((kpi) => (
            <Card key={kpi.label} className="p-3.5 sm:p-5 flex flex-col justify-between h-full bg-[var(--color-bg)]">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <span className="text-lg sm:text-xl leading-none text-[var(--color-ink-muted)]">{kpi.icon}</span>
                {kpi.accent && !kpi.danger && <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] mt-1" />}
                {kpi.danger && <span className="w-2 h-2 rounded-full bg-[var(--color-high)] mt-1 animate-pulse" />}
              </div>
              <div>
                <p className="font-mono text-2xl sm:text-3xl text-[var(--color-ink)] leading-none mb-1.5 sm:mb-2 tracking-tight">{kpi.value}</p>
                <p className="text-xs font-semibold text-[var(--color-ink)] mb-0.5">{kpi.label}</p>
                <p className="text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide">{kpi.sub}</p>
              </div>
            </Card>
          ))}
        </motion.div>

        {/* ROW 2: Parâmetros Acadêmicos (8) + MVP (4) */}
        <motion.div variants={item} className="xl:col-span-8 flex flex-col h-full">
          <Card className="p-4 sm:p-6 md:p-8 flex-1">
            <div className="flex items-center justify-between mb-5 sm:mb-6">
              <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Ficha Acadêmica do Projeto</h3>
              <span className="font-mono text-[10px] uppercase px-2 py-0.5 sm:py-1 bg-[var(--color-ink)] text-white rounded-sm">Validado p/ Banca</span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <p className="font-mono text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide mb-1.5">Objetivo Geral</p>
                  <p className="text-xs sm:text-sm text-[var(--color-ink)] leading-relaxed">
                    Desenvolver e avaliar um sistema computacional (Radar) de apoio à auditoria contínua, capaz de identificar e ranquear padrões atípicos em despesas públicas utilizando aprendizado de máquina não supervisionado.
                  </p>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide mb-1.5">Método de Avaliação</p>
                  <p className="text-xs sm:text-sm text-[var(--color-ink)] leading-relaxed">
                    Estudo de caso único com inspeção humana estruturada de alertas. Viabilidade em infraestrutura comum (sem GPU, sem dados sensíveis).
                  </p>
                </div>
              </div>

              <div className="space-y-5 sm:space-y-6">
                <div>
                  <p className="font-mono text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide mb-1.5">Recorte Empírico</p>
                  <div className="p-3 border border-[var(--color-border)] bg-[var(--color-surface)] text-xs sm:text-sm font-mono text-[var(--color-ink)] leading-relaxed">
                    <span className="text-[var(--color-ink-muted)]">[Fonte]</span> SIGEFES / Portal da Transparência ES<br/>
                    <span className="text-[var(--color-ink-muted)]">[Foco]</span> 1 Órgão selecionado<br/>
                    <span className="text-[var(--color-ink-muted)]">[Tempo]</span> Exercício 2024/2025
                  </div>
                </div>
                <div>
                  <p className="font-mono text-[10px] text-[var(--color-ink-muted)] uppercase tracking-wide mb-1.5">Stack Tecnológica Base</p>
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {STACK_TCC.map(s => (
                      <div key={s.label} className="px-2 py-1 bg-[var(--color-surface)] border border-[var(--color-border)] text-[10px] font-mono text-[var(--color-ink)]">
                        {s.label} <span className="text-[var(--color-ink-muted)]">({s.tag})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4 flex flex-col h-full">
          <Card className="p-4 sm:p-6 md:p-8 flex-1 flex flex-col">
            <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-4 sm:mb-5">Escopo de Desenvolvimento (MVP)</h3>
            <ul className="space-y-3 sm:space-y-4 flex-1">
              {MVP_ITEMS.map((m, i) => (
                <li key={i} className="flex items-start gap-2.5 sm:gap-3 text-xs sm:text-sm text-[var(--color-ink)]">
                  <span className="mt-0.5 w-4 h-4 rounded-sm bg-[var(--color-ink)] text-[var(--color-bg)] text-[9px] font-mono font-bold flex items-center justify-center shrink-0">
                    {i + 1}
                  </span>
                  <span className="leading-snug">{m}</span>
                </li>
              ))}
            </ul>
          </Card>
        </motion.div>

        {/* ROW 3: Etapas (12) */}
        <motion.div variants={item} className="xl:col-span-12">
          <Card className="p-4 sm:p-6 md:p-8">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Pipeline do TCC (Status Atual)</h3>
              <Link to="/etapas" className="text-xs font-mono text-[var(--color-accent)] hover:underline min-h-[36px] flex items-center">Ver Gestão de Etapas →</Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-2.5 sm:gap-3">
              {[...etapas].sort((a, b) => a.ordem - b.ordem).slice(0, 7).map((e) => (
                <div key={e.id} className="p-3 border border-[var(--color-border)] bg-[var(--color-bg)] hover:border-[var(--color-ink-muted)] transition-colors h-full flex flex-col">
                  <div className="flex items-center justify-between gap-2 mb-2 sm:mb-3">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--color-ink-muted)]">Fase {e.ordem}</span>
                    <div className={`w-2 h-2 rounded-full ${e.status === 'Concluído' ? 'bg-[var(--color-accent)]' : e.status === 'Em andamento' ? 'bg-[var(--color-ink)] animate-pulse' : 'bg-[var(--color-border)]'}`} title={e.status} />
                  </div>
                  <p className="text-[11px] font-medium text-[var(--color-ink)] leading-snug mt-auto">{e.nome}</p>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        {/* ROW 4: DSR/Progresso (4) + Artigos (4) + Riscos (4) */}
        <motion.div variants={item} className="xl:col-span-4 flex flex-col gap-3.5 sm:gap-6">
          <Card className="p-4 sm:p-6">
            <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-3 sm:mb-4">Estrutura DSR</h3>
            <div className="flex items-center justify-between gap-1 overflow-x-auto pb-2 scrollbar-hide">
              {DSR_PHASES.map((p, i) => (
                <div key={p.n} className="flex items-center shrink-0">
                  <div className="flex flex-col items-center">
                    <div className="w-6 h-6 rounded-full border border-[var(--color-ink)] text-[var(--color-ink)] text-[10px] font-mono font-bold flex items-center justify-center mb-1.5">
                      {p.n}
                    </div>
                    <span className="text-[9px] uppercase tracking-wide text-[var(--color-ink-muted)] text-center max-w-[46px] leading-[1.1]">{p.label}</span>
                  </div>
                  {i < DSR_PHASES.length - 1 && <div className="w-2.5 sm:w-3 h-px bg-[var(--color-border)] mb-4 mx-0.5 sm:mx-1" />}
                </div>
              ))}
            </div>
          </Card>
          
          <Card className="p-4 sm:p-6 flex-1">
            <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)] mb-4 sm:mb-5">Progresso Consolidado</h3>
            <div className="space-y-4 sm:space-y-5">
              <ProgressBar value={etapasDone} max={7} label="Fases Metodológicas" />
              <ProgressBar value={mvpDone} max={mvpItems.length} label="Desenvolvimento" />
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4">
          <Card className="h-full p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Leituras Recentes</h3>
              <Link to="/artigos" className="text-xs font-mono text-[var(--color-accent)] hover:underline min-h-[36px] flex items-center">Ver todos →</Link>
            </div>
            {recentArtigos.length === 0 ? (
              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] my-auto text-center py-4">Sem artigos cadastrados.</p>
            ) : (
              <div className="space-y-3.5 sm:space-y-4 flex-1">
                {recentArtigos.map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-3 group">
                    <div className="min-w-0">
                      <p className="text-xs sm:text-sm font-medium text-[var(--color-ink)] truncate group-hover:text-[var(--color-accent)] transition-colors">{a.titulo}</p>
                      <p className="text-[11px] text-[var(--color-ink-muted)] font-mono mt-0.5">{a.ano} · {a.autores.split(',')[0]} et al.</p>
                    </div>
                    <LeituraBadge status={a.status_leitura} />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

        <motion.div variants={item} className="xl:col-span-4">
          <Card className="h-full p-4 sm:p-6 flex flex-col">
            <div className="flex items-center justify-between mb-4 sm:mb-5">
              <h3 className="font-mono text-[11px] sm:text-xs uppercase tracking-widest text-[var(--color-ink-muted)]">Radar de Riscos</h3>
              <Link to="/riscos" className="text-xs font-mono text-[var(--color-accent)] hover:underline min-h-[36px] flex items-center">Ver Log →</Link>
            </div>
            {recentRiscos.length === 0 ? (
              <p className="text-xs sm:text-sm text-[var(--color-ink-muted)] my-auto text-center py-4">Nenhum risco monitorado.</p>
            ) : (
              <div className="space-y-3.5 sm:space-y-4 flex-1">
                {recentRiscos.map(d => (
                  <div key={d.id} className="border-l-2 border-[var(--color-border)] pl-3 hover:border-[var(--color-ink)] transition-colors">
                    <p className="text-xs sm:text-sm font-medium text-[var(--color-ink)] truncate">{d.titulo}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <TipoRiscoBadge tipo={d.tipo} />
                      <ImpactoBadge impacto={d.impacto} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </motion.div>

      </motion.div>
      <ExportAIDialog open={exportOpen} onClose={() => setExportOpen(false)} />
    </div>
  )
}
