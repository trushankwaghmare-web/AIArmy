import type { Agent } from '../lib/supabase'

type Props = {
  agents: Agent[]
  large?: boolean
  onToggleFavorite?: (id: string) => void
}

export default function AgentCards({ agents, large = false, onToggleFavorite }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: large ? 'repeat(3,1fr)' : 'repeat(3,1fr)', gap: 12 }}>
      {agents.map((a) => (
        <div key={a.id} className="agent-card card">
          <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="agent-avatar">{a.name.split(' ').map((s) => s[0]).slice(0,2).join('')}</div>
              <div className="agent-meta">
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  <div>
                    <div className="agent-name">{a.name}</div>
                    <div className="agent-desc">{a.role} • {a.description}</div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <button
                aria-label={a.favorite ? 'Unfavorite agent' : 'Favorite agent'}
                className={`star ${a.favorite ? 'on' : ''}`}
                onClick={() => onToggleFavorite && onToggleFavorite(a.id)}
                title={a.favorite ? 'Favorited' : 'Add to favorites'}
              >
                <svg viewBox="0 0 24 24" fill={a.favorite ? 'currentColor' : 'none'} stroke={a.favorite ? 'none' : 'currentColor'} xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
              </button>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700 }}>{a.tasksDone}</div>
                <div className="text-muted" style={{ fontSize: 12 }}>tasks</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, alignItems: 'center' }}>
              <div className="progress-bar" style={{ flex: 1 }}>
                <div className="progress" style={{ width: `${a.successRate}%` }} />
              </div>
              <div style={{ width: 60, textAlign: 'right', fontWeight: 700 }}>{a.successRate}%</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
