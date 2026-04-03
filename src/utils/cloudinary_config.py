import os
import cloudinary
import cloudinary.uploader
from fastapi import status
from dotenv import load_dotenv
from src.messages.error import format_error, FILE_DELETE_ERROR_MSG

load_dotenv()

cloudinary.config(
    cloud_name = os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key = os.getenv("CLOUDINARY_API_KEY"),
    api_secret = os.getenv("CLOUDINARY_API_SECRET"),
    secure = True
)

def upload_image(file_path: str, folder: str = "onutech/realisations"):
    """Upload une image vers Cloudinary et retourne l'URL sécurisée."""
    try:
        response = cloudinary.uploader.upload(
            file_path, 
            folder=folder,
            resource_type="image"
        )
        return response.get("secure_url")
    except Exception as e:
        print(f"❌ Erreur Cloudinary : {e}")
        return None
    
    
def delete_image(image_url: str):
    """Supprime une image de Cloudinary à partir de son URL."""
    try:
        public_id = "/".join(image_url.split("/")[-3:]).split(".")[0]
        cloudinary.uploader.destroy(public_id)
    except Exception as e:
        format_error(f"{FILE_DELETE_ERROR_MSG} : {e}", status.HTTP_500_INTERNAL_SERVER_ERROR)