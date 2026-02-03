const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

async function fetchAPI<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`);
  if (!res.ok) {
    throw new Error(`API 요청 실패: ${res.status}`);
  }
  return res.json();
}

// 타입 정의
export interface UserProfile {
  handle: string;
  bio: string;
  solved_count: number;
  tier: number;
  rating: number;
  ranking: number;
  max_streak: number;
  profile_image_url: string | null;
}

export interface ProblemStat {
  level: number;
  total: number;
  solved: number;
  partial: number;
  tried: number;
}

export interface TagStat {
  tag_key: string;
  tag_name: string;
  solved: number;
  rating: number;
}

export interface GrassDay {
  date: string;
  value: number;
}

export interface GrassData {
  grass: GrassDay[];
  current_streak: number;
  longest_streak: number;
}

export interface TopProblem {
  problemId: number;
  titleKo: string;
  level: number;
  acceptedUserCount: number;
}

// API 호출 함수
export async function getUser(handle: string): Promise<UserProfile> {
  return fetchAPI(`/api/user/${handle}`);
}

export async function getUserStats(handle: string): Promise<ProblemStat[]> {
  return fetchAPI(`/api/user/${handle}/stats`);
}

export async function getUserTagStats(handle: string): Promise<TagStat[]> {
  return fetchAPI(`/api/user/${handle}/tags`);
}

export async function getUserGrass(handle: string): Promise<GrassData> {
  return fetchAPI(`/api/user/${handle}/grass`);
}

export async function getUserTopProblems(handle: string): Promise<TopProblem[]> {
  return fetchAPI(`/api/user/${handle}/problems`);
}