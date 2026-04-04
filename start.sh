#!/bin/bash
set -e

# ingestion des documents
echo "--- [ONUtech] Ingestion des documents en cours ---"
RUN python -m src.rag.ingestion.processor

# Migrations Neon (SQL)
echo "--- [MIGRATIONS NEON] ---"
alembic upgrade head

# Lancement FastAPI
echo "--- [STARTING SERVER] ---"
uvicorn src.main:app --host 0.0.0.0 --port 7860