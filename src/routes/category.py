from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from src.crud import category as crud
from  src.database.database import get_db

router = APIRouter()

#-----------------------------------------------------------------------------
# get catecory
#-----------------------------------------------------------------------------

@router.get("/category")
async def read_all(db: AsyncSession = Depends(get_db)):
    return await crud.get_categorys(db)