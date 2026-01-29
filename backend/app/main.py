from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.user import router as user_router

app = FastAPI(
    title="Solved.ac Dashboard API",
    description="Solved.ac 학습 패턴 분석 및 시각화",
    version="0.1.0",
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router, prefix="/api")


@app.get("/")
async def root():
    return {"message": "Solved.ac Dashboard API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}