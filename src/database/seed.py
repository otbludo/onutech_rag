import asyncio
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from src.database.database import AsyncSessionLocal
from src.database.models.models import Category

CATEGORIES_TO_SEED = [
    {"title": "Intelligence Artificielle"},
    {"title": "Automatisation IT"},
    {"title": "Développement Web"},
    {"title": "Infrastructure Cloud"},
    {"title": "Cybersécurité"},
    {"title": "Solutions RAG & LLM"}
]

async def seed_categories():
    print("🌱 Initialisation du seed des catégories...")
    
    async with AsyncSessionLocal() as db:
        try:
            for cat_data in CATEGORIES_TO_SEED:
                # Vérifier si la catégorie existe déjà pour éviter les doublons
                stmt = select(Category).filter(Category.title == cat_data["title"])
                result = await db.execute(stmt)
                existing_cat = result.scalar_one_or_none()

                if not existing_cat:
                    new_cat = Category(**cat_data)
                    db.add(new_cat)
                    print(f"✅ Ajouté : {cat_data['title']}")
                else:
                    print(f"⏩ Déjà présent : {cat_data['title']}")

            # On valide toutes les insertions d'un coup
            await db.commit()
            print("🚀 Seed terminé avec succès !")
            
        except Exception as e:
            await db.rollback()
            print(f"❌ Erreur pendant le seed : {e}")
            raise e

if __name__ == "__main__":
    asyncio.run(seed_categories())