import React from 'react'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { signInDemo } = useAuth()

  return (
    <div className="login-root">
      <div className="login-card card">
        <h1 style={{ margin: 0 }}>Welcome to AI Army</h1>
        <p className="text-muted">Sign in to access your dashboard. Demo mode available.</p>

        <div style={{ display: 'flex', gap: 12, marginTop: 20 }}>
          <button className="button" onClick={signInDemo} aria-label="Sign in with demo account">
            Sign in with Google (Demo)
          </button>
        </div>

        <p className="text-muted" style={{ marginTop: 12, fontSize: 13 }}>
          This demo sign-in simulates Google OAuth for previewing the dashboard. To enable real Google OAuth, configure a client ID and server-side flow.
        </p>
      </div>
    </div>
  )
}
