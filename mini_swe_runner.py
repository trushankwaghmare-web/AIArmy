"""
mini_swe_runner.py
Small wrapper to run single benchmark or software engineering task in an isolated process.
"""

import subprocess
import argparse
import logging

logger = logging.getLogger("hermes.mini_swe")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("script", help="Script or command to run")
    args = parser.parse_args()

    cmd = args.script
    logger.info("Running mini task: %s", cmd)
    try:
        res = subprocess.run(cmd, shell=True, check=True, capture_output=True, text=True)
        print(res.stdout)
        logger.info("Task completed")
    except subprocess.CalledProcessError as e:
        logger.error("Task failed: %s", e)
        print(e.stderr)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
