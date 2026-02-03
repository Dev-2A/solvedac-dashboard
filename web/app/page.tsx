"use client";

import { useState } from "react";
import SearchBar from "@/components/SearchBar";
import ProfileCard from "@/components/ProfileCard";
import DifficultyChart from "@/components/DifficultyChart";
import TagChart from "@/components/TagChart";
import GrassCalendar from "@/components/GrassCalendar";
import {
  UserProfile,
  ProblemStat,
  TagStat,
  GrassData,
  getUser,
  getUserStats,
  getUserTagStats,
  getUserGrass,
} from "@/lib/api";

export default function Home() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [stats, setStats] = useState<ProblemStat[] | null>(null);
  const [tagStats, setTagStats] = useState<TagStat[] | null>(null);
  const [grassData, setGrassData] = useState<GrassData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (handle: string) => {
    setIsLoading(true);
    setError(null);
    setProfile(null);
    setStats(null);
    setTagStats(null);
    setGrassData(null);

    try {
      const [profileData, statsData, tagData, grass] = await Promise.all([
        getUser(handle),
        getUserStats(handle),
        getUserTagStats(handle),
        getUserGrass(handle),
      ]);
      setProfile(profileData);
      setStats(statsData);
      setTagStats(tagData);
      setGrassData(grass);
    } catch (err) {
      setError("사용자를 찾을 수 없습니다. 핸들을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">대시보드</h1>
        <p className="text-[var(--text-secondary)]">
          Solved.ac 핸들을 검색하면 학습 분석 결과를 볼 수 있어요.
        </p>
      </div>

      <SearchBar onSearch={handleSearch} isLoading={isLoading} />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {profile && (
        <div className="w-full flex flex-col gap-6">
          <ProfileCard profile={profile} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {stats && <DifficultyChart stats={stats} />}
            {tagStats && <TagChart tagStats={tagStats} />}
          </div>

          {grassData && <GrassCalendar grassData={grassData} />}
        </div>
      )}
    </div>
  );
}
