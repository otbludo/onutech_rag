from fastapi import status

def format_success(message: str, data=None, code: int = status.HTTP_200_OK):
    return {
        "success": True,
        "status_code": code,
        "message": message,
        "data": data
    }

MSG_RETRIEVED = "Données récupérées avec succès"
MSG_CREATED = "Création effectuée avec succès"
MSG_UPDATED = "Mise à jour effectuée avec succès"
MSG_DELETED = "Suppression effectuée avec succès"
