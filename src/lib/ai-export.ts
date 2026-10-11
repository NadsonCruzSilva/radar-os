import type { Etapa, Artigo, ItemEscopo, DecisaoRisco, Artefato } from '@/types'

export interface ProjectState {
  etapas: Etapa[]
  artigos: Artigo[]
  itensEscopo: ItemEscopo[]
  decisoes: DecisaoRisco[]
  artefatos: Artefato[]
}

export function generateProjectMarkdown(data: ProjectState): string {
  const { etapas, artigos, itensEscopo, decisoes, artefatos } = data

  const etapasDone = etapas.filter(e => e.status === 'Concluído').length
  const mvpItems = itensEscopo.filter(i => i.tipo === 'Núcleo (MVP)')
  const mvpDone = mvpItems.filter(i => i.status === 'Concluído').length
  const artigosLidos = artigos.filter(a => a.status_leitura === 'Lido' || a.status_leitura === 'Citado no texto').length
  const riscosAltos = decisoes.filter(d => d.tipo === 'Risco' && d.impacto === 'Alto').length

  const etapasList = [...etapas]
    .sort((a, b) => a.ordem - b.ordem)
    .map(e => `- [${e.status === 'Concluído' ? 'x' : e.status === 'Em andamento' ? '~' : ' '}] **Fase ${e.ordem}: ${e.nome}** (${e.status})\n  *Descrição:* ${e.descricao}`)
    .join('\n')

  const escopoMvpList = mvpItems
    .map(i => `- [${i.status === 'Concluído' ? 'x' : ' '}] **${i.item}** (${i.status}, Prioridade: ${i.prioridade})\n  *Detalhes:* ${i.descricao}`)
    .join('\n')

  const escopoExtList = itensEscopo
    .filter(i => i.tipo === 'Extensão opcional')
    .map(i => `- [${i.status === 'Concluído' ? 'x' : ' '}] **${i.item}** (${i.status}, Prioridade: ${i.prioridade})\n  *Detalhes:* ${i.descricao}`)
    .join('\n')

  const artigosList = artigos.length === 0
    ? '_Nenhum artigo cadastrado até o momento._'
    : artigos
        .map(a => `- **"${a.titulo}"** (${a.ano}) — *Autores:* ${a.autores}\n  *Status de Leitura:* ${a.status_leitura} | *Temas:* ${a.temas.join(', ') || 'Nenhum'}${a.notas ? `\n  *Anotações:* ${a.notas}` : ''}`)
        .join('\n\n')

  const decisoesList = decisoes.length === 0
    ? '_Nenhuma decisão ou risco registrado._'
    : decisoes
        .map(d => `- **[${d.tipo.toUpperCase()}] ${d.titulo}** (Impacto: ${d.impacto}, Data: ${d.data})\n  *Descrição:* ${d.descricao}\n  *Mitigação/Plano:* ${d.mitigacao || 'Não especificada'}`)
        .join('\n\n')

  const artefatosList = artefatos.length === 0
    ? '_Nenhum artefato registrado._'
    : artefatos
        .map(a => `- **${a.nome}** (Tipo: ${a.tipo}, Status: ${a.status})${a.descricao ? `\n  *Descrição:* ${a.descricao}` : ''}`)
        .join('\n')

  return `# Relatório Executivo de TCC: Radar Inteligente de Despesas Públicas (Radar OS)
**Curso:** Sistemas de Informação
**Tema:** Detecção de Padrões Atípicos e Anomalias em Despesas Públicas com Aprendizado de Máquina Não Supervisionado
**Metodologia:** Design Science Research (DSR)

---

## 1. Resumo Executivo & Indicadores (KPIs)
- **Fases Metodológicas Concluídas:** ${etapasDone} de 7
- **Desenvolvimento do MVP:** ${mvpDone} de ${mvpItems.length} itens finalizados (${Math.round((mvpDone / Math.max(mvpItems.length, 1)) * 100)}%)
- **Revisão Bibliográfica:** ${artigosLidos} de ${artigos.length} artigos lidos ou citados
- **Riscos de Alto Impacto Monitorados:** ${riscosAltos}

---

## 2. Cronograma e Fases da Metodologia DSR
${etapasList}

---

## 3. Escopo do Produto
### 3.1 Núcleo do Sistema (MVP)
${escopoMvpList}

### 3.2 Extensões Opcionais (Backlog)
${escopoExtList}

---

## 4. Revisão Bibliográfica & Referências Fichadas
${artigosList}

---

## 5. Matriz de Decisões Técnicas, Riscos e Limitações
${decisoesList}

---

## 6. Artefatos e Entregáveis do Projeto
${artefatosList}

---

## 7. Instruções para a Inteligência Artificial (Prompt de Análise)
> **Você é um professor avaliador e especialista sênior em Sistemas de Informação e Ciência de Dados.**
> Analise rigorosamente os dados deste projeto de TCC acima e forneça um parecer estruturado:
> 1. **Análise de Viabilidade & Riscos:** Os riscos e limitações identificados cobrem bem as fragilidades de detecção não supervisionada e dados abertos? Há riscos críticos omitidos?
> 2. **Avaliação da Revisão Bibliográfica:** Quais tópicos ou referências adicionais são indispensáveis para fundamentar o Isolation Forest e o problema de explicabilidade (XAI)?
> 3. **Próximos Passos Prioritários:** Considerando as fases e o escopo do MVP, quais devem ser as 3 prioridades imediatas de trabalho?
`
}
