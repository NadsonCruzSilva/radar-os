import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Etapa, Artigo, ItemEscopo, DecisaoRisco, Artefato } from '@/types'
import { supabase, isDemoMode } from '@/lib/supabase'
import { getInitialDemoData, saveDemoData } from '@/lib/seed'
import { generateId } from '@/lib/utils'

// ─── Types ───────────────────────────────────────────────────────────────────

interface AppData {
  etapas: Etapa[]
  artigos: Artigo[]
  itensEscopo: ItemEscopo[]
  decisoes: DecisaoRisco[]
  artefatos: Artefato[]
}

interface AppContextType extends AppData {
  loading: boolean
  // Etapas
  updateEtapaStatus: (id: string, status: Etapa['status']) => Promise<void>
  reorderEtapas: (ids: string[]) => Promise<void>
  // Artigos
  addArtigo: (artigo: Omit<Artigo, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateArtigo: (id: string, artigo: Partial<Artigo>) => Promise<void>
  deleteArtigo: (id: string) => Promise<void>
  // Escopo
  toggleItemEscopo: (id: string) => Promise<void>
  addItemEscopo: (item: Omit<ItemEscopo, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  // Decisões/Riscos
  addDecisao: (d: Omit<DecisaoRisco, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  deleteDecisao: (id: string) => Promise<void>
  // Artefatos
  addArtefato: (a: Omit<Artefato, 'id' | 'user_id' | 'created_at'>) => Promise<void>
  updateArtefato: (id: string, a: Partial<Artefato>) => Promise<void>
  deleteArtefato: (id: string) => Promise<void>
}

const AppContext = createContext<AppContextType | null>(null)

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AppData>({
    etapas: [], artigos: [], itensEscopo: [], decisoes: [], artefatos: [],
  })

  // ── Load data ─────────────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      if (isDemoMode) {
        setData(getInitialDemoData())
        setLoading(false)
        return
      }
      // Supabase load — parallel fetch all tables
      const [etapasRes, artigosRes, escopoRes, decisoesRes, artefatosRes] = await Promise.all([
        supabase!.from('etapas').select('*').order('ordem'),
        supabase!.from('artigos').select('*').order('created_at', { ascending: false }),
        supabase!.from('itens_escopo').select('*').order('created_at'),
        supabase!.from('decisoes_riscos').select('*').order('data', { ascending: false }),
        supabase!.from('artefatos').select('*').order('created_at'),
      ])
      setData({
        etapas: etapasRes.data ?? [],
        artigos: artigosRes.data ?? [],
        itensEscopo: escopoRes.data ?? [],
        decisoes: decisoesRes.data ?? [],
        artefatos: artefatosRes.data ?? [],
      })
      setLoading(false)
    }
    load()
  }, [])

  // Persist demo data whenever it changes
  useEffect(() => {
    if (!isDemoMode || loading) return
    saveDemoData(data)
  }, [data, loading])

  // ── Helpers ───────────────────────────────────────────────────────────────

  const mutate = useCallback(<K extends keyof AppData>(
    key: K,
    updater: (prev: AppData[K]) => AppData[K]
  ) => {
    setData(d => ({ ...d, [key]: updater(d[key] as AppData[K]) }))
  }, [])

  // ── Etapas ────────────────────────────────────────────────────────────────

  const updateEtapaStatus = useCallback(async (id: string, status: Etapa['status']) => {
    mutate('etapas', prev =>
      (prev as Etapa[]).map(e => e.id === id ? { ...e, status } : e) as AppData['etapas']
    )
    if (!isDemoMode) await supabase!.from('etapas').update({ status }).eq('id', id)
  }, [mutate])

  const reorderEtapas = useCallback(async (ids: string[]) => {
    mutate('etapas', prev => {
      const map = new Map((prev as Etapa[]).map(e => [e.id, e]))
      return ids.map((id, i) => ({ ...map.get(id)!, ordem: i + 1 })) as AppData['etapas']
    })
    if (!isDemoMode) {
      await Promise.all(
        ids.map((id, i) => supabase!.from('etapas').update({ ordem: i + 1 }).eq('id', id))
      )
    }
  }, [mutate])

  // ── Artigos ───────────────────────────────────────────────────────────────

  const addArtigo = useCallback(async (artigo: Omit<Artigo, 'id' | 'user_id' | 'created_at'>) => {
    const newArtigo: Artigo = { ...artigo, id: generateId(), created_at: new Date().toISOString() }
    mutate('artigos', prev => [newArtigo, ...(prev as Artigo[])] as AppData['artigos'])
    if (!isDemoMode) await supabase!.from('artigos').insert(newArtigo)
  }, [mutate])

  const updateArtigo = useCallback(async (id: string, updates: Partial<Artigo>) => {
    mutate('artigos', prev => (prev as Artigo[]).map(a => a.id === id ? { ...a, ...updates } : a) as AppData['artigos'])
    if (!isDemoMode) await supabase!.from('artigos').update(updates).eq('id', id)
  }, [mutate])

  const deleteArtigo = useCallback(async (id: string) => {
    mutate('artigos', prev => (prev as Artigo[]).filter(a => a.id !== id) as AppData['artigos'])
    if (!isDemoMode) await supabase!.from('artigos').delete().eq('id', id)
  }, [mutate])

  // ── Escopo ────────────────────────────────────────────────────────────────

  const toggleItemEscopo = useCallback(async (id: string) => {
    mutate('itensEscopo', prev => {
      return (prev as ItemEscopo[]).map(i => {
        if (i.id !== id) return i
        const next: ItemEscopo['status'] = i.status === 'Concluído' ? 'Não iniciado' : 'Concluído'
        return { ...i, status: next }
      }) as AppData['itensEscopo']
    })
    if (!isDemoMode) {
      const item = data.itensEscopo.find(i => i.id === id)
      if (item) {
        const next = item.status === 'Concluído' ? 'Não iniciado' : 'Concluído'
        await supabase!.from('itens_escopo').update({ status: next }).eq('id', id)
      }
    }
  }, [mutate, data.itensEscopo])

  const addItemEscopo = useCallback(async (item: Omit<ItemEscopo, 'id' | 'user_id' | 'created_at'>) => {
    const newItem: ItemEscopo = { ...item, id: generateId(), created_at: new Date().toISOString() }
    mutate('itensEscopo', prev => [...(prev as ItemEscopo[]), newItem] as AppData['itensEscopo'])
    if (!isDemoMode) await supabase!.from('itens_escopo').insert(newItem)
  }, [mutate])

  // ── Decisões/Riscos ───────────────────────────────────────────────────────

  const addDecisao = useCallback(async (d: Omit<DecisaoRisco, 'id' | 'user_id' | 'created_at'>) => {
    const newD: DecisaoRisco = { ...d, id: generateId(), created_at: new Date().toISOString() }
    mutate('decisoes', prev => [newD, ...(prev as DecisaoRisco[])] as AppData['decisoes'])
    if (!isDemoMode) await supabase!.from('decisoes_riscos').insert(newD)
  }, [mutate])

  const deleteDecisao = useCallback(async (id: string) => {
    mutate('decisoes', prev => (prev as DecisaoRisco[]).filter(d => d.id !== id) as AppData['decisoes'])
    if (!isDemoMode) await supabase!.from('decisoes_riscos').delete().eq('id', id)
  }, [mutate])

  // ── Artefatos ─────────────────────────────────────────────────────────────

  const addArtefato = useCallback(async (a: Omit<Artefato, 'id' | 'user_id' | 'created_at'>) => {
    const newA: Artefato = { ...a, id: generateId(), created_at: new Date().toISOString() }
    mutate('artefatos', prev => [newA, ...(prev as Artefato[])] as AppData['artefatos'])
    if (!isDemoMode) await supabase!.from('artefatos').insert(newA)
  }, [mutate])

  const updateArtefato = useCallback(async (id: string, updates: Partial<Artefato>) => {
    mutate('artefatos', prev => (prev as Artefato[]).map(a => a.id === id ? { ...a, ...updates } : a) as AppData['artefatos'])
    if (!isDemoMode) await supabase!.from('artefatos').update(updates).eq('id', id)
  }, [mutate])

  const deleteArtefato = useCallback(async (id: string) => {
    mutate('artefatos', prev => (prev as Artefato[]).filter(a => a.id !== id) as AppData['artefatos'])
    if (!isDemoMode) await supabase!.from('artefatos').delete().eq('id', id)
  }, [mutate])

  return (
    <AppContext.Provider value={{
      ...data,
      loading,
      updateEtapaStatus,
      reorderEtapas,
      addArtigo,
      updateArtigo,
      deleteArtigo,
      toggleItemEscopo,
      addItemEscopo,
      addDecisao,
      deleteDecisao,
      addArtefato,
      updateArtefato,
      deleteArtefato,
    }}>
      {children}
    </AppContext.Provider>
  )
}
