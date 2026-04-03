---
title: Onutech Rag Backend
emoji: 🚀
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

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
    - [Base de données (Neon PostgreSQL recommandée)](#base-de-données-neon-postgresql-recommandée)
  - [Démarrage](#démarrage)
  - [Migrations (Alembic)](#migrations-alembic)
  - [Initialiser les données (seed)](#initialiser-les-données-seed)
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

```
├── alembic.ini
├── check_models.py
├── Dockerfile
├── pyproject.toml
├── README.md
├── requirements.txt
├── skills-lock.json
├── src
│   ├── crud
│   │   ├── category.py
│   │   ├── realisation.py
│   │   └── worker.py
│   ├── database
│   │   ├── database.py
│   │   ├── migrations
│   │   │   └── alembic
│   │   │       ├── env.py
│   │   │       ├── README
│   │   │       ├── script.py.mako
│   │   │       └── versions
│   │   │           ├── 6cd2edcfbab2_update_realisations_ajout_colonne_link.py
│   │   │           ├── 713c3a84db8f_initial_setup.py
│   │   │           ├── 92ea919cb1b2_message.py
│   │   │           └── fea55c801064_ajout_table_categry.py
│   │   ├── models
│   │   │   └── models.py
│   │   └── seed.py
│   ├── __init__.py
│   ├── main.py
│   ├── messages
│   │   ├── error.py
│   │   └── succes.py
│   ├── middleware
│   │   └── cors.py
│   ├── rag
│   │   ├── chroma_db
│   │   │   ├── 087d0952-b2a2-4331-ae5a-33d3e6c6b8c2
│   │   │   │   ├── data_level0.bin
│   │   │   │   ├── header.bin
│   │   │   │   ├── length.bin
│   │   │   │   └── link_lists.bin
│   │   │   └── chroma.sqlite3
│   │   ├── data
│   │   │   └── iot_cours_général.pdf
│   │   ├── generator.py
│   │   ├── ingestion
│   │   │   ├── __init__.py
│   │   │   ├── loader.py
│   │   │   └── processor.py
│   │   ├── __init__.py
│   │   ├── retriever.py
│   │   ├── storage
│   │   │   └── chromadb_client.py
│   │   └── test_rag.py
│   ├── routes
│   │   ├── category.py
│   │   ├── chat.py
│   │   └── realisation.py
│   ├── schema
│   │   ├── query.py
│   │   └── realisation.py
│   └── utils
│       └── cloudinary_config.py
└── start.sh

```

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

### Base de données (Neon PostgreSQL recommandée)

La base est configurée via la variable d’environnement `DATABASE_URL` (ou `TEST_DATABASE_URL` pour les tests). Exemple Neon :

```bash
DATABASE_URL=postgresql://<user>:<password>@<host>/<db>?sslmode=require
```

Pour un fallback local SQLite (développement hors ligne) :

```bash
DATABASE_URL=sqlite+aiosqlite:///./src/database/database.db
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
