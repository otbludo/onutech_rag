# ONUTech RAG Backend

Backend FastAPI pour un moteur RAG (retrieval‑augmented generation) + gestion de réalisations et catégories, avec stockage local SQLite et fichiers uploadés.

## Sommaire

- [ONUTech RAG Backend](#onutech-rag-backend)
  - [Sommaire](#sommaire)
  - [Aperçu](#aperçu)
  - [Fonctionnalités](#fonctionnalités)
  - [Architecture rapide](#architecture-rapide)
  - [API](#api)
    - [Chat / RAG](#chat--rag)
    - [Catégories](#catégories)
    - [Réalisations](#réalisations)
  - [Configuration](#configuration)
    - [Base de données SQLite](#base-de-données-sqlite)
  - [Démarrage](#démarrage)
  - [Migrations (Alembic)](#migrations-alembic)
  - [Initialiser les données (seed)](#initialiser-les-données-seed)
  - [Ingestion RAG](#ingestion-rag)
  - [Tests](#tests)

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

### Base de données SQLite

La base est configurée via la variable d’environnement `DATABSE_URL` (orthographe identique au code).

Exemple pour SQLite (fichier local) :

```bash
DATABSE_URL=sqlite+aiosqlite:///./src/database/database.db
```

## Démarrage

1. Installer les dépendances Python.
2. Lancer l’API FastAPI (ex. `uvicorn src.main:app --reload`).

La racine `/` répond : `{"status": "Backend ONUTech RAG actif"}`.

## Migrations (Alembic)

Les migrations sont stockées dans `src/database/migrations/`.

Commandes usuelles :

```bash
alembic -c src/database/migrations/alembic.ini revision --autogenerate -m "message"
alembic -c src/database/migrations/alembic.ini upgrade head
alembic -c src/database/migrations/alembic.ini downgrade -1
```

## Initialiser les données (seed)

Exécuter le script de seed :

```bash
PYTHONPATH=. python src/database/seed.py
```

## Ingestion RAG

Pour indexer les PDFs du dossier `src/rag/data/` :

```bash
python -m src.rag.ingestion.processor
```

Le script :

1. Charge les PDFs,
2. Découpe en chunks,
3. Stocke dans ChromaDB (`./chroma_db`).

## Tests

Installer les dépendances (incluant `pytest`, `pytest-asyncio`, `pytest-cov`) :

```bash
pip install -r requirements.txt
```

Lancer tous les tests :

```bash
pytest tests/
```

Lancer la couverture de code :

```bash
pytest --cov=src
```

Exemple de couverture actuelle (résumé) :

```
TOTAL                                  336     30    91%
```

Générer un rapport HTML :

```bash
pytest --cov=src --cov-report=html
```

Puis ouvrir : `htmlcov/index.html` ou `xdg-open htmlcov/index.html`
