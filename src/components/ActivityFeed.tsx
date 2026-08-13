import React from 'react'
import { AuditLog } from '../lib/supabase'

type Props = {
  logs: AuditLog[]
  showAll?: boolean
}

export default function ActivityFeed({ logs, showAll = false }: Props) {
  const list = showAll ? logs : logs.slice(0, 6)

  return (
    <div className="timeline">
      {list.map((l) => (
        <div key={l.id} className="timeline-item">
          <div className="timeline-dot" />
          <div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'baseline' }}>
              <div style={{ fontWeight: 700 }}>{l.agentName}</div>
              <div className="text-muted" style={{ fontSize: 12 }}>{new Date(l.timestamp).toLocaleString()}</div>
            </div>
            <div>{l.action} <span className="text-muted">{l.scope ? `• ${l.scope}` : ''}</span></div>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <div className={l.success ? 'badge' : 'badge'} style={{ background: l.success ? 'rgba(22,163,74,0.12)' : 'rgba(239,68,68,0.12)', color: l.success ? undefined : undefined }}>{l.success ? 'success' : 'failure'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
