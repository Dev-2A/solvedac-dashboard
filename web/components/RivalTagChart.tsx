"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { TagStat } from "@/lib/api";

interface RivalTagChartProps {
  tagStatsA: TagStat[];
  tagStatsB: TagStat[];
  handleA: string;
  handleB: string;
}

export default function RivalTagChart({
  tagStatsA,
  tagStatsB,
  handleA,
  handleB,
}: RivalTagChartProps) {
  // 두 유저의 태그를 합쳐서 상위 10개 선정
  const tagMap = new Map<
    string,
    { name: string; solvedA: number; solvedB: number }
  >();

  tagStatsA.forEach((t) => {
    const key = t.tag_key;
    if (!tagMap.has(key)) {
      tagMap.set(key, { name: t.tag_name, solvedA: 0, solvedB: 0 });
    }
    tagMap.get(key)!.solvedA = t.solved;
  });

  tagStatsB.forEach((t) => {
    const key = t.tag_key;
    if (!tagMap.has(key)) {
      tagMap.set(key, { name: t.tag_name, solvedA: 0, solvedB: 0 });
    }
    tagMap.get(key)!.solvedB = t.solved;
  });

  // 두 유저 합산 기준 상위 10개
  const top10 = [...tagMap.values()]
    .sort((a, b) => b.solvedA + b.solvedB - (a.solvedA + a.solvedB))
    .slice(0, 10);

  const chartData = top10.map((t) => ({
    tag: t.name,
    [handleA]: t.solvedA,
    [handleB]: t.solvedB,
  }));

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <h3 className="text-lg font-bold mb-4">태그별 비교 (Top 10)</h3>
      <ResponsiveContainer width="100%" height={400}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="65%">
          <PolarGrid stroke="var(--border)" />
          <PolarAngleAxis
            dataKey="tag"
            tick={{ fill: "var(--text-secondary)", fontSize: 11 }}
          />
          <PolarRadiusAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 10 }}
            axisLine={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "8px",
              color: "var(--text-primary)",
            }}
            formatter={(value: number) => [`${value}문제`]}
          />
          <Legend
            wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }}
          />
          <Radar
            dataKey={handleA}
            stroke="#17d4a5"
            fill="#17d4a5"
            fillOpacity={0.2}
            strokeWidth={2}
          />
          <Radar
            dataKey={handleB}
            stroke="#f87171"
            fill="#f87171"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
