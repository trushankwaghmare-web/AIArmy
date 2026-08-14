"""
mcp_serve.py
A minimal WebSocket-based MCP (Model Context Protocol) stub server.
This is a lightweight placeholder suitable for development/testing.
"""

import asyncio
import logging
import os
import json
from typing import Dict

logger = logging.getLogger("hermes.mcp")


async def _echo_handler(reader, writer):
    # Very small TCP-based placeholder to emulate MCP messages
    addr = writer.get_extra_info('peername')
    logger.info("MCP connection from %s", addr)
    writer.write(b"MCP stub connected\n")
    await writer.drain()
    try:
        while True:
            data = await reader.readline()
            if not data:
                break
            text = data.decode().strip()
            logger.debug("Received: %s", text)
            resp = json.dumps({"echo": text}) + "\n"
            writer.write(resp.encode())
            await writer.drain()
    except Exception:
        logger.exception("MCP handler error")
    finally:
        writer.close()
        await writer.wait_closed()
        logger.info("MCP connection closed %s", addr)


def main(host: str = "127.0.0.1", port: int = 8765):
    logging.basicConfig(level=logging.INFO)
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    server = asyncio.start_server(_echo_handler, host, port)
    logger.info("Starting MCP stub server on %s:%d", host, port)
    try:
        loop.run_until_complete(server)
        loop.run_forever()
    except KeyboardInterrupt:
        logger.info("MCP server interrupted, shutting down")
    finally:
        loop.stop()
        loop.close()


if __name__ == "__main__":
    main()
