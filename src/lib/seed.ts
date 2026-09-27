import type {
  Etapa, Artigo, ItemEscopo, DecisaoRisco, Artefato,
} from '@/types'
import { generateId } from '@/lib/utils'

const today = new Date().toISOString().split('T')[0]

export const seedEtapas: Omit<Etapa, 'user_id' | 'created_at'>[] = [
  {
    id: generateId(),
    nome: 'Revisão bibliográfica',
    fase: 'Revisão bibliográfica',
    descricao: 'Levantamento e fichamento do estado da arte em detecção de anomalias em despesas públicas, transparência pública e Design Science Research.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 1,
  },
  {
    id: generateId(),
    nome: 'Coleta e análise exploratória',
    fase: 'Coleta e análise exploratória',
    descricao: 'Extração do conjunto de dados do SIGEFES/Portal da Transparência ES (fallback: API federal). Análise exploratória inicial (EDA) e documentação do dicionário de dados.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 2,
  },
  {
    id: generateId(),
    nome: 'Engenharia de atributos',
    fase: 'Engenharia de atributos',
    descricao: 'Construção dos atributos derivados: log do valor, frequência do favorecido, desvio em relação à mediana do elemento, razão empenho/pagamento, repetição em janela curta.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 3,
  },
  {
    id: generateId(),
    nome: 'Detecção',
    fase: 'Detecção',
    descricao: 'Implementação do Isolation Forest (scikit-learn, CPU). Calibração visual dos hiperparâmetros. Cálculo do ranking de prioridade: escore_normalizado × log1p(valor_absoluto).',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 4,
  },
  {
    id: generateId(),
    nome: 'Explicação e contextualização',
    fase: 'Explicação e contextualização',
    descricao: 'Implementação da camada de explicação: modo determinístico (template em português) e modo LLM open-source em inferência. Grounding obrigatório nos campos do registro.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 5,
  },
  {
    id: generateId(),
    nome: 'Desenvolvimento da interface',
    fase: 'Desenvolvimento da interface',
    descricao: 'Construção do dashboard de alertas: ranking visual, ficha de detalhamento de alerta, filtros por órgão/período, visualizações de apoio à inspeção humana.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 6,
  },
  {
    id: generateId(),
    nome: 'Avaliação',
    fase: 'Avaliação',
    descricao: 'Estudo de caso com inspeção estruturada de alertas. Discussão de acertos, ruído, limites do sistema e implicações para controle social. Redação dos capítulos finais.',
    status: 'Não iniciado',
    prazo: null, notas: null, ordem: 7,
  },
]

