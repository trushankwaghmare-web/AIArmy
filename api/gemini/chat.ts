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

  const { message, agentId } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'GEMINI_API_KEY not set' });
  }

  const systemPrompt = AGENT_PROMPTS[agentId] || AGENT_PROMPTS.atlas;

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [
          { role: 'user', parts: [{ text: systemPrompt + '\n\nUser: ' + message }] }
        ]
      }),
    }
  );

  const data = await response.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
  return res.status(200).json({ reply: text });
}
