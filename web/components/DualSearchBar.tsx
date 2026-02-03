"use client";

import { useState } from "react";

interface DualSearchBarProps {
  onSearch: (handleA: string, handleB: string) => void;
  isLoading?: boolean;
}

export default function DualSearchBar({
  onSearch,
  isLoading,
}: DualSearchBarProps) {
  const [handleA, setHandleA] = useState("");
  const [handleB, setHandleB] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const a = handleA.trim();
    const b = handleB.trim();
    if (a && b) {
      onSearch(a, b);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col sm:flex-row items-center gap-3 w-full max-w-2xl"
    >
      <input
        type="text"
        value={handleA}
        onChange={(e) => setHandleA(e.target.value)}
        placeholder="내 핸들"
        disabled={isLoading}
        className="flex-1 w-full px-4 py-3 rounded-lg
          bg-[var(--bg-card)] border border-[var(--accent)]
          text-[var(--text-primary)] placeholder-[var(--text-secondary)]
          focus:outline-none focus:border-[var(--accent)]
          transition-colors disabled:opacity-50"
      />
      <span className="text-2xl font-bold text-[var(--text-secondary)]">
        VS
      </span>
      <input
        type="text"
        value={handleB}
        onChange={(e) => setHandleB(e.target.value)}
        placeholder="상대 핸들"
        disabled={isLoading}
        className="flex-1 w-full px-4 py-3 rounded-lg
          bg-[var(--bg-card)] border border-red-400
          text-[var(--text-primary)] placeholder-[var(--text-secondary)]
          focus:outline-none focus:border-red-400
          transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !handleA.trim() || !handleB.trim()}
        className="px-6 py-3 rounded-lg font-semibold whitespace-nowrap
          bg-[var(--accent)] text-[var(--bg-primary)]
          hover:bg-[var(--accent-hover)] transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "비교 중..." : "비교하기"}
      </button>
    </form>
  );
}
