import os
from urllib.parse import urlparse, urlunparse, parse_qs, urlencode
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import sessionmaker, declarative_base

load_dotenv()

raw_url = os.getenv("DATABASE_URL")

def prepare_database_url(url: str) -> str:
    if not url:
        return "sqlite+aiosqlite:///./database.db"
    
    if url.startswith("postgresql://"):
        url = url.replace("postgresql://", "postgresql+asyncpg://", 1)
    
    u = urlparse(url)
    query = parse_qs(u.query)
    query.pop('sslmode', None) 
    
    u = u._replace(query=urlencode(query, doseq=True))
    return urlunparse(u)

SQLALCHEMY_DATABASE_URL = prepare_database_url(raw_url)

connect_args = {}
if "postgresql" in SQLALCHEMY_DATABASE_URL:
    connect_args["ssl"] = True

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    echo=False,
    connect_args=connect_args
)

AsyncSessionLocal = sessionmaker(
    bind=engine, 
    class_=AsyncSession, 
    expire_on_commit=False
)

Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        try:
            yield session
        finally:
            await session.close()