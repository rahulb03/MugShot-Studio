from fastapi import FastAPI
from app.core.config import get_settings
from app.api.v1.endpoints import projects, jobs, assets

settings = get_settings()

app = FastAPI(title=settings.PROJECT_NAME)

# Include routers (commented out until created)
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["projects"])
app.include_router(jobs.router, prefix=f"{settings.API_V1_STR}/jobs", tags=["jobs"])
app.include_router(assets.router, prefix=f"{settings.API_V1_STR}/assets", tags=["assets"])

@app.get("/")
def read_root():
    return {"message": "Thumbnail Factory API is running"}
