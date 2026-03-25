import os

from src.rag import retriever


def test_get_retriever_builds_chroma(monkeypatch):
    captured = {}

    class DummyRetriever:
        def __init__(self, search_kwargs):
            self.search_kwargs = search_kwargs

    class DummyChroma:
        def __init__(self, persist_directory, embedding_function):
            captured["persist_directory"] = persist_directory
            captured["embedding_function"] = embedding_function

        def as_retriever(self, search_kwargs):
            return DummyRetriever(search_kwargs)

    class DummyEmbeddings:
        def __init__(self, model, google_api_key):
            captured["model"] = model
            captured["google_api_key"] = google_api_key

    monkeypatch.setenv("GOOGLE_API_KEY", "test")
    monkeypatch.setattr(retriever, "Chroma", DummyChroma)
    monkeypatch.setattr(retriever, "GoogleGenerativeAIEmbeddings", DummyEmbeddings)

    retr = retriever.get_retriever()

    assert isinstance(retr, DummyRetriever)
    assert retr.search_kwargs == {"k": 100}
    assert captured["persist_directory"] == "./chroma_db"
    assert captured["model"] == "models/gemini-embedding-001"
    assert captured["google_api_key"] == os.getenv("GOOGLE_API_KEY")
