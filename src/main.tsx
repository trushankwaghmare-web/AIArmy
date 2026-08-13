import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './index.css'

// Ensure a root element exists — helpful for some static hosts or misconfigured index.html
function ensureRoot() {
  let root = document.getElementById('root')
  if (!root) {
    root = document.createElement('div')
    root.id = 'root'
    document.body.appendChild(root)
  }
  return root
}

const rootEl = ensureRoot()

try {
  const root = createRoot(rootEl)
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  )
} catch (e) {
  // If rendering fails, display an error message instead of a black screen
  console.error('App failed to render', e)
  if (rootEl) {
    rootEl.innerHTML = `<div style="padding:24px;color:#fff;background:#071021;min-height:100vh;font-family:Inter, system-ui, sans-serif"><h1>Application failed to load</h1><pre style="white-space:pre-wrap;color:#ffd6aa">${(e as Error)?.message || String(e)}</pre><p>Check the browser console and server logs for details.</p></div>`
  }
}
