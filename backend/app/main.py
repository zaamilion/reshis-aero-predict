from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from .database import engine, Base
from .data_manager import data_manager
from .routers import auth_router, forecast_router

Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting up... Loading ML datasets.")
    data_manager.load_data()
    yield
    print("Shutting down...")

app = FastAPI(
    title="Reshis Avia - Dynamic Pricing API", 
    description="Backend for dynamic pricing prediction model",
    version="1.0.0",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # можете потыкать бэкенд в сваггере ip:8000/docs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Подключаем наши роутеры
app.include_router(auth_router.router)
app.include_router(forecast_router.router)

@app.get("/ping")
def read_root():
    return {"status": "ok", "message": "Reshis Avia API is running"}