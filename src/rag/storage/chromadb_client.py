import os
from dotenv import load_dotenv
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import Chroma

load_dotenv()

def save_to_chroma(chunks, persist_directory="./src/rag/chroma_db"):
    """
    Vectorise les morceaux de texte et les enregistre dans ChromaDB.
    """
    api_key = os.getenv("GOOGLE_API_KEY")
    if not api_key:
        raise ValueError("La clé API GOOGLE_API_KEY est manquante dans l'environnement ")
    
    print("--- Initialisation de la vectorisation (Gemini) ---")
    embeddings = GoogleGenerativeAIEmbeddings(model="models/gemini-embedding-001")
    
    print(f"--- Enregistrement dans la base locale : {persist_directory} ---")
    vectordb = Chroma.from_documents(
        documents=chunks,
        embedding=embeddings,
        persist_directory=persist_directory
    )
    
    print("--- Stockage réussi ! ---")
    return vectordb