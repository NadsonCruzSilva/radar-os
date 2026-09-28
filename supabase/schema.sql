-- ============================================================
-- RADAR OS — Schema SQL para Supabase (PostgreSQL)
-- Execute este script no SQL Editor do Supabase
-- ============================================================

-- Habilitar extensão UUID
create extension if not exists "pgcrypto";

-- ── ENUMs ─────────────────────────────────────────────────────

create type status_etapa as enum ('Não iniciado', 'Em andamento', 'Concluído');
create type fase_etapa as enum (
  'Revisão bibliográfica',
  'Coleta e análise exploratória',
  'Engenharia de atributos',
  'Detecção',
  'Explicação e contextualização',
  'Desenvolvimento da interface',
  'Avaliação'
);
create type status_leitura as enum ('A ler', 'Lendo', 'Lido', 'Citado no texto');
create type tipo_escopo as enum ('Núcleo (MVP)', 'Extensão opcional');
create type prioridade_escopo as enum ('Alta', 'Média', 'Baixa');
create type status_escopo as enum ('Não iniciado', 'Em andamento', 'Concluído');
create type tipo_risco as enum ('Decisão', 'Risco', 'Limitação');
create type impacto_risco as enum ('Alto', 'Médio', 'Baixo');
create type tipo_artefato as enum (
  'Código/Script', 'Dataset', 'Dashboard',
  'Documento', 'Apresentação', 'Modelo/Notebook'
);
create type status_artefato as enum ('Não iniciado', 'Em andamento', 'Concluído');

-- ── Tables ────────────────────────────────────────────────────

create table etapas (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users on delete cascade not null,
  nome        text not null,
  descricao   text not null default '',
  fase        fase_etapa not null,
  status      status_etapa not null default 'Não iniciado',
  prazo       date,
  notas       text,
  ordem       integer not null default 0,
  created_at  timestamptz not null default now()
);

create table artigos (
  id             uuid primary key default gen_random_uuid(),
  user_id        uuid references auth.users on delete cascade not null,
  titulo         text not null,
  autores        text not null,
  ano            integer not null,
  temas          text[] not null default '{}',
  status_leitura status_leitura not null default 'A ler',
  link           text,
  etapa_id       uuid references etapas(id) on delete set null,
  notas          text,
  contribuicao   text,
  uso_sugerido   text,
  created_at     timestamptz not null default now()
);

create table itens_escopo (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  item       text not null,
  tipo       tipo_escopo not null,
  status     status_escopo not null default 'Não iniciado',
  prioridade prioridade_escopo not null default 'Média',
  etapa_id   uuid references etapas(id) on delete set null,
  descricao  text not null default '',
  created_at timestamptz not null default now()
);

create table decisoes_riscos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  titulo     text not null,
  tipo       tipo_risco not null,
  data       date not null default current_date,
  impacto    impacto_risco not null default 'Médio',
  descricao  text not null,
  mitigacao  text not null default '',
  etapa_id   uuid references etapas(id) on delete set null,
  created_at timestamptz not null default now()
);

create table artefatos (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references auth.users on delete cascade not null,
  nome       text not null,
  tipo       tipo_artefato not null,
  status     status_artefato not null default 'Não iniciado',
  link       text,
  descricao  text not null default '',
  etapa_id   uuid references etapas(id) on delete set null,
  created_at timestamptz not null default now()
);

-- ── Row Level Security (RLS) ──────────────────────────────────

alter table etapas        enable row level security;
alter table artigos        enable row level security;
alter table itens_escopo   enable row level security;
alter table decisoes_riscos enable row level security;
alter table artefatos      enable row level security;

-- Policies: each user sees only their own rows

create policy "Users own their etapas"
  on etapas for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their artigos"
  on artigos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their itens_escopo"
  on itens_escopo for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their decisoes_riscos"
  on decisoes_riscos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

create policy "Users own their artefatos"
  on artefatos for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ── Indexes ───────────────────────────────────────────────────

create index on etapas (user_id, ordem);
create index on artigos (user_id, created_at desc);
create index on itens_escopo (user_id, tipo);
create index on decisoes_riscos (user_id, data desc);
create index on artefatos (user_id, tipo);
