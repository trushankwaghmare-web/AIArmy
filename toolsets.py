"""
toolsets.py
Tool registration and execution wrappers.
Define tools as callables that accept (context, *args, **kwargs)
"""

import logging
from typing import Callable, Dict, Any

logger = logging.getLogger("hermes.tools")

TOOLS: Dict[str, Callable[..., Any]] = {}


def register_tool(name: str):
    def _decor(fn: Callable[..., Any]):
        TOOLS[name] = fn
        logger.debug("Registered tool: %s", name)
        return fn
    return _decor


def call_tool(name: str, ctx: Dict[str, Any], *args, **kwargs):
    fn = TOOLS.get(name)
    if not fn:
        raise KeyError(f"Tool not found: {name}")
    return fn(ctx, *args, **kwargs)


# Example tool
@register_tool("echo")
def _echo_tool(ctx, text: str):
    return {"echo": text}


if __name__ == "__main__":
    print(call_tool("echo", {}, "hello"))
