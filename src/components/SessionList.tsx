import React from 'react'
import { Session } from '../lib/supabase'

type Props = {
  sessions: Session[]
  showAll?: boolean
}

export default function SessionList({ sessions, showAll = false }: Props) {
  const list = showAll ? sessions : sessions.slice(0, 5)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {list.map((s) => (
        <div key={s.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.title}</div>
              <div className="text-muted">{s.summary}</div>
            </div>
            <div style={{ width: 220 }}>
              <div className="progress-bar">
                <div className="progress" style={{ width: `${s.progress}%` }} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <div className="badge">{s.status}</div>
                <div className="text-muted">{s.tasksCount} tasks</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
