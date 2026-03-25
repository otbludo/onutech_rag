import os
from dotenv import load_dotenv
from langchain_chroma import Chroma
from langchain_google_genai import GoogleGenerativeAIEmbeddings

load_dotenv()

def get_retriever():
    embeddings = GoogleGenerativeAIEmbeddings(
        model="models/gemini-embedding-001",
        google_api_key=os.getenv("GOOGLE_API_KEY")
    )
    
    vectordb = Chroma(
        persist_directory="./chroma_db", 
        embedding_function=embeddings
    )
    """ nombre de morceau envoyer au model"""
    return vectordb.as_retriever(search_kwargs={"k": 100})