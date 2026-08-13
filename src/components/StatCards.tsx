import React from 'react'

type Props = {
  activeAgents: number
  tasksCompleted: number
  successRate: number
  sessionsRun: number
}

export default function StatCards({ activeAgents, tasksCompleted, successRate, sessionsRun }: Props) {
  return (
    <div className="stats-grid">
      <div className="card stat-card">
        <h3>Active Agents</h3>
        <div className="stat-value">{activeAgents}</div>
      </div>

      <div className="card stat-card">
        <h3>Tasks Completed</h3>
        <div className="stat-value">{tasksCompleted}</div>
      </div>

      <div className="card stat-card">
        <h3>Success Rate</h3>
        <div className="stat-value">{successRate}%</div>
      </div>

      <div className="card stat-card">
        <h3>Sessions Run</h3>
        <div className="stat-value">{sessionsRun}</div>
      </div>
    </div>
  )
}
