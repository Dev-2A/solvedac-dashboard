from pydantic import BaseModel


class UserProfile(BaseModel):
    handle: str
    bio: str | None = None
    solved_count: int = 0
    tier: int = 0
    rating: int = 0
    ranking: int | None = None
    max_streak: int = 0
    profile_image_url: str | None = None


class ProblemStat(BaseModel):
    level: int
    total: int
    solved: int


class TagStat(BaseModel):
    tag_key: str
    tag_name: str
    solved: int
    rating: int