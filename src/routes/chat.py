from fastapi import APIRouter
from src.schema.query import QueryRequest
from src.rag.generator import generate_answer # Ta logique de RAG

router = APIRouter()

#-----------------------------------------------------------------------------
# ask question
#-----------------------------------------------------------------------------

@router.post("/ask")
async def ask_question(request: QueryRequest):
    response = generate_answer(request.question)
    return {"answer": response}