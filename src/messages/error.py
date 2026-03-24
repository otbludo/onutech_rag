from fastapi import status

def format_error(message: str, code: int = status.HTTP_400_BAD_REQUEST):
    return {
        "success": False,
        "status_code": code,
        "message": message
    }

NOT_FOUND_MSG = "Réalisation introuvable"
FILE_DELETE_ERROR_MSG = "Erreur lors de la suppression du fichier"
