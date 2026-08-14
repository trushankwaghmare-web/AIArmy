import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function UserProfile() {
  const { user, signOut } = useAuth()
  if (!user) return null

  const initials = user.name.split(' ').map((s) => s[0]).slice(0,2).join('')

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
        <div style={{ fontWeight: 700 }}>{user.name}</div>
        <div className="text-muted" style={{ fontSize: 12 }}>{user.email}</div>
      </div>
      <div className="agent-avatar" title={user.name} style={{ width: 40, height: 40, borderRadius: 10 }}>{initials}</div>
      <button className="button ghost" onClick={signOut} style={{ padding: '6px 10px' }}>Sign out</button>
    </div>
  )
}
