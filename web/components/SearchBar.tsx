"use client";

import { useState } from "react";

interface SearchBarProps {
  onSearch: (handle: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function SearchBar({
  onSearch,
  isLoading,
  placeholder,
}: SearchBarProps) {
  const [input, setInput] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = input.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 w-full max-w-md">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder || "Solved.ac 핸들을 입력하세요"}
        disabled={isLoading}
        className="flex-1 px-4 py-3 rounded-lg
          bg-[var(--bg-card)] border border-[var(--border)]
          text-[var(--text-primary)] placeholder-[var(--text-secondary)]
          focus:outline-none focus:border-[var(--accent)]
          transition-colors disabled:opacity-50"
      />
      <button
        type="submit"
        disabled={isLoading || !input.trim()}
        className="px-6 py-3 rounded-lg font-semibold
          bg-[var(--accent)] text-[var(--bg-primary)]
          hover:bg-[var([[accent-hover)] transition-colors
          disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? "검색 중..." : "검색"}
      </button>
    </form>
  );
}
