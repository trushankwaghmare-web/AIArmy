import React from 'react'
import { Agent } from '../lib/supabase'

type Props = {
  agents: Agent[]
  large?: boolean
}

export default function AgentCards({ agents, large = false }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: large ? 'repeat(3,1fr)' : 'repeat(3,1fr)', gap: 12 }}>
      {agents.map((a) => (
        <div key={a.id} className="agent-card card">
          <div className="agent-avatar">{a.name.split(' ').map((s) => s[0]).slice(0,2).join('')}</div>
          <div className="agent-meta">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div className="agent-name">{a.name}</div>
                <div className="agent-desc">{a.role} • {a.description}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>{a.tasksDone}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>tasks</div>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
                <div className="progress-bar" style={{ flex: 1 }}>
                  <div className="progress" style={{ width: `${a.successRate}%` }} />
                </div>
                <div style={{ width: 60, textAlign: 'right', fontWeight: 700 }}>{a.successRate}%</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
