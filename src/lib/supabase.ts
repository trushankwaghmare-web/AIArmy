import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Types for data models
export type Agent = {
  id: string
  name: string
  role: string
  description?: string
  avatarColor?: string
  status: 'online' | 'idle' | 'offline'
  tasksDone: number
  successRate: number // 0-100
  favorite?: boolean
}

export type Task = {
  id: string
  title: string
  description?: string
  agentId?: string
  completed: boolean
  success: boolean
  runAt?: string
}

export type Session = {
  id: string
  title: string
  summary?: string
  agentIds: string[]
  tasksCount: number
  progress: number // 0-100
  status: 'running' | 'completed' | 'failed' | 'queued'
}

export type AuditLog = {
  id: string
  timestamp: string
  agentName: string
  action: string
  scope?: string
  success: boolean
}

export type Schedule = {
  id: string
  name: string
  interval: string
  constraints?: string
  nextRun: string
  enabled: boolean
}

export type Tool = {
  id: string
  name: string
  category: string
  version: string
  active: boolean
  description?: string
}

// Supabase client
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || ''
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// helper typed fetch functions (optional)
export async function fetchAgents() {
  try {
    const { data, error } = await supabase.from<Agent>('agents').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchAgents failed', e)
    return null
  }
}

export async function fetchSessions() {
  try {
    const { data, error } = await supabase.from<Session>('sessions').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchSessions failed', e)
    return null
  }
}

export async function fetchTasks() {
  try {
    const { data, error } = await supabase.from<Task>('tasks').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchTasks failed', e)
    return null
  }
}

export async function fetchAuditLogs() {
  try {
    const { data, error } = await supabase.from<AuditLog>('audit_logs').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchAuditLogs failed', e)
    return null
  }
}

export async function fetchSchedules() {
  try {
    const { data, error } = await supabase.from<Schedule>('schedules').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchSchedules failed', e)
    return null
  }
}

export async function fetchTools() {
  try {
    const { data, error } = await supabase.from<Tool>('tools').select('*')
    if (error) throw error
    return data || []
  } catch (e) {
    console.warn('Supabase fetchTools failed', e)
    return null
  }
}
