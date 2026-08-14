"""
trajectory_compressor.py
Simple trajectory/context compressor utilities (placeholder)
"""

import zlib
import base64
from typing import List


def compress_trajectory(messages: List[str]) -> str:
    joined = "\n".join(messages)
    compressed = zlib.compress(joined.encode("utf-8"))
    return base64.b64encode(compressed).decode("ascii")


def decompress_trajectory(token: str) -> List[str]:
    raw = base64.b64decode(token)
    decompressed = zlib.decompress(raw).decode("utf-8")
    return decompressed.splitlines()


if __name__ == "__main__":
    t = ["hello","second","third"]
    c = compress_trajectory(t)
    print(c)
    print(decompress_trajectory(c))
