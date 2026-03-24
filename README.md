# ONUTech RAG Backend

Backend FastAPI pour un moteur RAG (retrieval‑augmented generation) + gestion de réalisations et catégories, avec stockage local SQLite et fichiers uploadés.

## Sommaire

- [Aperçu](#aperçu)
- [Fonctionnalités](#fonctionnalités)
- [Architecture rapide](#architecture-rapide)
- [API](#api)
- [Configuration](#configuration)
- [Démarrage](#démarrage)
- [Ingestion RAG](#ingestion-rag)

## Aperçu

L’application expose une API REST pour :

- poser des questions via un pipeline RAG,
- gérer des catégories,
- gérer des réalisations (CRUD + upload d’illustration).

Le stockage est local (SQLite) et la recherche RAG repose sur ChromaDB et des embeddings Gemini.

## Fonctionnalités

- **RAG** : récupération de contexte via ChromaDB + génération via Groq Llama 3.3.
- **CRUD Réalisations** : création, mise à jour et suppression avec upload de fichier.
- **Catégories** : lecture des catégories.
- **CORS** configuré pour un front local.
- **Fichiers statiques** servis depuis `uploads/`.

## Architecture rapide

- Point d’entrée FastAPI : `src/main.py`
- Middleware CORS : `src/middleware/cors.py`
- Routes API :
  - Chat/RAG : `src/routes/chat.py`
  - Catégories : `src/routes/category.py`
  - Réalisations : `src/routes/realisation.py`
- Modèles SQLAlchemy : `src/database/models/models.py`
- Accès DB : `src/database/database.py`
- RAG :
  - Génération : `src/rag/generator.py`
  - Récupération : `src/rag/retriever.py`
  - Ingestion : `src/rag/ingestion/loader.py`, `src/rag/ingestion/processor.py`
  - Stockage Chroma : `src/rag/storage/chromadb_client.py`

## API

Préfixe global : `/api/v1`

### Chat / RAG

- `POST /api/v1/ask`
  - Body JSON :
    ```json
    {
      "question": "...",
      "session_id": "<uuid>" // optionnel
    }
    ```
  - Réponse :
    ```json
    {
      "answer": {
        "question": "...",
        "answer": "...",
        "sources": ["..."]
      }
    }
    ```

### Catégories

- `GET /api/v1/category`
  - Réponse : format standard `success`.

### Réalisations

- `POST /api/v1/realisation`
  - **multipart/form-data**
  - Champs : `title`, `categorie`, `description`, `stack` (liste CSV), `link` (optionnel), `file` (optionnel)
  - Le fichier est stocké dans `uploads/` et exposé via `/static/<filename>`.

- `GET /api/v1/realisation`
  - Liste des réalisations.

- `PUT /api/v1/realisation/{item_id}`
  - Mise à jour partielle (champs non fournis conservés).

- `DELETE /api/v1/realisation/{item_id}`
  - Suppression de l’entrée + suppression de l’image si présente.

## Configuration

Copier `.env.example` vers `.env` et renseigner les clés :

```
GOOGLE_API_KEY=...
GROQ_API_KEY=...
```

## Démarrage

1. Installer les dépendances Python.
2. Lancer l’API FastAPI (ex. `uvicorn src.main:app --reload`).

La racine `/` répond : `{"status": "Backend ONUTech RAG actif"}`.

## Ingestion RAG

Pour indexer les PDFs du dossier `src/rag/data/` :

```bash
python -m src.rag.ingestion.processor
```

Le script :

1. Charge les PDFs,
2. Découpe en chunks,
3. Stocke dans ChromaDB (`./chroma_db`).
