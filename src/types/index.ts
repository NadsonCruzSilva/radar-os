// ─── All application types ──────────────────────────────────────────────────

export type StatusEtapa = 'Não iniciado' | 'Em andamento' | 'Concluído'
export type FaseEtapa =
  | 'Revisão bibliográfica'
  | 'Coleta e análise exploratória'
  | 'Engenharia de atributos'
  | 'Detecção'
  | 'Explicação e contextualização'
  | 'Desenvolvimento da interface'
  | 'Avaliação'

export type StatusLeitura = 'A ler' | 'Lendo' | 'Lido' | 'Citado no texto'
export type TipoEscopo = 'Núcleo (MVP)' | 'Extensão opcional'
export type PrioridadeEscopo = 'Alta' | 'Média' | 'Baixa'
export type StatusEscopo = 'Não iniciado' | 'Em andamento' | 'Concluído'
export type TipoRisco = 'Decisão' | 'Risco' | 'Limitação'
export type ImpactoRisco = 'Alto' | 'Médio' | 'Baixo'
export type TipoArtefato =
  | 'Código/Script'
  | 'Dataset'
  | 'Dashboard'
  | 'Documento'
  | 'Apresentação'
  | 'Modelo/Notebook'
export type StatusArtefato = 'Não iniciado' | 'Em andamento' | 'Concluído'

// ─── Entity interfaces ───────────────────────────────────────────────────────

export interface Etapa {
  id: string
  user_id?: string
  nome: string
  descricao: string
  fase: FaseEtapa
  status: StatusEtapa
  prazo?: string | null
  notas?: string | null
  ordem: number
  created_at?: string
}

export interface Artigo {
  id: string
  user_id?: string
  titulo: string
  autores: string
  ano: number
  temas: string[]
  status_leitura: StatusLeitura
  link?: string | null
  etapa_id?: string | null
  notas?: string | null
  contribuicao?: string | null
  uso_sugerido?: string | null
  created_at?: string
}

export interface ItemEscopo {
  id: string
  user_id?: string
  item: string
  tipo: TipoEscopo
  status: StatusEscopo
  prioridade: PrioridadeEscopo
  etapa_id?: string | null
  descricao: string
  created_at?: string
}

export interface DecisaoRisco {
  id: string
  user_id?: string
  titulo: string
  tipo: TipoRisco
  data: string
  impacto: ImpactoRisco
  descricao: string
  mitigacao: string
  etapa_id?: string | null
  created_at?: string
}

export interface Artefato {
  id: string
  user_id?: string
  nome: string
  tipo: TipoArtefato
  status: StatusArtefato
  link?: string | null
  descricao: string
  etapa_id?: string | null
  created_at?: string
}
