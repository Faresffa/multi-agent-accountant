"""
Configuration de l'application - Toutes les variables viennent du .env
"""
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # Application
    APP_NAME: str
    DEBUG: bool
    SECRET_KEY: str
    
    # Database PostgreSQL
    DATABASE_URL: str
    
    # JWT Authentication
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Supabase
    SUPABASE_URL: str
    SUPABASE_SERVICE_KEY: str
    
    # Groq API
    GROQ_API_KEY: str
    MODEL_NAME_analyse: str
    
    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()

