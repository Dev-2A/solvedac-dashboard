from fastapi import APIRouter, HTTPException
from app.services.solvedac_client import solvedac_client
from app.schemas.user import UserProfile, ProblemStat, TagStat, GrassDay, GrassData, Problem, ProblemList

router = APIRouter(prefix="/user", tags=["User"])


@router.get("/{handle}", response_model=UserProfile)
async def get_user_profile(handle: str):
    """사용자 프로필 조회"""
    try:
        data = await solvedac_client.get_user(handle)
        return UserProfile(
            handle=data["handle"],
            bio=data.get("bio"),
            solved_count=data.get("solvedCount", 0),
            tier=data.get("tier", 0),
            rating=data.get("rating", 0),
            ranking=data.get("rank"),
            max_streak=data.get("maxStreak", 0),
            profile_image_url=data.get("profileImageUrl"),
        )
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User not found: {handle}")


@router.get("/{handle}/stats", response_model=list[ProblemStat])
async def get_user_problem_stats(handle: str):
    """사용자 난이도별 문제 풀이 통계"""
    try:
        data = await solvedac_client.get_user_problem_stats(handle)
        return [
            ProblemStat(
                level=item["level"],
                total=item["total"],
                solved=item["solved"],
            )
            for item in data
        ]
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User not found: {handle}")


@router.get("/{handle}/tags", response_model=list[TagStat])
async def get_user_tag_stats(handle: str):
    """사용자 태그별 문제 풀이 통계"""
    try:
        data = await solvedac_client.get_user_tag_stats(handle)
        result = []
        for item in data.get("items", []):
            tag = item.get("tag", {})
            # 한국어 이름 우선, 없으면 영어
            display_names = tag.get("displayNames", [])
            tag_name = tag.get("key", "unknown")
            for name in display_names:
                if name.get("language") == "ko":
                    tag_name = name.get("name", tag_name)
                    break
            result.append(
                TagStat(
                    tag_key=tag.get("key", "unknown"),
                    tag_name=tag_name,
                    solved=item.get("solved", 0),
                    rating=item.get("rating", 0),
                )
            )
        return result
    except Exception as e:
        raise HTTPException(status_code=404, detail=f"User not found: {handle}")


@router.get("/{handle}/grass", response_model=GrassData)
async def get_user_grass(handle: str):
    """사용자 잔디(스트릭) 정보"""
    try:
        data = await solvedac_client.get_user_grass(handle)
        print("Grass API 응답:", data)  # 디버깅용
        grass = [
            GrassDay(date=item["date"], value=item["value"])
            for item in data.get("grass", [])
        ]
        return GrassData(
            grass=grass,
            current_streak=data.get("currentStreak", 0),
            longest_streak=data.get("longestStreak", 0),
        )
    except Exception as e:
        print("Grass API 에러:", e)  # 디버깅용
        raise HTTPException(status_code=404, detail=f"User not found: {handle}")


@router.get("/{handle}/problems", response_model=ProblemList)
async def get_user_top_problems(handle: str):
    """사용자가 푼 문제 목록 (난이도 높은 순)"""
    try:
        data = await solvedac_client.get_user_top_problems(handle)
        print("Problems API 응답:", data)  # 응답 확인
        items = []
        for item in data.get("items", [])[:10]:  # 상위 10개만
            tags = []
            for tag in item.get("tags", []):
                display_names = tag.get("displayNames", [])
                for name in display_names:
                    if name.get("language") == "ko":
                        tags.append(name.get("name", tag.get("key", "")))
                        break
            items.append(
                Problem(
                    problem_id=item.get("problemId", 0),
                    title=item.get("titleKo", item.get("title", "")),
                    level=item.get("level", 0),
                    accepted_user_count=item.get("acceptedUserCount", 0),
                    tags=tags[:3],
                )
            )
        return ProblemList(count=data.get("count", 0), items=items)
    except Exception as e:
        import traceback
        print("Problems API 에러:", e)
        print("상세:", traceback.format_exc())  # 전체 스택 출력
        raise HTTPException(status_code=404, detail=f"User not found: {handle}")