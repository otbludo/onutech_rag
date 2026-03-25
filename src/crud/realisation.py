import os
import shutil
from datetime import datetime
from fastapi import UploadFile
from fastapi import status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.database.models.models import Realisation
from src.schema import realisation as schemas
from src.messages.succes import format_success, MSG_RETRIEVED, MSG_CREATED, MSG_UPDATED, MSG_DELETED
from src.messages.error import format_error, NOT_FOUND_MSG, FILE_DELETE_ERROR_MSG

#-----------------------------------------------------------------------------
# recuperation
#-----------------------------------------------------------------------------
  
async def get_realisations(db: AsyncSession):
    result = await db.execute(select(Realisation))
    realisations = result.scalars().all()
    return format_success(MSG_RETRIEVED, data=realisations)

#-----------------------------------------------------------------------------
# creation
#-----------------------------------------------------------------------------

async def create_realisation(
    db: AsyncSession,
    item: schemas.RealisationCreate,
    file: UploadFile | None = None
):
    item_data = item.model_dump()

    for field_name, field_value in item_data.items():
        if field_name in {"link", "photo_url"}:
            continue
        
        if field_value is None:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=format_error(f"champs \"{field_name}\" manquant veuillez renseigner")
            )
            
        if isinstance(field_value, str) and not field_value.strip():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=format_error(f"champs \"{field_name}\" manquant veuillez renseigner")
            )
            
        if isinstance(field_value, (list, tuple)) and len(field_value) == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=format_error(f"champs \"{field_name}\" manquant veuillez renseigner")
            )
            
    if file is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=format_error("champs \"photo\" manquant veuillez renseigner")
        )

    photo_url = None
    if file:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        ext = os.path.splitext(file.filename)[1]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        photo_url = f"/static/{unique_filename}"

    item_data["photo_url"] = photo_url

    db_item = Realisation(**item_data) 
    db.add(db_item)
    await db.commit()      
    await db.refresh(db_item)
    return format_success(MSG_CREATED, data=db_item, code=status.HTTP_201_CREATED)

#-----------------------------------------------------------------------------
# mise a jour
#-----------------------------------------------------------------------------

async def update_realisation(
    db: AsyncSession,
    item_id: int,
    update_data: dict,
    file: UploadFile | None = None
):
    result = await db.execute(select(Realisation).filter(Realisation.id == item_id))
    db_item = result.scalar_one_or_none()
    
    if not db_item:
         raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=format_error(NOT_FOUND_MSG, code=status.HTTP_404_NOT_FOUND)
        )
    
    photo_url = None
    if file:
        upload_dir = "uploads"
        os.makedirs(upload_dir, exist_ok=True)

        ext = os.path.splitext(file.filename)[1]
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        photo_url = f"/static/{unique_filename}"

    if photo_url is not None:
        update_data["photo_url"] = photo_url

    if "photo_url" in update_data and db_item.photo_url:
        old_file_path = os.path.join("uploads", db_item.photo_url.replace("/static/", ""))
        if os.path.exists(old_file_path):
            try:
                os.remove(old_file_path)
            except Exception as e:
                format_error(f"{FILE_DELETE_ERROR_MSG} : {e}", status.HTTP_500_INTERNAL_SERVER_ERROR)

    for key, value in update_data.items():
        setattr(db_item, key, value)
        
    await db.commit()
    await db.refresh(db_item)
    return format_success(MSG_UPDATED, data=db_item)

#-----------------------------------------------------------------------------
# suppresion
#-----------------------------------------------------------------------------

async def delete_realisation(db: AsyncSession, item_id: int):
    result = await db.execute(select(Realisation).filter(Realisation.id == item_id))
    db_item = result.scalar_one_or_none()
    
    if not db_item:
        raise HTTPException( 
            status_code=status.HTTP_404_NOT_FOUND,
            detail=format_error(NOT_FOUND_MSG, code=status.HTTP_404_NOT_FOUND)
        )
    
    if db_item.photo_url:
        filename = db_item.photo_url.replace("/static/", "")
        file_path = os.path.join("uploads", filename)
        
        if os.path.exists(file_path):
            try:
                os.remove(file_path)
            except Exception as e:
                format_error(f"{FILE_DELETE_ERROR_MSG} : {e}", status.HTTP_500_INTERNAL_SERVER_ERROR)

    await db.delete(db_item)
    await db.commit()
    return format_success(MSG_DELETED)
