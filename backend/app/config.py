from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    SOLVEDAC_API_BASE_URL: str = "https://solved.ac/api/v3"
    
    class Config:
        env_file = ".env"


settings = Settings()