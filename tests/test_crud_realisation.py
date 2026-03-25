import io
import os
import pytest

from fastapi import HTTPException, status
from sqlalchemy import select
from starlette.datastructures import UploadFile as StarletteUploadFile

from src.crud import realisation as realisation_crud
from src.database.models.models import Realisation
from src.schema.realisation import RealisationCreate


@pytest.mark.asyncio
async def test_create_realisation_success(db_session, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    payload = RealisationCreate(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
    )
    upload = StarletteUploadFile(filename="test.png", file=io.BytesIO(b"img"))

    result = await realisation_crud.create_realisation(db_session, payload, upload)

    assert result["status_code"] == status.HTTP_201_CREATED
    assert result["data"].title == "Projet"
    assert result["data"].photo_url.startswith("/static/")
    assert os.path.exists(os.path.join("uploads", result["data"].photo_url.replace("/static/", "")))


@pytest.mark.asyncio
async def test_create_realisation_missing_fields_raises(db_session):
    payload = RealisationCreate(
        title=None,
        categorie="Web",
        description="Desc",
        stack=["Python"],
    )

    with pytest.raises(HTTPException) as exc:
        await realisation_crud.create_realisation(db_session, payload, file=None)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_create_realisation_empty_string_raises(db_session):
    payload = RealisationCreate(
        title=" ",
        categorie="Web",
        description="Desc",
        stack=["Python"],
    )

    with pytest.raises(HTTPException) as exc:
        await realisation_crud.create_realisation(db_session, payload, file=None)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_create_realisation_empty_stack_raises(db_session):
    payload = RealisationCreate(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=[],
    )

    with pytest.raises(HTTPException) as exc:
        await realisation_crud.create_realisation(db_session, payload, file=None)

    assert exc.value.status_code == status.HTTP_400_BAD_REQUEST


@pytest.mark.asyncio
async def test_get_realisations(db_session):
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

    result = await realisation_crud.get_realisations(db_session)

    assert result["success"] is True
    assert len(result["data"]) == 1


@pytest.mark.asyncio
async def test_update_realisation_success(db_session, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    item = Realisation(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
        photo_url="/static/old.png",
    )
    db_session.add(item)
    await db_session.commit()
    await db_session.refresh(item)

    os.makedirs("uploads", exist_ok=True)
    with open(os.path.join("uploads", "old.png"), "wb") as f:
        f.write(b"old")

    new_file = StarletteUploadFile(filename="new.png", file=io.BytesIO(b"new"))
    result = await realisation_crud.update_realisation(
        db_session, item.id, {"title": "Projet 2"}, new_file
    )

    assert result["success"] is True
    assert result["data"].title == "Projet 2"
    assert os.path.exists(os.path.join("uploads", result["data"].photo_url.replace("/static/", "")))


@pytest.mark.asyncio
async def test_update_realisation_file_delete_error_ignored(db_session, tmp_path, monkeypatch):
    monkeypatch.chdir(tmp_path)

    item = Realisation(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
        photo_url="/static/old.png",
    )
    db_session.add(item)
    await db_session.commit()
    await db_session.refresh(item)

    os.makedirs("uploads", exist_ok=True)
    with open(os.path.join("uploads", "old.png"), "wb") as f:
        f.write(b"old")

    def raise_remove(_path):
        raise OSError("boom")

    monkeypatch.setattr(os, "remove", raise_remove)

    new_file = StarletteUploadFile(filename="new.png", file=io.BytesIO(b"new"))
    result = await realisation_crud.update_realisation(
        db_session, item.id, {"title": "Projet 2"}, new_file
    )

    assert result["success"] is True


@pytest.mark.asyncio
async def test_update_realisation_not_found(db_session):
    with pytest.raises(HTTPException) as exc:
        await realisation_crud.update_realisation(db_session, 9999, {"title": "X"})

    assert exc.value.status_code == status.HTTP_404_NOT_FOUND


# @pytest.mark.asyncio
# async def test_delete_realisation_success(db_session, tmp_path, monkeypatch):
#     monkeypatch.chdir(tmp_path)

#     item = Realisation(
#         title="Projet",
#         categorie="Web",
#         description="Desc",
#         stack=["Python"],
#         link="https://example.com",
#         photo_url="/static/file.png",
#     )
#     db_session.add(item)
#     await db_session.commit()
#     await db_session.refresh(item)

#     os.makedirs("uploads", exist_ok=True)
#     with open(os.path.join("uploads", "file.png"), "wb") as f:
#         f.write(b"img")

#     result = await realisation_crud.delete_realisation(db_session, item.id)

#     assert result["success"] is True
#     assert not os.path.exists(os.path.join("uploads", "file.png"))

#     query = await db_session.execute(select(Realisation).filter(Realisation.id == item.id))
#     assert query.scalar_one_or_none() is None


# @pytest.mark.asyncio
# async def test_delete_realisation_file_delete_error_ignored(db_session, tmp_path, monkeypatch):
#     monkeypatch.chdir(tmp_path)

#     item = Realisation(
#         title="Projet",
#         categorie="Web",
#         description="Desc",
#         stack=["Python"],
#         link="https://example.com",
#         photo_url="/static/file.png",
#     )
#     db_session.add(item)
#     await db_session.commit()
#     await db_session.refresh(item)

#     os.makedirs("uploads", exist_ok=True)
#     with open(os.path.join("uploads", "file.png"), "wb") as f:
#         f.write(b"img")

#     def raise_remove(_path):
#         raise OSError("boom")

#     monkeypatch.setattr(os, "remove", raise_remove)

#     result = await realisation_crud.delete_realisation(db_session, item.id)

#     assert result["success"] is True


# @pytest.mark.asyncio
# async def test_delete_realisation_not_found(db_session):
#     with pytest.raises(HTTPException) as exc:
#         await realisation_crud.delete_realisation(db_session, 9999)

#     assert exc.value.status_code == status.HTTP_404_NOT_FOUND


@pytest.mark.asyncio
async def test_create_realisation_db_commit_error(db_session, monkeypatch):
    payload = RealisationCreate(
        title="Projet",
        categorie="Web",
        description="Desc",
        stack=["Python"],
        link="https://example.com",
    )

    async def raise_commit():
        raise RuntimeError("db commit error")

    monkeypatch.setattr(db_session, "commit", raise_commit)

    with pytest.raises(RuntimeError):
        await realisation_crud.create_realisation(
            db_session,
            payload,
            file=StarletteUploadFile(filename="test.png", file=io.BytesIO(b"img")),
        )


@pytest.mark.asyncio
async def test_update_realisation_db_commit_error(db_session, monkeypatch):
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

    async def raise_commit():
        raise RuntimeError("db commit error")

    monkeypatch.setattr(db_session, "commit", raise_commit)

    with pytest.raises(RuntimeError):
        await realisation_crud.update_realisation(db_session, item.id, {"title": "X"})


@pytest.mark.asyncio
async def test_delete_realisation_db_commit_error(db_session, monkeypatch):
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

    async def raise_commit():
        raise RuntimeError("db commit error")

    monkeypatch.setattr(db_session, "commit", raise_commit)

    with pytest.raises(RuntimeError):
        await realisation_crud.delete_realisation(db_session, item.id)
