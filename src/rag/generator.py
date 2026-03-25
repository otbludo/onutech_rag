import os
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from src.rag.retriever import get_retriever

load_dotenv()

def generate_answer(question: str):
    retriever = get_retriever()
 
    llm = ChatGroq(
        model="llama-3.3-70b-versatile",
        temperature=0.3,
        groq_api_key=os.getenv("GROQ_API_KEY")
    )
    
    prompt = ChatPromptTemplate.from_template("""
    Tu es un assistant technique expert. Réponds à la question en utilisant le contexte fourni.
    Si la réponse n'est pas dans le contexte, dis poliment que tu ne sais pas.
    
    Contexte : {context}
    
    Question : {question}
    """)

    """Chaîne de traitement"""
    chain = prompt | llm | StrOutputParser()
    
    """Récupération et exécution"""
    docs = retriever.invoke(question)
    context_text = "\n\n".join([doc.page_content for doc in docs])
    answer = chain.invoke({"context": context_text, "question": question})
    
    return {
        "question": question,
        "answer": answer,
        "sources": list(set([doc.metadata.get("source", "Inconnue") for doc in docs]))
    }