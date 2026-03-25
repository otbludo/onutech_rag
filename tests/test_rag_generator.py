import pytest

from src.rag import generator


def test_generate_answer_returns_payload(monkeypatch):
    class DummyDoc:
        def __init__(self, content, source):
            self.page_content = content
            self.metadata = {"source": source}

    class DummyRetriever:
        def invoke(self, question):
            return [DummyDoc("ctx", "doc1.pdf"), DummyDoc("ctx2", "doc2.pdf")]

    class DummyChain:
        def invoke(self, _payload):
            return "answer"

    def fake_get_retriever():
        return DummyRetriever()

    def fake_from_template(_template):
        return object()

    class DummyPrompt:
        def __or__(self, _other):
            return self

    def fake_prompt_template(_template):
        return DummyPrompt()

    def fake_llm(*_args, **_kwargs):
        return object()

    monkeypatch.setattr(generator, "get_retriever", fake_get_retriever)
    monkeypatch.setattr(generator, "ChatGroq", fake_llm)
    monkeypatch.setattr(generator, "ChatPromptTemplate", type("X", (), {"from_template": staticmethod(fake_prompt_template)}))
    monkeypatch.setattr(generator, "StrOutputParser", lambda: object())

    class ChainBuilder:
        def __or__(self, _other):
            return DummyChain()

    monkeypatch.setattr(DummyPrompt, "__or__", lambda self, _other: ChainBuilder())

    result = generator.generate_answer("Question ?")

    assert result["question"] == "Question ?"
    assert result["answer"] == "answer"
    assert set(result["sources"]) == {"doc1.pdf", "doc2.pdf"}
