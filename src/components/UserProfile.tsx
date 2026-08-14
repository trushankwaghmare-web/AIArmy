import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  if (!user) return null

  const initials = user.name ? user.name.split(' ').map((s) => s[0]).slice(0,2).join('') : 'U'

  function resetSettings() {
    try {
      // Clear persisted app settings
      localStorage.removeItem('ai-army-dashboard:v1')
      // Also clear any legacy demo user key if present
      localStorage.removeItem('ai-army-user')
    } catch (e) {
      // ignore
    }
    // reload to apply defaults
    window.location.reload()
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontWeight: 700 }}>{user.name}</div>
        <div className="text-muted" style={{ fontSize: 12 }}>{user.email}</div>
      </div>
      {user.picture ? (
        <img src={user.picture} alt={user.name} style={{ width: 40, height: 40, borderRadius: 10, objectFit: 'cover' }} />
      ) : (
        <div className="agent-avatar" title={user.name} style={{ width: 40, height: 40, borderRadius: 10 }}>{initials}</div>
      )}

      <div style={{ display: 'flex', gap: 8 }}>
        <button className="button ghost" onClick={resetSettings} style={{ padding: '6px 10px' }} title="Reset user settings">
          Reset settings
        </button>
        <button className="button ghost" onClick={() => signOut()} style={{ padding: '6px 10px' }}>
          Sign out
        </button>
      </div>
    </div>
  )
}
