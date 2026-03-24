from sqlalchemy import Column, Integer, String, DateTime, JSON
from sqlalchemy.sql import func
from src.database.database import Base


class Realisation(Base):
    __tablename__ = "realisations"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    categorie = Column(String, nullable=False)
    photo_url = Column(String, nullable=True) 
    description = Column(String)
    stack = Column(JSON) 
    link = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    
class Category(Base):
    __tablename__ = "category"
    
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())