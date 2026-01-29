from fastapi import APIRouter, HTTPException
from app.services.solvedac_client import solvedac_client
from app.schemas.user import UserProfile, ProblemStat, TagStat

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