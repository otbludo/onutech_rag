from pydantic import BaseModel, ConfigDict
from typing import List, Optional
from datetime import datetime

class RealisationBase(BaseModel):
    title: Optional[str] = None
    categorie: Optional[str] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None
    stack: Optional[List[str]] = None
    link: Optional[str] = None

class RealisationCreate(RealisationBase):
    pass

class RealisationUpdate(BaseModel):
    title: Optional[str] = None
    categorie: Optional[str] = None
    description: Optional[str] = None
    photo_url: Optional[str] = None
    stack: Optional[List[str]] = None
    link: Optional[str] = None

    
    
    