import React, { useEffect, useRef, useState } from "react";

type AgentStatus = "active" | "busy" | "idle" | "offline";

type Agent = {
  id: string;
  name: string;
  role: string;
  color: string;
  icon: string;
  status: AgentStatus;
  tasks: number;
  uptime: number;
};

const AGENTS: Agent[] = [
  { id: "atlas", name: "Atlas", role: "Commander", color: "#00f5ff", icon: "🧠", status: "active", tasks: 47, uptime: 99.2 },
  { id: "scout", name: "Scout", role: "Recon & Search", color: "#a855f7", icon: "🔍", status: "active", tasks: 31, uptime: 97.8 },
  { id: "forge", name: "Forge", role: "Code Builder", color: "#f97316", icon: "⚙️", status: "busy", tasks: 58, uptime: 98.5 },
  { id: "sentinel", name: "Sentinel", role: "Security", color: "#22c55e", icon: "🛡️", status: "active", tasks: 24, uptime: 99.9 },
  { id: "link", name: "Link", role: "Communicator", color: "#eab308", icon: "🔗", status: "idle", tasks: 19, uptime: 95.1 },
  { id: "chronos", name: "Chronos", role: "Scheduler", color: "#ec4899", icon: "⏱️", status: "active", tasks: 63, uptime: 98.0 },
];

const PAGES = ["Dashboard", "Activity", "Schedule", "Chat", "Settings"] as const;
export type Page = (typeof PAGES)[number];