export const seedItensEscopo: Omit<ItemEscopo, 'user_id' | 'created_at' | 'etapa_id'>[] = [
  // Núcleo MVP
  { id: generateId(), item: 'Coleta e preparação de uma fonte de dados', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Pipeline de extração, limpeza e versionamento do CSV/API de despesas.' },
  { id: generateId(), item: 'Definição de um recorte empírico', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Escolha do órgão, exercício financeiro e fonte (SIGEFES ES ou API federal).' },
  { id: generateId(), item: 'Engenharia de atributos derivados', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Log do valor, frequência do favorecido, desvio da mediana do elemento, etc.' },
  { id: generateId(), item: 'Detector de anomalias (Isolation Forest)', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Implementação com scikit-learn, CPU, sem GPU, hiperparâmetros documentados.' },
  { id: generateId(), item: 'Ranking de prioridade de alertas', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Fórmula: escore_normalizado × log1p(valor_absoluto).' },
  { id: generateId(), item: 'Identificação das causas principais do alerta', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Evidência dos campos que contribuíram para o outlier (valor, favorecido, elemento).' },
  { id: generateId(), item: 'Contextualização do registro em linguagem natural', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Ficha explicativa em português, ancorada nos campos do registro.' },
  { id: generateId(), item: 'Localização de registros relacionados', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Média', descricao: 'Busca de empenhos relacionados (mesmo favorecido, período, elemento).' },
  { id: generateId(), item: 'Dashboard funcional de alertas', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Interface de exploração: ranking, ficha de detalhe, filtros.' },
  { id: generateId(), item: 'Estudo de caso e avaliação', tipo: 'Núcleo (MVP)', status: 'Não iniciado', prioridade: 'Alta', descricao: 'Inspeção estruturada de alertas com discussão de acertos e ruídos.' },
  // Extensões
  { id: generateId(), item: 'Agrupamento avançado em casos analíticos', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Clustering de alertas similares para identificar padrões recorrentes.' },
  { id: generateId(), item: 'Grafo interativo de relacionamentos', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Visualização de rede entre favorecidos, órgãos e elementos de despesa.' },
  { id: generateId(), item: 'Similaridade semântica entre históricos', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Busca por empenhos com histórico/descrição semanticamente próximo.' },
  { id: generateId(), item: 'Geração de explicações por LLM', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Média', descricao: 'Camada LLM open-source em inferência como alternativa ao template determinístico.' },
  { id: generateId(), item: 'Enriquecimento automático com fontes externas', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Cruzamento com dados de CNPJ (Receita), processos (TCE-ES), etc.' },
  { id: generateId(), item: 'Análise de múltiplos exercícios financeiros', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Comparação temporal entre anos para detectar tendências de anomalia.' },
  { id: generateId(), item: 'Análise simultânea de diversos órgãos', tipo: 'Extensão opcional', status: 'Não iniciado', prioridade: 'Baixa', descricao: 'Expansão do recorte empírico para múltiplos órgãos/entidades.' },
]

export const seedDecisoes: Omit<DecisaoRisco, 'user_id' | 'created_at' | 'etapa_id'>[] = [
  { id: generateId(), titulo: 'Dependência da qualidade dos dados públicos', tipo: 'Risco', data: today, impacto: 'Alto', descricao: 'A qualidade do resultado depende diretamente da integridade e completude dos dados publicados pelos órgãos no SIGEFES ou na API federal.', mitigacao: 'Documentar limitações no diário de bordo. Usar hash do arquivo baixado. Tratar nulos e outliers de digitação na fase de limpeza.' },
  { id: generateId(), titulo: 'Vínculo processo/contrato/licitação pode não existir de forma limpa', tipo: 'Risco', data: today, impacto: 'Alto', descricao: 'Empenhos podem não ter referência estruturada a licitação ou contrato, impedindo rastreio completo da cadeia documental.', mitigacao: 'Limitar a análise ao que está no registro de empenho. Não afirmar vínculos que não existam nos dados.' },
  { id: generateId(), titulo: 'Anomalia estatística não é sinônimo de irregularidade', tipo: 'Limitação', data: today, impacto: 'Médio', descricao: 'O sistema gera suspeita analítica, não tipificação de ilícito. Um outlier pode ser legítimo (compra emergencial, evento atípico).', mitigacao: 'Explicitar o limite ético-jurídico em toda documentação e na interface do dashboard.' },
  { id: generateId(), titulo: 'Uso de Isolation Forest único, sem comparação extensa', tipo: 'Decisão', data: today, impacto: 'Médio', descricao: 'Optou-se por um único algoritmo (Isolation Forest) em vez de uma bateria comparativa, adequado ao escopo de TCC.', mitigacao: 'Documentar hiperparâmetros usados. Incluir linha de base qualitativa (desvio da mediana) para discussão no estudo de caso.' },
  { id: generateId(), titulo: 'LLM tratado como camada opcional (Extensão)', tipo: 'Decisão', data: today, impacto: 'Baixo', descricao: 'A geração de explicação por LLM foi categorizada como extensão opcional. O núcleo usa template determinístico.', mitigacao: 'Garantir que o modo determinístico produza fichas completas e auditáveis sem dependência de GPU ou API externa.' },
  { id: generateId(), titulo: 'Casos analíticos podem ser reduzidos se aumentarem complexidade', tipo: 'Risco', data: today, impacto: 'Médio', descricao: 'Extensões como grafo de relacionamentos e agrupamento avançado podem ser cortadas se o prazo ou a complexidade técnica excedam o escopo de TCC.', mitigacao: 'Manter o roadmap de extensões no backlog. Concluir o núcleo MVP antes de avaliar extensões.' },
  { id: generateId(), titulo: 'Sem rótulos confiáveis de corrupção para avaliação supervisionada', tipo: 'Limitação', data: today, impacto: 'Médio', descricao: 'Não existem ground-truth labels confiáveis de irregularidade para o conjunto de dados, inviabilizando métricas tradicionais de classificação.', mitigacao: 'Avaliação qualitativa por estudo de caso com inspeção humana estruturada. Sem tabelas de p-valor.' },
]

export const seedArtigos: Artigo[] = []
export const seedArtefatos: Artefato[] = []

export interface AppSeed {
  etapas: typeof seedEtapas
  itensEscopo: typeof seedItensEscopo
  decisoes: typeof seedDecisoes
}

// Key for localStorage demo-mode persistence
export const DEMO_STORAGE_KEY = 'radar-os-demo-v1'

export function getInitialDemoData(): {
  etapas: Etapa[]
  artigos: Artigo[]
  itensEscopo: ItemEscopo[]
  decisoes: DecisaoRisco[]
  artefatos: Artefato[]
} {
  try {
    const stored = localStorage.getItem(DEMO_STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch {
    // ignore
  }

  return {
    etapas: seedEtapas.map(e => ({ ...e, user_id: 'demo', created_at: new Date().toISOString() })) as Etapa[],
    artigos: [],
    itensEscopo: seedItensEscopo.map(i => ({ ...i, user_id: 'demo', etapa_id: null, created_at: new Date().toISOString() })) as ItemEscopo[],
    decisoes: seedDecisoes.map(d => ({ ...d, user_id: 'demo', etapa_id: null, created_at: new Date().toISOString() })) as DecisaoRisco[],
    artefatos: [],
  }
}

export function saveDemoData(data: {
  etapas: Etapa[]
  artigos: Artigo[]
  itensEscopo: ItemEscopo[]
  decisoes: DecisaoRisco[]
  artefatos: Artefato[]
}) {
  localStorage.setItem(DEMO_STORAGE_KEY, JSON.stringify(data))
}
