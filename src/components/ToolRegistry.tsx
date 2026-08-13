import React from 'react'
import { Tool } from '../lib/supabase'

type Props = { tools: Tool[] }

export default function ToolRegistry({ tools }: Props) {
  return (
    <div className="tools-grid">
      {tools.map((t) => (
        <div key={t.id} className="card tool-card">
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontWeight: 700 }}>{t.name}</div>
              <div className="tool-tag">{t.category}</div>
            </div>
            <div className="text-muted">{t.description}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontWeight: 700 }}>{t.version}</div>
            <div className="text-muted">{t.active ? 'active' : 'inactive'}</div>
          </div>
        </div>
      ))}
    </div>
  )
}
