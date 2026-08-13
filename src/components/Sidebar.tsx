import React from 'react'

type Props = {
  view: string
  setView: (v: any) => void
  activeAgents: number
}

const NAV: { key: string; label: string }[] = [
  { key: 'Overview', label: 'Overview' },
  { key: 'Agents', label: 'Agents' },
  { key: 'Sessions', label: 'Sessions' },
  { key: 'Activity', label: 'Activity Log' },
  { key: 'Schedules', label: 'Schedules' },
  { key: 'Tools', label: 'Tools' },
]

export default function Sidebar({ view, setView, activeAgents }: Props) {
  return (
    <aside className="sidebar">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div className="logo">AI</div>
          <div>
            <div style={{ fontWeight: 800 }}>AI Army</div>
            <div className="text-muted" style={{ fontSize: 12 }}>Control panel</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setView(n.key)}
              style={{
                background: view === n.key ? 'linear-gradient(90deg,var(--color-500),var(--color-600))' : 'transparent',
                color: view === n.key ? '#021924' : undefined,
                border: 'none',
                padding: '8px 12px',
                borderRadius: 8,
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {n.label}
            </button>
          ))}
        </nav>
      </div>

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div className="text-muted">Active agents</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 800 }}>{activeAgents}</div>
          <div className="status-dot" />
        </div>
      </div>
    </aside>
  )
}
