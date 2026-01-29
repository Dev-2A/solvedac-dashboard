import httpx
from app.config import settings


class SolvedacClient:
    def __init__(self):
        self.base_url = settings.SOLVEDAC_API_BASE_URL
    
    async def get_user(self, handle: str) -> dict:
        """사용자 기본 정보 조회"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/user/show",
                params={"handle": handle},
            )
            response.raise_for_status()
            return response.json()
    
    async def get_user_problem_stats(self, handle: str) -> list:
        """사용자의 난이도별 문제 풀이 통계"""
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/user/problem_stats",
                params={"handle": handle},
            )
            response.raise_for_status()
            return response.json()


solvedac_client = SolvedacClient()