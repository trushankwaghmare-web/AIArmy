"""
cli.py
Terminal CLI for Hermes agent.
Supports basic commands and launches the main agent run loop.
"""

import sys
import asyncio
import argparse
import logging
from typing import Optional

from run_agent import AgentRuntime
from hermes_logging import configure_logging

logger = logging.getLogger("hermes.cli")


def main(argv: Optional[list] = None) -> int:
    configure_logging()

    parser = argparse.ArgumentParser(prog="hermes", description="Hermes Agent CLI")
    parser.add_argument("--model", "-m", help="Model to use", default="local")
    parser.add_argument("--debug", action="store_true", help="Enable debug logging")
    sub = parser.add_subparsers(dest="cmd")

    sub.add_parser("run", help="Start the agent runtime (interactive)")
    sub.add_parser("batch", help="Run batch jobs using batch_runner.py")
    sub.add_parser("serve", help="Start MCP server (mcp_serve.py)")

    args = parser.parse_args(argv)

    if args.debug:
        logging.getLogger().setLevel(logging.DEBUG)

    if args.cmd == "run" or args.cmd is None:
        # Interactive run
        loop = asyncio.get_event_loop()
        runtime = AgentRuntime(model=args.model)
        try:
            loop.run_until_complete(runtime.run_interactive())
        except KeyboardInterrupt:
            logger.info("Interrupted, shutting down")
        return 0

    if args.cmd == "batch":
        import batch_runner
        batch_runner.main()
        return 0

    if args.cmd == "serve":
        import mcp_serve
        mcp_serve.main()
        return 0

    parser.print_help()
    return 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
