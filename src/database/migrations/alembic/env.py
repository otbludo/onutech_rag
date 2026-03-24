import sys
import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# --- CETTE SECTION DOIT ÊTRE AVANT TOUT IMPORT DE 'src' ---
# On remonte de: src/database/migrations/alembic/env.py (4 niveaux)
ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../../../'))
sys.path.insert(0, ROOT_DIR)
# ---------------------------------------------------------

# Maintenant tu peux importer src
from src.database.database import Base
from src.database.models.models import Realisation

# Configuration dynamique de l'URL SQLite
DB_PATH = os.path.join(ROOT_DIR, "src", "database", "database.db")
SQLALCHEMY_URL = f"sqlite:///{DB_PATH}"

config = context.config
config.set_main_option("sqlalchemy.url", SQLALCHEMY_URL)

# Le reste du fichier (fileConfig, run_migrations, etc.) ne change pas...
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
