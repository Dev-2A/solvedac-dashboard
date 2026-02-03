"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { ProblemStat } from "@/lib/api";
import { TIER_GROUPS } from "@/lib/tier";

interface DifficultyChartProps {
  stats: ProblemStat[];
}

export default function DifficultyChart({ stats }: DifficultyChartProps) {
  // 티어 그룹별로 합산
  const chartData = TIER_GROUPS.map((group) => {
    const total = stats
      .filter((s) => s.level >= group.range[0] && s.level <= group.range[1])
      .reduce((sum, s) => sum + s.solved, 0);

    return {
      name: group.name,
      solved: total,
      color: group.color,
    };
  });

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <h3 className="text-lg font-bold mb-4">난이도별 풀이 현황</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 20, bottom: 5, left: 0 }}
        >
          <XAxis
            dataKey="name"
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "var(--text-secondary)", fontSize: 12 }}
            axisLine={{ stroke: "var(--border)" }}
            tickLine={false}
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
          <Bar dataKey="solved" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
