import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import type { Etapa, Artigo, ItemEscopo, DecisaoRisco, Artefato } from '@/types'
import { db, auth, isDemoMode } from '@/lib/firebase'
import { onAuthStateChanged } from 'firebase/auth'
import {
  collection,
  getDocs,
  doc,
  setDoc,
  deleteDoc,
  writeBatch,
  query,
  orderBy,
} from 'firebase/firestore'
import {
  getInitialDemoData,
  saveDemoData,
  seedEtapas,
  seedItensEscopo,
  seedDecisoes,
} from '@/lib/seed'
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

// Helper to remove undefined fields which Firestore rejects
function cleanDoc<T extends Record<string, any>>(obj: T): T {
  const res: Record<string, any> = {}
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) {
      res[k] = v
    }
  }
  return res as T
}

// ─── Provider ────────────────────────────────────────────────────────────────

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AppData>({
    etapas: [], artigos: [], itensEscopo: [], decisoes: [], artefatos: [],
  })

  // ── Load data when Auth state is established ──────────────────────────────

  useEffect(() => {
    if (isDemoMode || !db || !auth) {
      setData(getInitialDemoData())
      setLoading(false)
      return
    }

    const firestore = db

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setData(getInitialDemoData())
        setLoading(false)
        return
      }

      setLoading(true)
      try {
        // Firestore load for authenticated user
        const [etapasSnap, artigosSnap, escopoSnap, decisoesSnap, artefatosSnap] = await Promise.all([
          getDocs(query(collection(firestore, 'etapas'), orderBy('ordem', 'asc'))),
          getDocs(query(collection(firestore, 'artigos'), orderBy('created_at', 'desc'))),
          getDocs(query(collection(firestore, 'itens_escopo'), orderBy('created_at', 'asc'))),
          getDocs(query(collection(firestore, 'decisoes_riscos'), orderBy('data', 'desc'))),
          getDocs(query(collection(firestore, 'artefatos'), orderBy('created_at', 'asc'))),
        ])

        // First-time seed if Firestore collection is empty
        if (etapasSnap.empty && escopoSnap.empty) {
          const batch = writeBatch(firestore)
          const now = new Date().toISOString()

          const initialEtapas: Etapa[] = seedEtapas.map(e => ({
            ...e,
            user_id: user.uid,
            created_at: now,
          })) as Etapa[]

          const initialEscopo: ItemEscopo[] = seedItensEscopo.map(i => ({
            ...i,
            user_id: user.uid,
            etapa_id: null,
            created_at: now,
          })) as ItemEscopo[]

          const initialDecisoes: DecisaoRisco[] = seedDecisoes.map(d => ({
            ...d,
            user_id: user.uid,
            etapa_id: null,
            created_at: now,
          })) as DecisaoRisco[]

          for (const item of initialEtapas) {
            batch.set(doc(firestore, 'etapas', item.id), cleanDoc(item))
          }
          for (const item of initialEscopo) {
            batch.set(doc(firestore, 'itens_escopo', item.id), cleanDoc(item))
          }
          for (const item of initialDecisoes) {
            batch.set(doc(firestore, 'decisoes_riscos', item.id), cleanDoc(item))
          }

          await batch.commit()

          setData({
            etapas: initialEtapas,
            artigos: [],
            itensEscopo: initialEscopo,
            decisoes: initialDecisoes,
            artefatos: [],
          })
          setLoading(false)
          return
        }

        const etapas = etapasSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Etapa)
        const artigos = artigosSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Artigo)
        const itensEscopo = escopoSnap.docs.map(d => ({ id: d.id, ...d.data() }) as ItemEscopo)
        const decisoes = decisoesSnap.docs.map(d => ({ id: d.id, ...d.data() }) as DecisaoRisco)
        const artefatos = artefatosSnap.docs.map(d => ({ id: d.id, ...d.data() }) as Artefato)

        setData({
          etapas,
          artigos,
          itensEscopo,
          decisoes,
          artefatos,
        })
      } catch (err) {
        console.error('Erro ao buscar dados do Firestore, carregando fallback local:', err)
        setData(getInitialDemoData())
      } finally {
        setLoading(false)
      }
    })

    return () => unsubscribe()
  }, [])

  // Persist demo data whenever it changes in demo mode
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
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'etapas', id), { status }, { merge: true })
    }
  }, [mutate])

  const reorderEtapas = useCallback(async (ids: string[]) => {
    mutate('etapas', prev => {
      const map = new Map((prev as Etapa[]).map(e => [e.id, e]))
      return ids.map((id, i) => ({ ...map.get(id)!, ordem: i + 1 })) as AppData['etapas']
    })
    if (!isDemoMode && db) {
      const firestore = db
      const batch = writeBatch(firestore)
      ids.forEach((id, i) => {
        batch.set(doc(firestore, 'etapas', id), { ordem: i + 1 }, { merge: true })
      })
      await batch.commit()
    }
  }, [mutate])

  // ── Artigos ───────────────────────────────────────────────────────────────

  const addArtigo = useCallback(async (artigo: Omit<Artigo, 'id' | 'user_id' | 'created_at'>) => {
    const currentUid = auth?.currentUser?.uid || 'default'
    const newArtigo: Artigo = {
      ...artigo,
      id: generateId(),
      user_id: currentUid,
      created_at: new Date().toISOString(),
    }
    mutate('artigos', prev => [newArtigo, ...(prev as Artigo[])] as AppData['artigos'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'artigos', newArtigo.id), cleanDoc(newArtigo))
    }
  }, [mutate])

  const updateArtigo = useCallback(async (id: string, updates: Partial<Artigo>) => {
    mutate('artigos', prev => (prev as Artigo[]).map(a => a.id === id ? { ...a, ...updates } : a) as AppData['artigos'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'artigos', id), cleanDoc(updates), { merge: true })
    }
  }, [mutate])

  const deleteArtigo = useCallback(async (id: string) => {
    mutate('artigos', prev => (prev as Artigo[]).filter(a => a.id !== id) as AppData['artigos'])
    if (!isDemoMode && db) {
      await deleteDoc(doc(db, 'artigos', id))
    }
  }, [mutate])

  // ── Escopo ────────────────────────────────────────────────────────────────

  const toggleItemEscopo = useCallback(async (id: string) => {
    let nextStatus: ItemEscopo['status'] = 'Não iniciado'
    mutate('itensEscopo', prev => {
      return (prev as ItemEscopo[]).map(i => {
        if (i.id !== id) return i
        const next: ItemEscopo['status'] = i.status === 'Concluído' ? 'Não iniciado' : 'Concluído'
        nextStatus = next
        return { ...i, status: next }
      }) as AppData['itensEscopo']
    })
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'itens_escopo', id), { status: nextStatus }, { merge: true })
    }
  }, [mutate])

  const addItemEscopo = useCallback(async (item: Omit<ItemEscopo, 'id' | 'user_id' | 'created_at'>) => {
    const currentUid = auth?.currentUser?.uid || 'default'
    const newItem: ItemEscopo = {
      ...item,
      id: generateId(),
      user_id: currentUid,
      created_at: new Date().toISOString(),
    }
    mutate('itensEscopo', prev => [...(prev as ItemEscopo[]), newItem] as AppData['itensEscopo'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'itens_escopo', newItem.id), cleanDoc(newItem))
    }
  }, [mutate])

  // ── Decisões/Riscos ───────────────────────────────────────────────────────

  const addDecisao = useCallback(async (d: Omit<DecisaoRisco, 'id' | 'user_id' | 'created_at'>) => {
    const currentUid = auth?.currentUser?.uid || 'default'
    const newD: DecisaoRisco = {
      ...d,
      id: generateId(),
      user_id: currentUid,
      created_at: new Date().toISOString(),
    }
    mutate('decisoes', prev => [newD, ...(prev as DecisaoRisco[])] as AppData['decisoes'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'decisoes_riscos', newD.id), cleanDoc(newD))
    }
  }, [mutate])

  const deleteDecisao = useCallback(async (id: string) => {
    mutate('decisoes', prev => (prev as DecisaoRisco[]).filter(d => d.id !== id) as AppData['decisoes'])
    if (!isDemoMode && db) {
      await deleteDoc(doc(db, 'decisoes_riscos', id))
    }
  }, [mutate])

  // ── Artefatos ─────────────────────────────────────────────────────────────

  const addArtefato = useCallback(async (a: Omit<Artefato, 'id' | 'user_id' | 'created_at'>) => {
    const currentUid = auth?.currentUser?.uid || 'default'
    const newA: Artefato = {
      ...a,
      id: generateId(),
      user_id: currentUid,
      created_at: new Date().toISOString(),
    }
    mutate('artefatos', prev => [newA, ...(prev as Artefato[])] as AppData['artefatos'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'artefatos', newA.id), cleanDoc(newA))
    }
  }, [mutate])

  const updateArtefato = useCallback(async (id: string, updates: Partial<Artefato>) => {
    mutate('artefatos', prev => (prev as Artefato[]).map(a => a.id === id ? { ...a, ...updates } : a) as AppData['artefatos'])
    if (!isDemoMode && db) {
      await setDoc(doc(db, 'artefatos', id), cleanDoc(updates), { merge: true })
    }
  }, [mutate])

  const deleteArtefato = useCallback(async (id: string) => {
    mutate('artefatos', prev => (prev as Artefato[]).filter(a => a.id !== id) as AppData['artefatos'])
    if (!isDemoMode && db) {
      await deleteDoc(doc(db, 'artefatos', id))
    }
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
