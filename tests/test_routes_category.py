import pytest

from src.database.models.models import Category


@pytest.mark.asyncio
async def test_get_categories_empty(client):
    response = await client.get("/api/v1/category")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"] == []


@pytest.mark.asyncio
async def test_get_categories_returns_items(client, db_session):
    db_session.add_all(
        [Category(title="Web"), Category(title="Mobile")]
    )
    await db_session.commit()

    response = await client.get("/api/v1/category")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert len(payload["data"]) == 2
