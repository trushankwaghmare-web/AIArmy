import React from 'react'
import { Tool } from '../lib/supabase'

type Props = { tools: Tool[]; onToggleActive?: (id: string) => void }

export default function ToolRegistry({ tools, onToggleActive }: Props) {
  return (
    <div className="tools-grid">
      {tools.map((t) => (
        <div key={t.id} className="card tool-card" style={{ alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              <div className="tool-tag">{t.category}</div>
            </div>
            <div className="text-muted">{t.description}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
            <div style={{ fontWeight: 700 }}>{t.version}</div>
            <div>
              <div
                role="switch"
                aria-checked={t.active}
                onClick={() => onToggleActive && onToggleActive(t.id)}
                className={`toggle ${t.active ? 'on' : ''}`}
                title={t.active ? 'Active' : 'Inactive'}
              >
                <div className="knob" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
