from fastapi import FastAPI, HTTPException, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import JSONResponse
from src.middleware.cors import setup_cors
from src.routes.chat import router as chat_router
from src.routes.category import router as category_router
from src.routes.realisation import router as realisation_router

app = FastAPI()

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and "success" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(status_code=exc.status_code, content={"detail": exc.detail})

setup_cors(app)

app.include_router(chat_router, prefix="/api/v1")
app.include_router(category_router, prefix="/api/v1")
app.include_router(realisation_router, prefix="/api/v1")

@app.get("/")
def read_root():
    return {"status": "Backend ONUTech RAG actif"}
