import React from 'react'
import type { Page } from '../types'

type Props = {
  view: Page
  setView: (v: Page) => void
  activeAgents: number
  theme?: string
  setTheme?: (t: string) => void
}

const NAV: { key: Page; label: string }[] = [
  { key: 'Dashboard', label: 'Overview' },
  { key: 'Activity', label: 'Activity' },
  { key: 'Schedule', label: 'Schedule' },
  { key: 'Chat', label: 'Chat' },
  { key: 'Settings', label: 'Settings' },
]

const THEMES: { key: string; label: string }[] = [
  { key: 'dark-blue', label: 'Blue' },
  { key: 'dark-green', label: 'Green' },
  { key: 'dark-purple', label: 'Purple' },
  { key: 'dark-red', label: 'Red' },
  { key: 'black', label: 'Black' },
]

export default function Sidebar({ view, setView, activeAgents, theme, setTheme }: Props) {
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

      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div>
          <div className="text-muted">Theme</div>
          <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
            {THEMES.map((t) => (
              <button
                key={t.key}
                onClick={() => setTheme && setTheme(t.key)}
                title={t.label}
                className={`theme-swatch ${theme === t.key ? 'active' : ''}`}
                style={{ width: 36, height: 36, borderRadius: 8, border: 'none', cursor: 'pointer' }}
              />
            ))}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div className="text-muted">Active agents</div>
            <div style={{ fontWeight: 800 }}>{activeAgents}</div>
          </div>
          <div className="status-dot" />
        </div>
      </div>
    </aside>
  )
}
