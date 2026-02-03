"use client";

import { useState } from "react";
import DualSearchBar from "@/components/DualSearchBar";
import RivalProfileCard from "@/components/RivalProfileCard";
import RivalDifficultyChart from "@/components/RivalDifficultyChart";
import RivalTagChart from "@/components/RivalTagChart";
import RivalSummary from "@/components/RivalSummary";
import {
  UserProfile,
  ProblemStat,
  TagStat,
  getUser,
  getUserStats,
  getUserTagStats,
} from "@/lib/api";

interface RivalData {
  profile: UserProfile;
  stats: ProblemStat[];
  tagStats: TagStat[];
}

export default function RivalPage() {
  const [dataA, setDataA] = useState<RivalData | null>(null);
  const [dataB, setDataB] = useState<RivalData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (handleA: string, handleB: string) => {
    setIsLoading(true);
    setError(null);
    setDataA(null);
    setDataB(null);

    try {
      const [profileA, statsA, tagStatsA, profileB, statsB, tagStatsB] =
        await Promise.all([
          getUser(handleA),
          getUserStats(handleA),
          getUserTagStats(handleA),
          getUser(handleB),
          getUserStats(handleB),
          getUserTagStats(handleB),
        ]);

      setDataA({ profile: profileA, stats: statsA, tagStats: tagStatsA });
      setDataB({ profile: profileB, stats: statsB, tagStats: tagStatsB });
    } catch (err) {
      setError("사용자를 찾을 수 없습니다. 핸들을 확인해주세요.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8">
      <div className="text-center mb-4">
        <h1 className="text-3xl font-bold mb-2">라이벌 비교</h1>
        <p className="text-[var(--text-secondary)]">
          두 명의 핸들을 입력하면 실력을 비교할 수 있어요.
        </p>
      </div>

      <DualSearchBar onSearch={handleSearch} isLoading={isLoading} />

      {error && <p className="text-red-400 text-sm">{error}</p>}

      {dataA && dataB && (
        <div className="w-full flex flex-col gap-6">
          <RivalProfileCard profileA={dataA.profile} profileB={dataB.profile} />

          <RivalSummary profileA={dataA.profile} profileB={dataB.profile} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <RivalDifficultyChart
              statsA={dataA.stats}
              statsB={dataB.stats}
              handleA={dataA.profile.handle}
              handleB={dataB.profile.handle}
            />
            <RivalTagChart
              tagStatsA={dataA.tagStats}
              tagStatsB={dataB.tagStats}
              handleA={dataA.profile.handle}
              handleB={dataB.profile.handle}
            />
          </div>
        </div>
      )}
    </div>
  );
}
