#!/bin/bash
set -e

# Migrations Neon (SQL)
echo "--- [MIGRATIONS NEON] ---"
alembic upgrade head

# Lancement FastAPI
echo "--- [STARTING SERVER] ---"
uvicorn src.main:app --host 0.0.0.0 --port 7860