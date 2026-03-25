import io
import pytest
from sqlalchemy import select

from src.database.models.models import Realisation


@pytest.mark.asyncio
async def test_create_realisation_success(client):
    response = await client.post(
        "/api/v1/realisation",
        data={
            "title": "Projet A",
            "categorie": "Web",
            "description": "Desc",
            "stack": "Python,FastAPI",
            "link": "https://example.com",
        },
        files={"file": ("test.png", io.BytesIO(b"img"), "image/png")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["title"] == "Projet A"
    assert payload["data"]["photo_url"].startswith("/static/")


@pytest.mark.asyncio
async def test_create_realisation_missing_photo_returns_400(client):
    response = await client.post(
        "/api/v1/realisation",
        data={
            "title": "Projet A",
            "categorie": "Web",
            "description": "Desc",
            "stack": "Python,FastAPI",
        },
    )

    assert response.status_code == 400
    payload = response.json()
    assert payload["success"] is False


@pytest.mark.asyncio
async def test_create_realisation_missing_field_returns_400(client):
    response = await client.post(
        "/api/v1/realisation",
        data={
            "categorie": "Web",
            "description": "Desc",
            "stack": "Python,FastAPI",
        },
        files={"file": ("test.png", io.BytesIO(b"img"), "image/png")},
    )

    assert response.status_code == 400
    payload = response.json()
    assert payload["success"] is False


@pytest.mark.asyncio
async def test_get_realisations(client, db_session):
    db_session.add(
        Realisation(
            title="Projet",
            categorie="Web",
            description="Desc",
            stack=["Python"],
            link="https://example.com",
            photo_url="/static/file.png",
        )
    )
    await db_session.commit()

    response = await client.get("/api/v1/realisation")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert len(payload["data"]) == 1


@pytest.mark.asyncio
async def test_update_realisation_success(client, db_session):
    item = Realisation(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
        photo_url="/static/file.png",
    )
    db_session.add(item)
    await db_session.commit()
    await db_session.refresh(item)

    response = await client.put(
        f"/api/v1/realisation/{item.id}",
        data={"title": "Projet B"},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["title"] == "Projet B"


@pytest.mark.asyncio
async def test_update_realisation_with_file(client, db_session, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    item = Realisation(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
        photo_url="/static/file.png",
    )
    db_session.add(item)
    await db_session.commit()
    await db_session.refresh(item)

    response = await client.put(
        f"/api/v1/realisation/{item.id}",
        data={"title": "Projet C"},
        files={"file": ("new.png", io.BytesIO(b"img"), "image/png")},
    )

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True
    assert payload["data"]["photo_url"].startswith("/static/")


@pytest.mark.asyncio
async def test_update_realisation_not_found(client):
    response = await client.put(
        "/api/v1/realisation/9999",
        data={"title": "Projet B"},
    )

    assert response.status_code == 404
    payload = response.json()
    assert payload["success"] is False


@pytest.mark.asyncio
async def test_delete_realisation_success(client, db_session):
    item = Realisation(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
        photo_url="/static/file.png",
    )
    db_session.add(item)
    await db_session.commit()
    await db_session.refresh(item)

    response = await client.delete(f"/api/v1/realisation/{item.id}")

    assert response.status_code == 200
    payload = response.json()
    assert payload["success"] is True

    result = await db_session.execute(select(Realisation).filter(Realisation.id == item.id))
    assert result.scalar_one_or_none() is None


@pytest.mark.asyncio
async def test_delete_realisation_not_found(client):
    response = await client.delete("/api/v1/realisation/9999")

    assert response.status_code == 404
    payload = response.json()
    assert payload["success"] is False
