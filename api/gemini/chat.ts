import type { VercelRequest, VercelResponse } from '@vercel/node';

const AGENT_PROMPTS: Record<string, string> = {
  atlas: "You are Atlas, the AI Army Commander. Be confident and strategic.",
  scout: "You are Scout, the Recon agent. Be quick and factual.",
  forge: "You are Forge, the Code Builder. Be technical and helpful.",
  sentinel: "You are Sentinel, the Security agent. Be vigilant.",
  link: "You are Link, the Communicator. Be friendly.",
  chronos: "You are Chronos, the Scheduler. Be organized.",
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { message, agentId } = req.body || {};
  if (!message) {
    return res.status(400).json({ error: 'Missing required field: message' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  // Normalize agent id
  const key = String(agentId || 'atlas').toLowerCase();
  const systemPrompt = AGENT_PROMPTS[key] || AGENT_PROMPTS['atlas'];

  // Build the request body for the generateContent endpoint
  const bodyPayload = {
    contents: [
      {
        role: 'user',
        parts: [{ text: `${systemPrompt}\n\nUser: ${String(message)}` }],
      },
    ],
  };

  // If no API key is available, return a safe mocked reply (useful for previews/forks)
  if (!apiKey) {
    const mock = `(${key} - mock) I cannot access the Gemini API in this environment. Simulated reply to: "${String(message).slice(0,200)}"`;
    return res.status(200).json({ reply: mock, mock: true });
  }

  // Ensure fetch is available (Node 18+ has global fetch); fallback to node-fetch if needed
  let doFetch: typeof fetch | null = null;
  try {
    // @ts-ignore - global fetch may exist
    if (typeof fetch !== 'undefined') doFetch = fetch
  } catch (_) {
    doFetch = null
  }

  if (!doFetch) {
    try {
      // dynamic import of node-fetch for older runtimes
      // eslint-disable-next-line @typescript-eslint/no-var-requires
      const mod = await import('node-fetch')
      // node-fetch v2 exports the function as default
      doFetch = (mod.default ?? mod) as unknown as typeof fetch
    } catch (e) {
      return res.status(500).json({ error: 'Fetch not available in runtime and node-fetch failed to import' })
    }
  }

  try {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`

    const upstreamResp = await doFetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(bodyPayload),
    } as any)

    if (!upstreamResp.ok) {
      const details = await upstreamResp.text().catch(() => 'Upstream returned non-OK status')
      return res.status(502).json({ error: 'Upstream API error', details })
    }

    const data = await upstreamResp.json().catch(() => null)
    if (!data) return res.status(502).json({ error: 'Failed to parse upstream response' })

    // Try to extract text from several known shapes
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      data?.candidates?.[0]?.content?.[0]?.text ||
      data?.candidates?.[0]?.text ||
      data?.output?.[0]?.content?.[0]?.text ||
      (typeof data === 'string' ? data : null)

    return res.status(200).json({ reply: text ?? 'No response' })
  } catch (err: any) {
    return res.status(500).json({ error: 'Request failed', details: String(err?.message || err) })
  }
}
