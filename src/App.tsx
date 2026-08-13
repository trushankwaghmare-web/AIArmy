import React, { useEffect, useState } from 'react'
import Sidebar from './components/Sidebar'
import StatCards from './components/StatCards'
import AgentCards from './components/AgentCards'
import SessionList from './components/SessionList'
import ActivityFeed from './components/ActivityFeed'
import ScheduleList from './components/ScheduleList'
import ToolRegistry from './components/ToolRegistry'
import './App.css'
import {
  Agent,
  Session,
  Task,
  AuditLog,
  Schedule,
  Tool,
  fetchAgents,
  fetchSessions,
  fetchTasks,
  fetchAuditLogs,
  fetchSchedules,
  fetchTools,
} from './lib/supabase'
import { demoData } from './lib/demoData'

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

  // load data from Supabase with demo fallback
  useEffect(() => {
    let mounted = true

    async function loadAll() {
      const [a, s, t, l, sch, to] = await Promise.all([
        fetchAgents(),
        fetchSessions(),
        fetchTasks(),
        fetchAuditLogs(),
        fetchSchedules(),
        fetchTools(),
      ])

      if (!mounted) return

      // if any are null, fallback to demoData for everything
      const useDemo = [a, s, t, l, sch, to].some((x) => x === null)

      if (useDemo) {
        setAgents(demoData.agents)
        setSessions(demoData.sessions)
        setTasks(demoData.tasks)
        setAuditLogs(demoData.auditLogs)
        setSchedules(demoData.schedules)
        setTools(demoData.tools)
      } else {
        setAgents(a ?? [])
        setSessions(s ?? [])
        setTasks(t ?? [])
        setAuditLogs(l ?? [])
        setSchedules(sch ?? [])
        setTools(to ?? [])
      }
    }

    loadAll()

    return () => {
      mounted = false
    }
  }, [])

  const activeAgentsCount = agents.filter((a) => a.status === 'online').length
  const tasksCompleted = tasks.filter((t) => t.completed).length
  const avgSuccessRate = agents.length ? Math.round(agents.reduce((sum, a) => sum + a.successRate, 0) / agents.length) : 0
  const sessionsRun = sessions.length

  return (
    <div className="app-root">
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
              <AgentCards agents={agents} />
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
            <AgentCards agents={agents} large />
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
            <ScheduleList schedules={schedules} />
          </div>
        </section>

        <section style={{ marginTop: 16, display: view === 'Tools' ? 'block' : 'none' }}>
          <div className="card">
            <h2>Tool Registry</h2>
            <ToolRegistry tools={tools} />
          </div>
        </section>
      </main>
    </div>
  )
}
