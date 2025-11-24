from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    PROJECT_NAME: str = "Thumbnail Factory"
    API_V1_STR: str = "/api/v1"
    
    # Supabase
    SUPABASE_URL: str = ""
    SUPABASE_KEY: str = ""
    
    # Gemini
    GEMINI_API_KEY: str = ""
    
    # ByteDance/Seedream
    BYTEDANCE_API_KEY: str = ""
    
    # Fal.ai
    FAL_KEY: str = ""
    
    # Redis/Celery
    REDIS_URL: str = "redis://localhost:6379/0"

    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    return Settings()