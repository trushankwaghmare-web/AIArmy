import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCards from './components/StatCards'
import AgentCards from './components/AgentCards'
import SessionList from './components/SessionList'
import ActivityFeed from './components/ActivityFeed'
import ScheduleList from './components/ScheduleList'
import ToolRegistry from './components/ToolRegistry'
import './App.css'
import { demoData } from './lib/demoData'
import { loadPersist, savePersist } from './lib/persistence'
import LoginPage from './components/LoginPage'
import { AuthProvider, useAuth } from './context/AuthContext'
import UserProfile from './components/UserProfile'
import { v4 as uuidv4 } from 'uuid'
import type { Task } from './types'

// ... Agent, Session, AuditLog, Schedule, Tool types are same as before

type Agent = {
  id: string
  name: string
  role: string
  description?: string
  avatarColor?: string
  status: 'online' | 'idle' | 'offline'
  tasksDone: number
  successRate: number
  favorite?: boolean
}

type Session = {
  id: string
  title: string
  summary?: string
  agentIds: string[]
  tasksCount: number
  progress: number
  status: 'running' | 'completed' | 'failed' | 'queued'
}

type AuditLog = {
  id: string
  timestamp: string
  agentName: string
  action: string
  scope?: string
  success: boolean
}

type Schedule = {
  id: string
  name: string
  interval: string
  constraints?: string
  nextRun: string
  enabled: boolean
}

type Tool = {
  id: string
  name: string
  category: string
  version: string
  active: boolean
  description?: string
}

type View = 'Overview' | 'Agents' | 'Sessions' | 'Activity' | 'Schedules' | 'Tools'

