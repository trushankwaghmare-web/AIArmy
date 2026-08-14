"""
hermes_state.py
Simple session state persistence using JSON files and an append-only MEMORY.md
"""

import json
import os
import logging
from typing import Dict, Any

logger = logging.getLogger("hermes.state")

STATE_DIR = os.getenv("HERMES_STATE_DIR", ".hermes")


def _ensure_dir():
    if not os.path.exists(STATE_DIR):
        os.makedirs(STATE_DIR, exist_ok=True)


class HermesState:
    def __init__(self):
        _ensure_dir()
        self._file = os.path.join(STATE_DIR, "state.json")
        self.data = self._load()

    def _load(self) -> Dict[str, Any]:
        if not os.path.exists(self._file):
            return {}
        try:
            with open(self._file, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            logger.exception("Failed to load state.json, starting fresh")
            return {}

    def save(self):
        try:
            with open(self._file, "w", encoding="utf-8") as f:
                json.dump(self.data, f, indent=2, ensure_ascii=False)
        except Exception:
            logger.exception("Failed to save state.json")

    def set(self, key: str, value):
        self.data[key] = value
        self.save()

    def get(self, key: str, default=None):
        return self.data.get(key, default)

    def append_memory(self, text: str):
        memf = os.path.join(STATE_DIR, "MEMORY.md")
        with open(memf, "a", encoding="utf-8") as f:
            f.write(text + "\n\n")


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    s = HermesState()
    s.set("last_run", "now")
    s.append_memory("Bootstrapped Hermes state")
    print("State directory:", STATE_DIR)
