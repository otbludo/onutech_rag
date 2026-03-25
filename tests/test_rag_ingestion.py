import os
import pytest

from src.rag.ingestion import loader, processor


def test_load_all_pdfs_returns_empty_for_missing_dir(tmp_path):
    result = loader.load_all_pdfs(str(tmp_path / "missing"))
    assert result == []


def test_load_all_pdfs_ignores_non_pdf(tmp_path, monkeypatch):
    (tmp_path / "file.txt").write_text("hello")

    result = loader.load_all_pdfs(str(tmp_path))
    assert result == []


def test_load_all_pdfs_loads_pdf(tmp_path, monkeypatch):
    class DummyDoc:
        def __init__(self):
            self.metadata = {}

    class DummyLoader:
        def __init__(self, _path):
            pass

        def load(self):
            return [DummyDoc(), DummyDoc()]

    (tmp_path / "test.pdf").write_bytes(b"%PDF-1.4")
    monkeypatch.setattr(loader, "PyPDFLoader", DummyLoader)

    docs = loader.load_all_pdfs(str(tmp_path))

    assert len(docs) == 2
    assert all(doc.metadata["source"] == "test.pdf" for doc in docs)


def test_process_data_returns_empty_when_no_docs(tmp_path, monkeypatch):
    monkeypatch.setattr(processor, "load_all_pdfs", lambda _path: [])

    result = processor.process_data(str(tmp_path))

    assert result == []


def test_process_data_splits_documents(tmp_path, monkeypatch):
    class DummyDoc:
        def __init__(self, content):
            self.page_content = content

    class DummySplitter:
        def __init__(self, chunk_size, chunk_overlap):
            self.chunk_size = chunk_size
            self.chunk_overlap = chunk_overlap

        def split_documents(self, docs):
            return ["chunk1", "chunk2"]

    monkeypatch.setattr(processor, "load_all_pdfs", lambda _path: [DummyDoc("doc")])
    monkeypatch.setattr(processor, "RecursiveCharacterTextSplitter", DummySplitter)

    result = processor.process_data(str(tmp_path))

    assert result == ["chunk1", "chunk2"]
