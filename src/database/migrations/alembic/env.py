import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# --- CONFIGURATION DU CHEMIN RACINE ---
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../'))
sys.path.insert(0, ROOT_DIR)

# Import de tes modèles pour l'autogénération
from src.database.database import Base
from src.database.models.models import Realisation

# --- LOGIQUE D'URL DYNAMIQUE (NEON vs SQLITE) ---
DATABASE_URL = os.getenv("DATABASE_URL")

if DATABASE_URL:
    # Alembic est synchrone : il utilise 'postgresql://' (psycopg2)
    # On nettoie l'URL au cas où elle contiendrait '+asyncpg'
    SQLALCHEMY_URL = DATABASE_URL.replace("postgresql+asyncpg://", "postgresql://")
    print("--- [ALEMBIC] : CONNEXION À NEON POSTGRESQL ---")
else:
    # Backup local pour tes tests sur ton PC
    DB_PATH = os.path.join(ROOT_DIR, "src", "database", "database.db")
    SQLALCHEMY_URL = f"sqlite:///{DB_PATH}"
    print(f"--- [ALEMBIC] : CONNEXION À SQLITE LOCALE ({DB_PATH}) ---")

config = context.config
config.set_main_option("sqlalchemy.url", SQLALCHEMY_URL)

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# ... (garde tes fonctions run_migrations_offline et online telles quelles)

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section, {}),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
