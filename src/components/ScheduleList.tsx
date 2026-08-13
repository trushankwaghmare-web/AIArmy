import type { Schedule } from '../lib/supabase'

type Props = {
  schedules: Schedule[]
  onToggleEnabled?: (id: string) => void
}

export default function ScheduleList({ schedules, onToggleEnabled }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {schedules.map((s) => (
        <div key={s.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 700 }}>{s.name}</div>
            <div className="text-muted">{s.constraints}</div>
          </div>
          <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: 8, alignItems: 'flex-end' }}>
            <div className="schedule-interval">{s.interval}</div>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <div className="text-muted">Next: {new Date(s.nextRun).toLocaleString()}</div>
              <div
                role="switch"
                aria-checked={s.enabled}
                className={`toggle ${s.enabled ? 'on' : ''}`}
                onClick={() => onToggleEnabled && onToggleEnabled(s.id)}
                title={s.enabled ? 'Enabled' : 'Disabled'}
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
