import os
from sqlalchemy.future import select
from src.database.models.models import Realisation
from src.utils.cloudinary_config import upload_image, delete_image


async def background_upload_and_save(db_factory, item_id, temp_path):
    """Gère l'upload et met à jour l'URL dans Neon une fois fini."""
    photo_url = upload_image(temp_path)
    if photo_url:
        async with db_factory() as db:
            result = await db.execute(select(Realisation).filter(Realisation.id == item_id))
            db_item = result.scalar_one_or_none()
            if db_item:
                db_item.photo_url = photo_url
                await db.commit()
    if os.path.exists(temp_path):
        os.remove(temp_path)

async def background_delete_image(photo_url: str):
    """Supprime l'image de Cloudinary sans bloquer la réponse API."""
    delete_image(photo_url)