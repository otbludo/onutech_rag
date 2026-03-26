import os
from dotenv import load_dotenv
import time
from minio import Minio
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

load_dotenv()

# --- CONFIGURATION ---
MINIO_URL = os.getenv("MINIO_URL")
ACCESS_KEY = os.getenv("ACCESS_KEY")
SECRET_KEY = os.getenv("SECRET_KEY")
BUCKET_NAME = "raw-data"

# Chemin absolu du dossier à surveiller sur votre Ubuntu
WATCH_DIRECTORY = os.getenv("WATCH_DIRECTORY")

# Initialisation du client MinIO (S3 compatible)
client = Minio(
    MINIO_URL,
    access_key=ACCESS_KEY,
    secret_key=SECRET_KEY,
    secure=False
)

class DataLakeHandler(FileSystemEventHandler):
    """Gestionnaire d'événements pour le système de fichiers"""
    
    def on_created(self, event):
        # Déclenché lorsqu'un nouveau fichier est créé/copié dans le dossier
        if not event.is_directory:
            self.upload_to_minio(event.src_path)

    def upload_to_minio(self, file_path):
        """Logique d'envoi vers le Data Lake"""
        file_name = os.path.basename(file_path)
        
        # Pause de sécurité pour garantir que l'écriture du fichier est terminée
        time.sleep(1) 
        
        try:
            print(f"🚀 Traitement de : {file_name}")
            # fput_object copie le fichier local vers le bucket MinIO
            client.fput_object(BUCKET_NAME, file_name, file_path)
            print(f"✅ {file_name} synchronisé avec succès.")
            
        except Exception as err:
            print(f"❌ Erreur lors de la synchronisation de {file_name} : {err}")

if __name__ == "__main__":
    # 1. Préparation de l'environnement local et distant
    if not os.path.exists(WATCH_DIRECTORY):
        os.makedirs(WATCH_DIRECTORY)

    if not client.bucket_exists(BUCKET_NAME):
        client.make_bucket(BUCKET_NAME)

    handler = DataLakeHandler()
    
    # 2. Scan initial : Synchronise les fichiers déjà présents avant le lancement
    print(f"🔍 Scan initial de : {WATCH_DIRECTORY}...")
    for filename in os.listdir(WATCH_DIRECTORY):
        path = os.path.join(WATCH_DIRECTORY, filename)
        if os.path.isfile(path):
            handler.upload_to_minio(path)

    # 3. Mise en place de la surveillance en temps réel
    observer = Observer()
    observer.schedule(handler, WATCH_DIRECTORY, recursive=False)
    
    print(f"\n📡 Surveillance active sur : {WATCH_DIRECTORY}")
    print("💡 En attente de nouveaux fichiers... (Ctrl+C pour arrêter)")
    
    observer.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()
        print("\n🛑 Arrêt de la surveillance.")
    observer.join()