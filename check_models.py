import os
from dotenv import load_dotenv
import google.generativeai as genai

# Chargement des variables d'environnement
load_dotenv()

api_key = os.getenv("GOOGLE_API_KEY")
if not api_key:
    print("Erreur : GOOGLE_API_KEY non trouvée dans le .env")
    exit()

genai.configure(api_key=api_key)

print("--- RECHERCHE DES MODÈLES DISPONIBLES ---\n")

print("[1] Modèles pour les EMBEDDINGS (à mettre dans retriever.py) :")
embed_models = [m.name for m in genai.list_models() if 'embedContent' in m.supported_generation_methods]
for name in embed_models:
    print(f"  - {name}")

print("\n[2] Modèles pour la GÉNÉRATION (à mettre dans generator.py) :")
gen_models = [m.name for m in genai.list_models() if 'generateContent' in m.supported_generation_methods]
for name in gen_models:
    print(f"  - {name}")