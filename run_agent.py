"""
run_agent.py
Main orchestration runtime for Hermes.
Provides AgentRuntime which exposes run_interactive and shutdown hooks.
"""

import asyncio
import logging
import datetime
from typing import Optional

logger = logging.getLogger("hermes.runtime")


class AgentRuntime:
    def __init__(self, model: str = "local"):
        self.model = model
        self._stop = False
        self.loop = asyncio.get_event_loop()

    async def handle_user_input(self, text: str) -> None:
        # Placeholder for actual tool invocation and model calls
        logger.info("User input received: %s", text[:80])
        await asyncio.sleep(0.1)
        # Echo back for now
        print(f"> {text}")
        print(f"[{datetime.datetime.utcnow().isoformat()}] Hermes ({self.model}): This is a stubbed response.")

    async def run_interactive(self) -> None:
        print("Hermes agent interactive shell (type Ctrl-C to exit).")
        print("Use /help for commands. Typing blank line will re-prompt.")
        try:
            while not self._stop:
                # Use asyncio-friendly input
                text = await self.loop.run_in_executor(None, input, "hermes> ")
                text = text.strip()
                if not text:
                    continue
                if text.startswith("/"):
                    await self._handle_slash_command(text)
                else:
                    await self.handle_user_input(text)
        except asyncio.CancelledError:
            logger.debug("Interactive loop cancelled")

    async def _handle_slash_command(self, cmd: str):
        cmd = cmd.strip()
        if cmd in ("/quit", "/exit"):
            print("Shutting down Hermes runtime...")
            self._stop = True
        elif cmd == "/help":
            print("Available commands: /help /exit /model <name> /skills /compress")
        elif cmd.startswith("/model"):
            parts = cmd.split(maxsplit=1)
            if len(parts) > 1:
                self.model = parts[1]
                print(f"Model set to {self.model}")
            else:
                print(f"Current model: {self.model}")
        elif cmd == "/skills":
            print("Installed skills: (stub) explorer, summarizer, agent-runner")
        elif cmd == "/compress":
            print("Compressing context (stub)... done")
        else:
            print(f"Unknown command: {cmd}")

    async def shutdown(self):
        self._stop = True
        logger.info("AgentRuntime shutdown requested")


if __name__ == "__main__":
    rt = AgentRuntime()
    asyncio.run(rt.run_interactive())