export default function App(): JSX.Element {
  const [page, setPage] = useState<Page>("Dashboard");
  const [toggles, setToggles] = useState<Record<string, boolean>>(
    Object.fromEntries(AGENTS.map((a) => [a.id, a.status === "active"]))
  );

  const [chatInput, setChatInput] = useState<string>("");
  const chatInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    // Example: focus input when entering Chat page
    if (page === "Chat") {
      chatInputRef.current?.focus();
    }
  }, [page]);

  useEffect(() => {
    // Load persisted toggles if available
    try {
      const raw = localStorage.getItem("ai-army:toggles");
      if (raw) {
        const parsed = JSON.parse(raw) as Record<string, boolean>;
        setToggles((t) => ({ ...t, ...parsed }));
      }
    } catch {
      // ignore parse errors
    }
  }, []);

  function toggleAgent(id: string) {
    setToggles((t) => {
      const next = { ...t, [id]: !t[id] };
      try {
        localStorage.setItem("ai-army:toggles", JSON.stringify(next));
      } catch {
        // ignore storage errors
      }
      return next;
    });
  }

  function handleSendMessage() {
    if (!chatInput.trim()) return;
    // For now, just echo to console and clear
    console.log("Send message to agent:", chatInput);
    setChatInput("");
  }

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#04040f", color: "#fff", fontFamily: "system-ui" }}>
      {/* Sidebar */}
      <div style={{ width: 190, background: "#08081a", borderRight: "1px solid #00f5ff22", display: "flex", flexDirection: "column", padding: 16 }}>
        <div style={{ color: "#00f5ff", fontWeight: 800, fontSize: 18, marginBottom: 24 }}>⚡ AI ARMY</div>
        {PAGES.map((p) => (
          <button
            key={p}
            onClick={() => setPage(p)}
            style={{
              background: page === p ? "#00f5ff22" : "transparent",
              border: `1px solid ${page === p ? "#00f5ff" : "transparent"}`,
              color: page === p ? "#00f5ff" : "#888",
              borderRadius: 8,
              padding: "10px 14px",
              marginBottom: 6,
              cursor: "pointer",
              textAlign: "left",
              fontSize: 14,
            }}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={{ flex: 1, padding: 28 }}>
        <h1 style={{ color: "#fff", marginTop: 0 }}>{page}</h1>

        {page === "Dashboard" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 16 }}>
            {AGENTS.map((a) => (
              <div key={a.id} style={{ background: "#0d0d1f", border: `1px solid ${a.color}44`, borderRadius: 14, padding: 18 }}>
                <div style={{ fontSize: 32 }}>{a.icon}</div>
                <div style={{ color: a.color, fontWeight: 700, fontSize: 17, marginTop: 8 }}>{a.name}</div>
                <div style={{ color: "#888", fontSize: 12 }}>{a.role}</div>
                <div style={{ marginTop: 12, display: "flex", justifyContent: "space-between", fontSize: 13 }}>
                  <span style={{ color: "#ccc" }}>
                    Tasks: <b style={{ color: "#fff" }}>{a.tasks}</b>
                  </span>
                  <span style={{ color: a.color }}>{a.uptime}%</span>
                </div>
                <button
                  onClick={() => toggleAgent(a.id)}
                  style={{
                    marginTop: 12,
                    width: "100%",
                    background: toggles[a.id] ? "#22c55e22" : "#ffffff11",
                    border: `1px solid ${toggles[a.id] ? "#22c55e" : "#555"}`,
                    color: toggles[a.id] ? "#22c55e" : "#aaa",
                    borderRadius: 6,
                    padding: "7px 0",
                    cursor: "pointer",
                  }}
                >
                  {toggles[a.id] ? "● Active" : "○ Offline"}
                </button>
              </div>
            ))}
          </div>
        )}

        {page === "Activity" && (
          <div>
            {["Forge built API endpoint", "Sentinel blocked 3 requests", "Scout found 142 results", "Chronos scheduled tasks"].map((log, i) => (
              <div key={i} style={{ background: "#0d0d1f", border: "1px solid #ffffff11", borderRadius: 10, padding: "12px 16px", marginBottom: 10, color: "#ccc" }}>
                {log}
              </div>
            ))}
          </div>
        )}

        {page === "Schedule" && (
          <div>
            {["Daily Report — 9:00", "Security Scan — 12:00", "Data Backup — 15:00", "Night Summary — 22:00"].map((t, i) => (
              <div key={i} style={{ background: "#0d0d1f", border: "1px solid #ffffff11", borderRadius: 10, padding: "12px 16px", marginBottom: 10, color: "#ccc", display: "flex", justifyContent: "space-between" }}>
                <span>{t}</span>
                <button style={{ background: "#22c55e22", border: "1px solid #22c55e", color: "#22c55e", borderRadius: 6, padding: "4px 12px", cursor: "pointer" }}>
                  Done
                </button>
              </div>
            ))}
          </div>
        )}

        {page === "Chat" && (
          <div style={{ background: "#0d0d1f", border: "1px solid #00f5ff33", borderRadius: 14, padding: 20 }}>
            <div style={{ color: "#00f5ff", marginBottom: 16 }}>💬 Chat with Atlas</div>
            <div style={{ background: "#ffffff08", borderRadius: 10, padding: 14, color: "#888", marginBottom: 16 }}>Hello! I am Atlas, your AI Commander. How can I help?</div>
            <div style={{ display: "flex", gap: 10 }}>
              <input
                ref={chatInputRef}
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                placeholder="Type message..."
                style={{ flex: 1, background: "#ffffff11", border: "1px solid #444", borderRadius: 8, padding: "10px 14px", color: "#fff", outline: "none" }}
              />
              <button
                onClick={handleSendMessage}
                style={{ background: "#00f5ff22", border: "1px solid #00f5ff", color: "#00f5ff", borderRadius: 8, padding: "10px 20px", cursor: "pointer" }}
              >
                Send
              </button>
            </div>
          </div>
        )}

        {page === "Settings" && (
          <div style={{ maxWidth: 400 }}>
            <div style={{ background: "#0d0d1f", border: "1px solid #333", borderRadius: 14, padding: 20, marginBottom: 16 }}>
              <div style={{ color: "#aaa", marginBottom: 12 }}>Theme</div>
              {["Dark", "Midnight", "Neon"].map((t) => (
                <button key={t} style={{ background: "#ffffff11", border: "1px solid #444", color: "#ccc", borderRadius: 8, padding: "8px 16px", marginRight: 8, cursor: "pointer" }}>{t}</button>
              ))}
            </div>
            <button style={{ background: "#00f5ff22", border: "1px solid #00f5ff", color: "#00f5ff", borderRadius: 10, padding: "12px 28px", cursor: "pointer", fontWeight: 700 }}>Save Settings</button>
          </div>
        )}
      </div>
    </div>
  );
}