function AppInner(): JSX.Element {
  const { user } = useAuth()

  const [view, setView] = useState<View>('Overview')
  const [clock, setClock] = useState<string>(new Date().toLocaleString())
  const [systemOK] = useState(true)

  const [agents, setAgents] = useState<Agent[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [tools, setTools] = useState<Tool[]>([])

  const [themeMode, setThemeMode] = useState<'dark' | 'light' | 'system'>('system')
  const [anim, setAnim] = useState(false)

  // live clock
  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleString()), 1000)
    return () => clearInterval(id)
  }, [])

  // apply theme mode to document (dark/light/system)
  useEffect(() => {
    try {
      let effective = themeMode
      if (themeMode === 'system') {
        effective = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
      }
      document.documentElement.setAttribute('data-theme', effective === 'dark' ? 'dark-blue' : 'black')
      // persist themeMode
      const persisted = loadPersist() || {}
      savePersist({ ...persisted, themeMode })
    } catch (e) {
      // ignore in non-browser env
    }
  }, [themeMode])

  // load demo data and merge persisted overrides (no external API calls)
  useEffect(() => {
    const base = {
      agents: demoData.agents as Agent[],
      sessions: demoData.sessions as Session[],
      tasks: demoData.tasks.map((t) => ({ ...t, progress: t.completed ? 100 : (t.progress ?? Math.floor(Math.random() * 40)) })) as Task[],
      auditLogs: demoData.auditLogs as AuditLog[],
      schedules: demoData.schedules as Schedule[],
      tools: demoData.tools as Tool[],
    }

    const persisted = loadPersist()

    if (persisted) {
      if (persisted.agents) {
        const map = new Map(persisted.agents.map((x) => [x.id, x]))
        base.agents = base.agents.map((x) => ({ ...x, ...(map.get(x.id) || {}) }))
      }
      if (persisted.tools) {
        const map = new Map(persisted.tools.map((x) => [x.id, x]))
        base.tools = base.tools.map((x) => ({ ...x, ...(map.get(x.id) || {}) }))
      }
      if (persisted.schedules) {
        const map = new Map(persisted.schedules.map((x) => [x.id, x]))
        base.schedules = base.schedules.map((x) => ({ ...x, ...(map.get(x.id) || {}) }))
      }
      if (persisted.tasks) {
        base.tasks = persisted.tasks
      }
      if (persisted.themeMode) {
        setThemeMode(persisted.themeMode)
      }
    }

    setAgents(base.agents)
    setSessions(base.sessions)
    setTasks(base.tasks)
    setAuditLogs(base.auditLogs)
    setSchedules(base.schedules)
    setTools(base.tools)
  }, [])

  // animate on view change
  useEffect(() => {
    setAnim(true)
    const t = setTimeout(() => setAnim(false), 320)
    return () => clearTimeout(t)
  }, [view])

  // Simulate real-time updates: every 3s, randomly update task progress and activity logs
  useEffect(() => {
    const id = setInterval(() => {
      setTasks((prev) => {
        const next = prev.map((t) => {
          if (t.completed || (t.progress || 0) >= 100) return { ...t, progress: 100 }
          const inc = Math.floor(Math.random() * 8)
          const p = Math.min(100, (t.progress || 0) + inc)
          return { ...t, progress: p }
        })
        // persist tasks
        const persisted = loadPersist() || {}
        savePersist({ ...persisted, tasks: next })
        return next
      })

      setAuditLogs((prev) => {
        const rndAgent = demoData.agents[Math.floor(Math.random() * demoData.agents.length)]
        const newLog: AuditLog = {
          id: `log-${Date.now()}`,
          timestamp: new Date().toISOString(),
          agentName: rndAgent.name,
          action: ['Ran job', 'Fetched data', 'Verified output', 'Alert sent'][Math.floor(Math.random() * 4)],
          scope: 'automation',
          success: Math.random() > 0.1,
        }
        const next = [newLog, ...prev].slice(0, 50)
        // persist audit logs? We keep them volatile
        return next
      })
    }, 3000)
    return () => clearInterval(id)
  }, [])

  const activeAgentsCount = agents.filter((a) => a.status === 'online').length
  const tasksCompleted = tasks.filter((t) => t.completed || (t.progress || 0) >= 100).length
  const avgSuccessRate = agents.length ? Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length) : 0
  const sessionsRun = sessions.length

  // persistence helpers for interactive changes
  function persistAll(updated?: { agents?: Agent[]; tools?: Tool[]; schedules?: Schedule[]; tasks?: Task[]; themeMode?: 'dark'|'light'|'system' }) {
    const prev = loadPersist() || {}
    const toSave = {
      agents: updated?.agents ?? agents,
      tools: updated?.tools ?? tools,
      schedules: updated?.schedules ?? schedules,
      tasks: updated?.tasks ?? tasks,
      themeMode: updated?.themeMode ?? prev.themeMode ?? themeMode,
    }
    savePersist(toSave)
  }

  function toggleTool(id: string) {
    setTools((prev) => {
      const next = prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
      persistAll({ tools: next })
      return next
    })
  }

  function toggleSchedule(id: string) {
    setSchedules((prev) => {
      const next = prev.map((s) => (s.id === id ? { ...s, enabled: !s.enabled } : s))
      const updatedSchedule = next.find((s) => s.id === id)

      // when enabling, add a scheduled task; when disabling, remove related scheduled tasks
      if (updatedSchedule) {
        if (updatedSchedule.enabled) {
          // add a task representing the schedule
          const newTask: Task = {
            id: `sched-task-${uuidv4()}`,
            title: `Scheduled: ${updatedSchedule.name}`,
            completed: false,
            success: false,
            agentId: demoData.agents[0]?.id || 'agent-1',
            progress: 0,
          }
          setTasks((prevTasks) => {
            const nextTasks = [...prevTasks, newTask]
            persistAll({ schedules: next, tasks: nextTasks })
            return nextTasks
          })
        } else {
          // remove tasks created by this schedule (title startsWith 'Scheduled: name')
          setTasks((prevTasks) => {
            const nextTasks = prevTasks.filter((t) => !t.title?.startsWith(`Scheduled: ${updatedSchedule.name}`))
            persistAll({ schedules: next, tasks: nextTasks })
            return nextTasks
          })
        }
      }

      persistAll({ schedules: next })
      return next
    })
  }

  function toggleFavoriteAgent(id: string) {
    setAgents((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, favorite: !a.favorite } : a))
      persistAll({ agents: next })
      return next
    })
  }

  function toggleAgentStatus(id: string) {
    setAgents((prev) => {
      const next = prev.map((a) => (a.id === id ? { ...a, status: a.status === 'online' ? 'offline' : 'online' } : a))
      persistAll({ agents: next })
      return next
    })
  }

  function changeThemeMode(newMode: 'dark'|'light'|'system') {
    setThemeMode(newMode)
    persistAll({ themeMode: newMode })
  }

  if (!user) return <LoginPage />

  return (
    <div className={`app-root fade-in ${anim ? 'view-anim' : ''}`}>
      <Sidebar view={view} setView={setView} activeAgents={activeAgentsCount} themeMode={themeMode} setThemeMode={changeThemeMode} />

      <main className={`main-content container ${anim ? 'view-transition' : ''}`}>
        <div className="header">
          <div className="brand">
            <div className="logo">AI</div>
            <div>
              <h1>AI Army Dashboard</h1>
              <p className="text-muted">Manage agents, sessions, schedules and tools</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontWeight: 700 }}>{clock}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{new Date().toLocaleTimeString()}</div>
            </div>

            <UserProfile />
          </div>
        </div>

        <section style={{ marginTop: 16 }}>
          <StatCards
            activeAgents={activeAgentsCount}
            tasksCompleted={tasksCompleted}
            successRate={avgSuccessRate}
            sessionsRun={sessionsRun}
          />
        </section>

        <section style={{ marginTop: 16, display: view === 'Overview' ? 'block' : 'none' }}>
          <div className="card" style={{ marginBottom: 16 }}>
            <h2 style={{ marginTop: 0 }}>Overview</h2>
            <p className="text-muted">Quick snapshot of the AI Army</p>
          </div>

          <div style={{ display: 'grid', gap: 16 }}>
            <div className="card">
              <h3>Agents</h3>
              <AgentCards agents={agents} onToggleFavorite={toggleFavoriteAgent} onToggleStatus={toggleAgentStatus} />
            </div>

            <div className="card">
              <h3>Recent Sessions</h3>
              <SessionList sessions={sessions} />
            </div>

            <div className="card">
              <h3>Activity</h3>
              <ActivityFeed logs={auditLogs} />
            </div>
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Agents' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Agents</h2>
            <AgentCards agents={agents} large onToggleFavorite={toggleFavoriteAgent} onToggleStatus={toggleAgentStatus} />
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Sessions' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Sessions</h2>
            <SessionList sessions={sessions} showAll />
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Activity' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Activity Log</h2>
            <ActivityFeed logs={auditLogs} showAll />
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Schedules' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Schedules</h2>
            <ScheduleList schedules={schedules} onToggleEnabled={toggleSchedule} />
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Tools' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Tool Registry</h2>
            <ToolRegistry tools={tools} onToggleActive={toggleTool} />
          </div>
        </section>
      </main>
    </div>
  )
}

export default function AppWithAuth() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
