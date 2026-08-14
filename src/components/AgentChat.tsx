import React, { useEffect, useState } from 'react'
import { AGENT_LIST } from '../lib/agents'

type Message = { role: 'user' | 'assistant'; text: string }

export default function AgentChat() {
  const [agent, setAgent] = useState<string>(AGENT_LIST[0])
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // simple persistence per agent
    try {
      const raw = localStorage.getItem(`chat:${agent}`)
      if (raw) setMessages(JSON.parse(raw))
    } catch (e) {}
  }, [agent])

  useEffect(() => {
    try { localStorage.setItem(`chat:${agent}`, JSON.stringify(messages)) } catch (e) {}
  }, [messages, agent])

  async function send() {
    if (!input.trim()) return
    const text = input.trim()
    setMessages((m) => [...m, { role: 'user', text }])
    setInput('')
    setLoading(true)

    try {
      const resp = await fetch('/api/gemini/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ agent, message: text }),
      })
      const data = await resp.json()
      if (resp.ok) {
        setMessages((m) => [...m, { role: 'assistant', text: data.reply }])
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: `Error: ${data.error || data.details || 'Unknown'}` }])
      }
    } catch (e: any) {
      setMessages((m) => [...m, { role: 'assistant', text: `Request failed: ${e.message || String(e)}` }])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <h3>Agent Chat</h3>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <select value={agent} onChange={(e) => setAgent(e.target.value)}>
          {AGENT_LIST.map((a) => (
            <option key={a} value={a}>{a}</option>
          ))}
        </select>
        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#9ca3af' }}>{loading ? 'Thinking...' : 'Ready'}</div>
      </div>

      <div style={{ maxHeight: 260, overflow: 'auto', display: 'flex', flexDirection: 'column', gap: 8, padding: 8, background: 'rgba(0,0,0,0.04)', borderRadius: 8 }}>
        {messages.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '80%' }}>
            <div style={{ background: m.role === 'user' ? 'linear-gradient(90deg,#00b4d7,#008fac)' : 'rgba(255,255,255,0.04)', padding: 8, borderRadius: 8 }}>
              <div style={{ whiteSpace: 'pre-wrap' }}>{m.text}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={`Message ${agent}...`} style={{ flex: 1, padding: '8px 10px', borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)', background: 'transparent', color: 'inherit' }} />
        <button className="button" onClick={send} disabled={loading}>Send</button>
      </div>
    </div>
  )
}
