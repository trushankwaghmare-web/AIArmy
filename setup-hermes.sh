#!/usr/bin/env bash
# setup-hermes.sh
# Bootstrap environment for Hermes agent
set -euo pipefail

PYTHON=${HERMES_PYTHON:-python3}
VENV_DIR=${HERMES_VENV:-.venv}

echo "Creating virtualenv in $VENV_DIR with $PYTHON"
$PYTHON -m venv "$VENV_DIR"
source "$VENV_DIR/bin/activate"

echo "Upgrading pip"
pip install --upgrade pip setuptools wheel

# Core lightweight dependencies for basic functionality (no heavy ML libs)
pip install "typer[all]" pyyaml

cat > requirements-extra.txt <<'REQ'
# Optional extras used by Hermes components
uvicorn
websockets
aiohttp
python-dotenv
requests
REQ

if [ "$1" = "full" ]; then
  echo "Installing full optional requirements (uvicorn, websockets, aiohttp...)"
  pip install -r requirements-extra.txt
else
  echo "Skipping optional extras. Re-run with './setup-hermes.sh full' to install them."
fi

echo "Bootstrap complete. Activate the virtualenv with: source $VENV_DIR/bin/activate"
