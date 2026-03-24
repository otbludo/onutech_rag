import os
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from src.database.models.models import Category
from src.messages.succes import format_success, MSG_RETRIEVED


#-----------------------------------------------------------------------------
# recuperation
#-----------------------------------------------------------------------------
  
async def get_categorys(db: AsyncSession):
    result = await db.execute(select(Category))
    category = result.scalars().all()
    return format_success(MSG_RETRIEVED, data=category)