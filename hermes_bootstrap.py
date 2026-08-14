"""
hermes_bootstrap.py
Bootstrap helpers: environment checks and simple setup tasks.
"""

import os
import sys
import logging

logger = logging.getLogger("hermes.bootstrap")


def check_python_version(min_major=3, min_minor=11):
    if sys.version_info < (min_major, min_minor):
        logger.warning("Python %s.%s+ recommended. Current: %s", min_major, min_minor, sys.version)


def ensure_env_keys(keys):
    missing = [k for k in keys if os.getenv(k) is None]
    if missing:
        logger.warning("Missing environment variables: %s", ",".join(missing))
    return missing


def main():
    logging.basicConfig(level=logging.INFO)
    check_python_version()
    ensure_env_keys(["TELEGRAM_BOT_TOKEN", "GEMINI_API_KEY"])
    logger.info("Bootstrap checks completed.")


if __name__ == "__main__":
    main()
