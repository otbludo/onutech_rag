import os
from langchain_text_splitters import RecursiveCharacterTextSplitter
# Import relatif pour exécution en module (python -m src.rag.ingestion.processor)
from .loader import load_all_pdfs
from ..storage.chromadb_client import save_to_chroma

def process_data(directory_path: str):
    print("--- Début de l'ingestion ---")
    
    # Chargement
    documents = load_all_pdfs(directory_path)
    if not documents:
        print("Aucun document trouvé.")
        return []

    # Découpage (Chunking)
    # chunk_overlap permet de garder un peu de contexte entre deux morceaux
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=500, 
        chunk_overlap=50
    )
    chunks = splitter.split_documents(documents)
    
    print(f"--- Ingestion terminée : {len(chunks)} morceaux créés ---")
    return chunks

if __name__ == "__main__":
    data_path = "src/rag/data"
    
    base_path = os.getcwd() 
    full_path = os.path.join(base_path, data_path)

    print(f"Recherche des documents dans : {full_path}")
    
    chunks = process_data(full_path)
    
    if chunks:
        print(f"--- Envoi vers ChromaDB ---")
        save_to_chroma(chunks)
        print(f"Exemple : {chunks[0].page_content[:100]}...")