#!/bin/bash

echo "Exécution des migrations..."
#lance alembic en pointant vers le bon fichier de config
alembic -c ./alembic.ini upgrade head

echo "Démarrage du serveur ONUtech..."
#lance uvicorn en pointant vers src.main:app
uvicorn src.main:app --host 0.0.0.0 --port 7860