"use client";

import { useState } from "react";
import DualSearchBar from "@/components/DualSearchBar";
import RivalProfileCard from "@/components/RivalProfileCard";
import { UserProfile, getUser } from "@/lib/api";

export default function RivalPage() {
  const [profileA, setProfileA] = useState<UserProfile | null>(null);
  const [profileB, setProfileB] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (handleA: string, handleB: string) => {
    setIsLoading(true);
    setError(null);
    setProfileA(null);
    setProfileB(null);

    try {
      const [dataA, dataB] = await Promise.all([
        getUser(handleA),
        getUser(handleB),
      ]);
      setProfileA(dataA);
      setProfileB(dataB);
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

      {profileA && profileB && (
        <div className="w-full flex flex-col gap-6">
          <RivalProfileCard profileA={profileA} profileB={profileB} />
        </div>
      )}
    </div>
  );
}
