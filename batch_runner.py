"""
batch_runner.py
Run simple batch jobs or evaluation trajectories concurrently.
Provides a small CLI for running a JSON list of jobs.
"""

import json
import time
import argparse
import concurrent.futures
import logging

logger = logging.getLogger("hermes.batch")


def _run_job(job):
    # job is a dict with "id" and "command" or "task"
    job_id = job.get("id") or "job"
    logger.info("Starting job %s", job_id)
    time.sleep(job.get("duration", 1))
    result = {"id": job_id, "status": "ok", "timestamp": time.time()}
    logger.info("Completed job %s", job_id)
    return result


def main(argv=None):
    parser = argparse.ArgumentParser()
    parser.add_argument("--jobs", help="Path to JSON file with list of jobs")
    args = parser.parse_args(argv)

    if not args.jobs:
        print("Please provide --jobs jobs.json")
        return

    with open(args.jobs, "r") as f:
        jobs = json.load(f)

    results = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=4) as ex:
        futures = [ex.submit(_run_job, j) for j in jobs]
        for fut in concurrent.futures.as_completed(futures):
            try:
                results.append(fut.result())
            except Exception:
                logger.exception("Job failed")

    print(json.dumps(results, indent=2))


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)
    main()
