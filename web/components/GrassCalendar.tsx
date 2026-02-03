"use client";

import { GrassData } from "@/lib/api";

interface GrassCalendarProps {
  grassData: GrassData;
}

function getIntensityColor(value: number): string {
  if (value === 0) return "var(--bg-secondary)";
  if (value === 1) return "#0e4429";
  if (value === 2) return "#006d32";
  if (value === 3) return "#26a641";
  return "#39d353";
}

export default function GrassCalendar({ grassData }: GrassCalendarProps) {
  const { grass, current_streak, longest_streak } = grassData;

  if (!grass || grass.length === 0) {
    return (
      <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
        <h3 className="text-lg font-bold">풀이 잔디</h3>
        <p className="text-[var(--text-secondary)] mt-2">
          잔디 데이터가 없습니다.
        </p>
      </div>
    );
  }

  // 최근 365일만 사용
  const days = grass.slice(-365);

  // 주(week) 단위로 그룹핑: 각 주는 일~토(7칸)
  const firstDate = new Date(days[0].date + "T00:00:00");
  const startDayOfWeek = firstDate.getDay(); // 0=일 ~ 6=토

  const cellSize = 12;
  const gap = 3;
  const step = cellSize + gap;

  // 전체 열(주) 수 계산
  const totalSlots = startDayOfWeek + days.length;
  const totalCols = Math.ceil(totalSlots / 7);

  // 월 라벨 계산 (너무 가까운 라벨은 건너뜀)
  const months: { label: string; col: number }[] = [];
  let lastMonth = -1;
  let lastLabelCol = -999;
  const MIN_COL_GAP = 4; // 최소 4주(열) 간격

  days.forEach((d, i) => {
    const date = new Date(d.date + "T00:00:00");
    const m = date.getMonth();
    if (m !== lastMonth) {
      lastMonth = m;
      const col = Math.floor((i + startDayOfWeek) / 7);
      if (col - lastLabelCol >= MIN_COL_GAP) {
        const label = date.toLocaleDateString("ko-KR", { month: "short" });
        months.push({ label, col });
        lastLabelCol = col;
      }
    }
  });

  const svgWidth = totalCols * step + 10;
  const svgHeight = 7 * step + 25;

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold">풀이 잔디</h3>
        <div className="flex gap-4 text-sm text-[var(--text-secondary)]">
          <span>
            현재 스트릭:{" "}
            <strong className="text-[var(--accent)]">{current_streak}일</strong>
          </span>
          <span>
            최장 스트릭:{" "}
            <strong className="text-[var(--text-primary)]">
              {longest_streak}일
            </strong>
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <svg width={svgWidth} height={svgHeight}>
          {/* 월 라벨 */}
          {months.map((m, i) => (
            <text
              key={i}
              x={m.col * step}
              y={10}
              fill="var(--text-secondary)"
              fontSize={10}
            >
              {m.label}
            </text>
          ))}

          {/* 잔디 셀 */}
          {days.map((d, i) => {
            const slot = i + startDayOfWeek;
            const col = Math.floor(slot / 7);
            const row = slot % 7;
            return (
              <rect
                key={d.date}
                x={col * step}
                y={row * step + 18}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getIntensityColor(d.value)}
              >
                <title>{`${d.date}: ${d.value}문제`}</title>
              </rect>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
