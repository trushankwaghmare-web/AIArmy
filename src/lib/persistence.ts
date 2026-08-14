// Typed local persistence helpers for AI Army Dashboard
import type { Agent, Tool, Schedule } from './supabase'
import type { Task } from './types'

export type PersistedState = {
  agents?: Agent[]
  tools?: Tool[]
  schedules?: Schedule[]
  tasks?: Task[]
  themeMode?: 'dark' | 'light' | 'system'
}

const KEY = 'ai-army-dashboard:v1'

export function loadPersist(): PersistedState | null {
  try {
    if (typeof window === 'undefined') return null
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    return JSON.parse(raw) as PersistedState
  } catch (e) {
    console.warn('Failed to load persisted state', e)
    return null
  }
}

export function savePersist(state: PersistedState) {
  try {
    if (typeof window === 'undefined') return
    const clean = JSON.stringify(state)
    localStorage.setItem(KEY, clean)
  } catch (e) {
    console.warn('Failed to save persisted state', e)
  }
}
