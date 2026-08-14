import React, { createContext, useContext, useEffect, useState } from 'react'

type User = {
  name: string
  email: string
  picture?: string
}

type AuthContextType = {
  user: User | null
  signInDemo: () => void
  signOut: () => void
}

const KEY = 'ai-army-user'

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY)
      if (raw) setUser(JSON.parse(raw))
    } catch (e) {
      // ignore
    }
  }, [])

  function signInDemo() {
    const demo: User = { name: 'Demo User', email: 'demo@aiarmy.local', picture: undefined }
    setUser(demo)
    try { localStorage.setItem(KEY, JSON.stringify(demo)) } catch (e) {}
  }

  function signOut() {
    setUser(null)
    try { localStorage.removeItem(KEY) } catch (e) {}
  }

  return <AuthContext.Provider value={{ user, signInDemo, signOut }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
