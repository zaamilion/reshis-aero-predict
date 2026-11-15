import os
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    SECRET_KEY: str = "I_WANT_TO_GET_INTO_CU"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24
    
    DATABASE_URL: str = "sqlite:///./app.db"
    
    BASE_DIR: str = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    FORECAST_CSV_PATH: str = os.path.join(BASE_DIR, "data", "seasonal_forecast.csv")
    ROUTES_CSV_PATH: str = os.path.join(BASE_DIR, "data", "routes.csv")

settings = Settings()