from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CareerPulse"
    SECRET_KEY: str = "dev-secret-key-change-in-production-123456789"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7
    API_V1_PREFIX: str = "/api/v1"

    class Config:
        env_file = ".env"

settings = Settings()