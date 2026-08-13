import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCards from './components/StatCards'
import AgentCards from './components/AgentCards'
import SessionList from './components/SessionList'
import ActivityFeed from './components/ActivityFeed'
import ScheduleList from './components/ScheduleList'
import ToolRegistry from './components/ToolRegistry'
import './App.css'
import type { Agent, Session, Task, AuditLog, Schedule, Tool } from './lib/supabase'
import { demoData } from './lib/demoData'
import { loadPersist, savePersist } from './lib/persistence'

type View = 'Overview' | 'Agents' | 'Sessions' | 'Activity' | 'Schedules' | 'Tools'

export default function App(): JSX.Element {
  const [view, setView] = useState<View>('Overview')
  const [clock, setClock] = useState<string>(new Date().toLocaleString())
  const [systemOK] = useState(true)

  const [agents, setAgents] = useState<Agent[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [schedules, setSchedules] = useState<Schedule[]>([])
  const [tools, setTools] = useState<Tool[]>([])

  // live clock
  useEffect(() => {
    const id = setInterval(() => setClock(new Date().toLocaleString()), 1000)
    return () => clearInterval(id)
  }, [])

  // load demo data and merge persisted overrides (no Supabase calls)
  useEffect(() => {
    const base = {
      agents: demoData.agents,
      sessions: demoData.sessions,
      tasks: demoData.tasks,
      auditLogs: demoData.auditLogs,
      schedules: demoData.schedules,
      tools: demoData.tools,
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
    }

    setAgents(base.agents)
    setSessions(base.sessions)
    setTasks(base.tasks)
    setAuditLogs(base.auditLogs)
    setSchedules(base.schedules)
    setTools(base.tools)
  }, [])

  const activeAgentsCount = agents.filter((a) => a.status === 'online').length
  const tasksCompleted = tasks.filter((t) => t.completed).length
  const avgSuccessRate = agents.length ? Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length) : 0
  const sessionsRun = sessions.length

  // persistence helpers for interactive changes
  function persistAll(updated?: { agents?: Agent[]; tools?: Tool[]; schedules?: Schedule[] }) {
    const toSave = {
      agents: updated?.agents ?? agents,
      tools: updated?.tools ?? tools,
      schedules: updated?.schedules ?? schedules,
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

  return (
    <div className="app-root fade-in">
      <Sidebar view={view} setView={setView} activeAgents={activeAgentsCount} />

      <main className="main-content container">
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
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="status-dot" title={systemOK ? 'All Systems Operational' : 'Degraded'} />
              <div className="text-muted">{systemOK ? 'All Systems Operational' : 'Degraded'}</div>
            </div>
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
              <AgentCards agents={agents} onToggleFavorite={toggleFavoriteAgent} />
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
            <AgentCards agents={agents} large onToggleFavorite={toggleFavoriteAgent} />
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
