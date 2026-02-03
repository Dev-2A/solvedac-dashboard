"use client";

import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { TagStat } from "@/lib/api";

interface TagChartProps {
  tagStats: TagStat[];
}

export default function TagChart({ tagStats }: TagChartProps) {
  const top10 = [...tagStats]
    .sort((a, b) => b.solved - a.solved)
    .slice(0, 10);

  const chartData = top10.map((t) => ({
    tag: t.tag_name,
    solved: t.solved,
  }));

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <h3 className="text-lg font-bold mb-4">태그별 풀이 현황 (Top 10)</h3>
      <ResponsiveContainer width="100%" height={350}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="70%">
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
            formatter={(value: number) => [`${value}문제`, "풀이 수"]}
          />
          <Radar
            dataKey="solved"
            stroke="var(--accent)"
            fill="var(--accent)"
            fillOpacity={0.25}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
