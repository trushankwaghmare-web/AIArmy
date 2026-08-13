import React from 'react'
import { Schedule } from '../lib/supabase'

type Props = { schedules: Schedule[] }

export default function ScheduleList({ schedules }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      {schedules.map((s) => (
        <div key={s.id} className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontWeight: 700 }}>{s.name}</div>
              <div className="text-muted">{s.constraints}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div className="schedule-interval">{s.interval}</div>
              <div className="text-muted">Next: {new Date(s.nextRun).toLocaleString()}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
