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
- [📑 Documentation ONUtech : Mise en place du Data Lake MinIO](#-documentation-onutech--mise-en-place-du-data-lake-minio)
  - [1. Installation du Serveur](#1-installation-du-serveur)
  - [2. Configuration du Stockage (Ubuntu)](#2-configuration-du-stockage-ubuntu)
  - [3. Paramétrage des Variables d'Environnement](#3-paramétrage-des-variables-denvironnement)
  - [4. Gestion du Service Système](#4-gestion-du-service-système)
  - [5. Automatisation de l'Ingestion (Python)](#5-automatisation-de-lingestion-python)
    - [Installation des dépendances](#installation-des-dépendances)
    - [Exécution du script](#exécution-du-script)
  - [Informations de Connexion](#informations-de-connexion)

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

---

# 📑 Documentation ONUtech : Mise en place du Data Lake MinIO

Ce document récapitule les étapes d'installation et de configuration du Data Lake local sur **Ubuntu** pour les infrastructures de l'IT Pole d'ONUtech.

---

## 1. Installation du Serveur

Installation de la version **MinIO AIStor** via le paquet debian officiel.

```bash
# Téléchargement du binaire
wget [https://dl.min.io/server/minio/release/linux-amd64/archive/minio_20240321231728.0.0_amd64.deb](https://dl.min.io/server/minio/release/linux-amd64/archive/minio_20240321231728.0.0_amd64.deb)

# Installation du paquet
sudo dpkg -i minio_20240321231728.0.0_amd64.deb
```

## 2. Configuration du Stockage (Ubuntu)

Nous utilisons un dossier spécifique dans `Documents` pour faciliter la gestion visuelle des données.

```bash
# Création du répertoire de données
mkdir -p ~/Documents/minio_data

# Attribution des permissions au service système
sudo chown -R minio-user:minio-user ~/Documents/minio_data
chmod +x /home/otabela-ludovic
chmod +x /home/otabela-ludovic/Documents
```

## 3. Paramétrage des Variables d'Environnement

Configuration des accès et du point de montage des volumes.

**Fichier : `/etc/default/minio`**

```text
MINIO_VOLUMES="/home/otabela-ludovic/Documents/minio_data"
```

**Fichier : `/etc/minio/config.env`**

```text
MINIO_ROOT_USER=ludovic_admin
MINIO_ROOT_PASSWORD=votre_mot_de_passe
MINIO_LICENSE="VOTRE_CLE_DE_LICENCE"
```

## 4. Gestion du Service Système

Commandes pour piloter l'instance MinIO sur le bureau Ubuntu.

```bash
# Prise en compte des modifications
sudo systemctl daemon-reload

# Activation et démarrage
sudo systemctl enable minio
sudo systemctl start minio

# Vérification du statut
sudo systemctl status minio
```

## 5. Automatisation de l'Ingestion (Python)

Mise en place d'un script de surveillance pour synchroniser le dossier `uploads` vers le bucket `raw-data`.

### Installation des dépendances

```bash
pip install minio watchdog
```

### Exécution du script

Le script `datalake.py` effectue un scan des fichiers existants au démarrage, puis surveille les nouveaux fichiers en temps réel (événement `on_created`).

```bash
# Lancement depuis la racine du projet
python3 src/rag/storage/datalake.py
```

---

## Informations de Connexion

- **Interface Web (Console) :** `http://localhost:9001`
- **Point de terminaison API (S3) :** `http://localhost:9000`
- **Bucket Principal :** `raw-data`
