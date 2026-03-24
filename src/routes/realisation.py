import os
import shutil
from datetime import datetime
from fastapi import File, UploadFile, Form
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import realisation as crud
from src.schema import realisation as schemas
from  src.database.database import get_db

router = APIRouter()

#-----------------------------------------------------------------------------
# creation
#-----------------------------------------------------------------------------

@router.post("/realisation")
async def create(
    title: str = Form(None),
    categorie: str = Form(None),
    description: str = Form(None),
    stack: str = Form(None),
    link: str = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    # Création du dossier et gestion du nom de fichier unique
    upload_dir = "uploads"
    os.makedirs(upload_dir, exist_ok=True)
    
    photo_url = None
    if file:
        # Extraction de l'extension originale (.jpg, .png, etc.)
        ext = os.path.splitext(file.filename)[1]

        # Génération d'un nom unique : 20260316_221530_nom_original.jpg
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join(upload_dir, unique_filename)

        # Sauvegarde physique du fichier
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        photo_url = f"/static/{unique_filename}"  # On stocke le nouveau nom
        
    # Préparation du modèle avec le lien unique
    item = schemas.RealisationCreate(
        title=title,
        categorie=categorie,
        description=description,
        stack=stack.split(","),
        link=link,
        photo_url=photo_url
    )
    
    return await crud.create_realisation(db, item)

#-----------------------------------------------------------------------------
# recuperation
#-----------------------------------------------------------------------------

@router.get("/realisation")
async def read_all(db: AsyncSession = Depends(get_db)):
    return await crud.get_realisations(db)

#-----------------------------------------------------------------------------
# mise a jour
#-----------------------------------------------------------------------------

@router.put("/realisation/{item_id}")
async def update(
    item_id: int,
    title: str = Form(None),
    categorie: str = Form(None),
    description: str = Form(None),
    stack: str = Form(None),
    link: str = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    photo_url = None
    if file:
        # Preparation du nom unique
        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        unique_filename = f"{timestamp}_{file.filename}"
        file_path = os.path.join("uploads", unique_filename)
        
        # Sauvegarde physique
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        photo_url = f"/static/{unique_filename}"

    # Inersion des champs non null
    update_data = {
        "title": title,
        "categorie": categorie,
        "description": description,
        "stack": stack.split(",") if stack else None,
        "link": link,
        "photo_url": photo_url
    }
    
    # Netoyage du dictionnaire des valeurs None pour ne pas écraser l'existant
    update_data = {k: v for k, v in update_data.items() if v is not None}

    return await crud.update_realisation(db, item_id, update_data)

#-----------------------------------------------------------------------------
# suppresion
#-----------------------------------------------------------------------------

@router.delete("/realisation/{item_id}")
async def delete(item_id: int, db: AsyncSession = Depends(get_db)):
    return await crud.delete_realisation(db, item_id)
