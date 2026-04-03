import shutil
from fastapi import BackgroundTasks
from datetime import datetime
from fastapi import UploadFile
from fastapi import status, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.database.models.models import Realisation
from src.schema import realisation as schemas
from src.messages.succes import format_success, MSG_RETRIEVED, MSG_CREATED, MSG_UPDATED, MSG_DELETED
from src.messages.error import format_error, NOT_FOUND_MSG
from src.crud.worker import background_upload_and_save, background_delete_image


#-----------------------------------------------------------------------------
# recuperation
#-----------------------------------------------------------------------------
  
async def get_realisations(db: AsyncSession):
    result = await db.execute(select(Realisation))
    realisations = result.scalars().all()
    return format_success(MSG_RETRIEVED, data=realisations)


#-----------------------------------------------------------------------------
# CRÉATION (Queue implémentée)
#-----------------------------------------------------------------------------
async def create_realisation(
    db: AsyncSession, 
    item: schemas.RealisationCreate, 
    background_tasks: BackgroundTasks, 
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
            detail=format_error("Le fichier image (file) est manquant.")
        )

    db_item = Realisation(**item_data) 
    db.add(db_item)
    await db.commit()      
    await db.refresh(db_item)

    temp_path = f"temp_{datetime.now().timestamp()}_{file.filename}"
    with open(temp_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    from src.database.database import AsyncSessionLocal
    background_tasks.add_task(background_upload_and_save, AsyncSessionLocal, db_item.id, temp_path)

    return format_success(MSG_CREATED, data=db_item)


#-----------------------------------------------------------------------------
# MISE À JOUR (Queue implémentée)
#-----------------------------------------------------------------------------
async def update_realisation(
    db: AsyncSession, 
    item_id: int, 
    update_data: dict, 
    background_tasks: BackgroundTasks, 
    file: UploadFile | None = None
):
    result = await db.execute(select(Realisation).filter(Realisation.id == item_id))
    db_item = result.scalar_one_or_none()
    
    if not db_item:
         raise HTTPException(status_code=404, detail=NOT_FOUND_MSG)
    
    if file:
        if db_item.photo_url:
            background_tasks.add_task(background_delete_image, db_item.photo_url)

        temp_path = f"temp_upd_{datetime.now().timestamp()}_{file.filename}"
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        from src.database.database import AsyncSessionLocal
        background_tasks.add_task(background_upload_and_save, AsyncSessionLocal, db_item.id, temp_path)

    for key, value in update_data.items():
        if key != "photo_url": 
            setattr(db_item, key, value)
        
    await db.commit()
    await db.refresh(db_item)
    return format_success(MSG_UPDATED, data=db_item)


#-----------------------------------------------------------------------------
# SUPPRESSION (Queue implémentée)
#-----------------------------------------------------------------------------
async def delete_realisation(db: AsyncSession, item_id: int, background_tasks: BackgroundTasks):
    result = await db.execute(select(Realisation).filter(Realisation.id == item_id))
    db_item = result.scalar_one_or_none()
    
    if not db_item:
        raise HTTPException(status_code=404, detail=NOT_FOUND_MSG)

    if db_item.photo_url:
        background_tasks.add_task(background_delete_image, db_item.photo_url)

    await db.delete(db_item)
    await db.commit()
    return format_success(MSG_DELETED)