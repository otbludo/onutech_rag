FROM python:3.12-slim

WORKDIR /app

# Installation des dépendances système (nécessaires pour ChromaDB et psycopg2)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Création du dossier pour ChromaDB si nécessaire
RUN mkdir -p /app/src/rag/chroma_db && chmod 777 /app/src/rag/chroma_db

# Port imposé par Hugging Face
EXPOSE 7860

# Commande de démarrage via ton start.sh
CMD ["/bin/bash", "start.sh"]