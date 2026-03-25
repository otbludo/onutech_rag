import pytest

from src.crud import category as category_crud
from src.database.models.models import Category


@pytest.mark.asyncio
async def test_get_categorys_returns_all(db_session):
    db_session.add_all([Category(title="Web"), Category(title="Mobile")])
    await db_session.commit()

    result = await category_crud.get_categorys(db_session)

    assert result["success"] is True
    assert result["message"] == "Données récupérées avec succès"
    assert len(result["data"]) == 2
