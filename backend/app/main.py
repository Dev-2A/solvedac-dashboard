from fastapi import FastAPI

app = FastAPI(
    title="Solved.ac Dashboard API",
    description="Solved.ac 학습 패턴 분석 및 시각화",
    version="0.1.0",
)


@app.get("/")
async def root():
    return {"message": "Solved.ac Dashboard API"}


@app.get("/health")
async def health_check():
    return {"status": "healthy"}