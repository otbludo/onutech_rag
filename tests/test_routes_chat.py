import pytest

from src.routes import chat


@pytest.mark.asyncio
async def test_ask_question_returns_answer(client, monkeypatch):
    def fake_generate_answer(question: str):
        return {"question": question, "answer": "ok", "sources": ["doc.pdf"]}

    monkeypatch.setattr(chat, "generate_answer", fake_generate_answer)

    response = await client.post("/api/v1/ask", json={"question": "Salut ?"})

    assert response.status_code == 200
    payload = response.json()
    assert payload == {"answer": {"question": "Salut ?", "answer": "ok", "sources": ["doc.pdf"]}}
