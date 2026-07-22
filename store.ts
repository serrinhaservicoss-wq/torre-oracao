'use client'
import { User, Gideao, PresencaMap, DEFAULT_USERS, seedGideoes,
         LS_USERS, LS_GIDEOES, LS_PRES } from './data'

// ──────────────────────────────────────────────────────────────────────────────
//  STORAGE HELPERS — rodam apenas no cliente
// ──────────────────────────────────────────────────────────────────────────────
function ls<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch { return fallback }
}
function lsSet(key: string, val: unknown) {
  if (typeof window === 'undefined') return
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// ──────────────────────────────────────────────────────────────────────────────
//  LOAD
// ──────────────────────────────────────────────────────────────────────────────
export function loadUsers(): User[] {
  const saved = ls<User[]>(LS_USERS, [])
  if (!saved.length) return [...DEFAULT_USERS]
  // garante admin sempre presente
  if (!saved.find(u => u.login === 'admin')) saved.unshift(DEFAULT_USERS[0])
  return saved
}

export function loadGideoes(): Gideao[] {
  const saved = ls<Gideao[]>(LS_GIDEOES, [])
  if (!saved.length) return seedGideoes()
  return saved
}

export function loadPres(): PresencaMap {
  return ls<PresencaMap>(LS_PRES, {})
}

// ──────────────────────────────────────────────────────────────────────────────
//  SAVE
// ──────────────────────────────────────────────────────────────────────────────
export function saveUsers(u: User[])       { lsSet(LS_USERS, u) }
export function saveGideoes(g: Gideao[])   { lsSet(LS_GIDEOES, g) }
export function savePres(p: PresencaMap)   { lsSet(LS_PRES, p) }
