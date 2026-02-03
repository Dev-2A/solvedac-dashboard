"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ProblemStat } from "@/lib/api";
import { TIER_GROUPS } from "@/lib/tier";

interface RivalDifficultyChartProps {
  statsA: ProblemStat[];
  statsB: ProblemStat[];
  handleA: string;
  handleB: string;
}

export default function RivalDifficultyChart({
  statsA,
  statsB,
  handleA,
  handleB,
}: RivalDifficultyChartProps) {
  const chartData = TIER_GROUPS.map((group) => {
    const totalA = statsA
      .filter((s) => s.level >= group.range[0] && s.level <= group.range[1])
      .reduce((sum, s) => sum + s.solved, 0);

    const totalB = statsB
      .filter((s) => s.level >= group.range[0] && s.level <= group.range[1])
      .reduce((sum, s) => sum + s.solved, 0);

    return {
      name: group.name,
      [handleA]: totalA,
      [handleB]: totalB,
    };
  });

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <h3 className="text-lg font-bold mb-4">난이도별 비교</h3>
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
            formatter={(value: number) => [`${value}문제`]}
          />
          <Legend
            wrapperStyle={{ color: "var(--text-secondary)", fontSize: 12 }}
          />
          <Bar dataKey={handleA} fill="#17d4a5" radius={[4, 4, 0, 0]} />
          <Bar dataKey={handleB} fill="#f87171" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
