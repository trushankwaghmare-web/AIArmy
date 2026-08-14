"""
hermes_logging.py
Configure structured logging for Hermes processes.
"""

import logging


def configure_logging(level: str = "INFO"):
    numeric = getattr(logging, level.upper(), logging.INFO)
    root = logging.getLogger()
    root.setLevel(numeric)

    if not root.handlers:
        h = logging.StreamHandler()
        fmt = logging.Formatter("%(asctime)s %(levelname)s [%(name)s] %(message)s")
        h.setFormatter(fmt)
        root.addHandler(h)


# Convenience quick-config on import
configure_logging()
