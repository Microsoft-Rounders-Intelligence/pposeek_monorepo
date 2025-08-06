# resumeHelper/config/settings.py
from pydantic_settings import BaseSettings
import os
class AppSettings(BaseSettings):
    EMBEDDING_DEPLOYMENT: str
    EMBEDDING_API_KEY: str
    EMBEDDING_API_VERSION: str
    EMBEDDING_ENDPOINT: str
    EMBEDDING_CHUNK_SIZE: int

    LLM_DEPLOYMENT: str
    LLM_API_KEY: str
    LLM_API_VERSION: str
    LLM_ENDPOINT: str
    LLM_TEMPERATURE: float

    class Config:
        env_file = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
        env_file_encoding = "utf-8"

settings = AppSettings()
