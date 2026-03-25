from langchain_community.document_loaders import PyPDFLoader
import os

def load_all_pdfs(directory_path: str):
    all_documents = []
    
    if not os.path.exists(directory_path):
        return []

    for filename in os.listdir(directory_path):
        if filename.endswith(".pdf"):
            file_path = os.path.join(directory_path, filename)
            try:
                loader = PyPDFLoader(file_path)
                docs = loader.load()
                
                """Ajout du nom du fichier dans les métadonnées de chaque page"""
                for doc in docs:
                    doc.metadata["source"] = filename
                
                all_documents.extend(docs)
                print(f"Chargé : {filename} ({len(docs)} pages)")
            except Exception as e:
                print(f"Erreur sur {filename}: {e}")
                
    return all_documents