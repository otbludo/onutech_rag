#!/bin/bash
# Lancement des migrations avec Alembic
alembic upgrade head

# Lancement de FastAPI
uvicorn src.main:app --host 0.0.0.0 --port 7860