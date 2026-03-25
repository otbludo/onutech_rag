import pytest

from src.rag.storage import chromadb_client


def test_save_to_chroma_raises_without_api_key(monkeypatch):
    monkeypatch.delenv("GOOGLE_API_KEY", raising=False)

    with pytest.raises(ValueError):
        chromadb_client.save_to_chroma(chunks=["x"], persist_directory="/tmp/chroma")


def test_save_to_chroma_success(monkeypatch):
    monkeypatch.setenv("GOOGLE_API_KEY", "test")

    class DummyEmbeddings:
        def __init__(self, model):
            self.model = model

    class DummyChroma:
        @classmethod
        def from_documents(cls, documents, embedding, persist_directory):
            return {"documents": documents, "embedding": embedding, "persist_directory": persist_directory}

    monkeypatch.setattr(chromadb_client, "GoogleGenerativeAIEmbeddings", DummyEmbeddings)
    monkeypatch.setattr(chromadb_client, "Chroma", DummyChroma)

    result = chromadb_client.save_to_chroma(["chunk"], persist_directory="/tmp/chroma")

    assert result["documents"] == ["chunk"]
    assert result["persist_directory"] == "/tmp/chroma"
