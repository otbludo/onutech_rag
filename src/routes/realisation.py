from fastapi import BackgroundTasks
from fastapi import File, UploadFile, Form
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import realisation as crud
from src.schema import realisation as schemas
from src.database.database import get_db

router = APIRouter()

#-----------------------------------------------------------------------------
# creation
#-----------------------------------------------------------------------------

@router.post("/realisation")
async def create(
    background_tasks: BackgroundTasks,
    title: str = Form(None),
    categorie: str = Form(None),
    description: str = Form(None),
    stack: str = Form(None),
    link: str = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    item = schemas.RealisationCreate(
        title=title,
        categorie=categorie,
        description=description,
        stack=stack.split(",") if stack else None,
        link=link,
        photo_url=None
    )

    return await crud.create_realisation(db, item, background_tasks, file)

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
    background_tasks: BackgroundTasks,
    item_id: int,
    title: str = Form(None),
    categorie: str = Form(None),
    description: str = Form(None),
    stack: str = Form(None),
    link: str = Form(None),
    file: UploadFile = File(None),
    db: AsyncSession = Depends(get_db)
):
    update_data = {
        "title": title,
        "categorie": categorie,
        "description": description,
        "stack": stack.split(",") if stack else None,
        "link": link
    }

    update_data = {k: v for k, v in update_data.items() if v is not None}
    return await crud.update_realisation(db, item_id, update_data, background_tasks, file)

#-----------------------------------------------------------------------------
# suppresion
#-----------------------------------------------------------------------------

@router.delete("/realisation/{item_id}")
async def delete(
    background_tasks: BackgroundTasks,
    item_id: int, db: AsyncSession = Depends(get_db)
):
    return await crud.delete_realisation(db, item_id, background_tasks)
