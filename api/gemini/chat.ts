import { VercelRequest, VercelResponse } from '@vercel/node'

// Serverless proxy to Google Gemini / Generative API (robust parsing + local fetch polyfill)
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { agent, message } = req.body || {}
  if (!agent || !message) return res.status(400).json({ error: 'agent and message required' })

  const AGENT_PROMPTS: Record<string, string> = {
    Atlas: `You are Atlas, the Strategic Director. You provide high-level planning, prioritize goals, and summarize plans succinctly. Keep tone confident and concise. When asked for steps, provide clear numbered steps and brief justifications.`,
    Scout: `You are Scout Research, a data & research agent. You collect, analyze and summarize data and sources. Provide citations when possible and be cautious about uncertain facts.`,
    Forge: `You are Forge Execution, responsible for orchestrating and executing tasks. Provide step-by-step operational instructions, checks, and error handling suggestions.`,
    Sentinel: `You are Sentinel QA, a quality assurance agent. Focus on validations, tests, edge cases, and risk analysis. Provide mitigation steps and test ideas.`,
    Link: `You are Link Tool Integrator. Explain integrations, connectors, and API usage. Provide examples of request/response formats and tips for retries and rate limits.`,
    Chronos: `You are Chronos Scheduler. Manage scheduling, cron expressions, and timing strategies. Provide next run times and explain scheduling trade-offs.`,
  }

  const systemPrompt = AGENT_PROMPTS[agent] || ''

  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY
  if (!apiKey) return res.status(500).json({ error: 'Missing GEMINI API key on server' })

  // Construct a prompt combining system and user message
  const prompt = `${systemPrompt}\n\nUser: ${message}\nAssistant:`

  // helper to obtain fetch in environments that may not have global fetch (local Node)
  async function getFetch() {
    if (typeof fetch !== 'undefined') return fetch
    try {
      const mod = await import('node-fetch')
      return (mod.default ?? mod) as typeof fetch
    } catch (e) {
      // last resort: throw
      throw new Error('fetch is not available in this runtime and node-fetch could not be imported')
    }
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta2/models/text-bison-001:generateText?key=${encodeURIComponent(apiKey)}`
    const body = {
      prompt: {
        text: prompt,
      },
      temperature: 0.2,
      maxOutputTokens: 512,
    }

    const doFetch = await getFetch()
    const r = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    if (!r.ok) {
      const txt = await r.text()
      return res.status(502).json({ error: 'Upstream API error', details: txt })
    }

    const data = await r.json()

    // Attempt to extract text from known response shapes
    let output = ''
    if (data?.candidates && data.candidates[0]) {
      const c = data.candidates[0]
      if (typeof c === 'string') output = c
      else if (c.output && typeof c.output === 'string') output = c.output
      else if (c.content && c.content[0] && c.content[0].text) output = c.content[0].text
    }

    if (!output && data?.output?.[0]?.content?.[0]?.text) {
      output = data.output[0].content[0].text
    }

    if (!output && data?.reply?.[0]?.content) {
      output = data.reply[0].content
    }

    if (!output && typeof data === 'string') output = data
    if (!output) output = JSON.stringify(data)

    return res.status(200).json({ reply: output })
  } catch (e: any) {
    return res.status(500).json({ error: 'Request failed', details: e.message || String(e) })
  }
}
