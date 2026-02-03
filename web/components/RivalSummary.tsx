import { UserProfile } from "@/lib/api";
import { getTierColor } from "@/lib/tier";

interface RivalSummaryProps {
  profileA: UserProfile;
  profileB: UserProfile;
}

interface MatchItem {
  label: string;
  valueA: number;
  valueB: number;
  higherIsBetter: boolean;
}

export default function RivalSummary({
  profileA,
  profileB,
}: RivalSummaryProps) {
  const matches: MatchItem[] = [
    {
      label: "풀이 수",
      valueA: profileA.solved_count,
      valueB: profileB.solved_count,
      higherIsBetter: true,
    },
    {
      label: "레이팅",
      valueA: profileA.rating,
      valueB: profileB.rating,
      higherIsBetter: true,
    },
    {
      label: "랭킹",
      valueA: profileA.ranking,
      valueB: profileB.ranking,
      higherIsBetter: false,
    },
    {
      label: "최장 스트릭",
      valueA: profileA.max_streak,
      valueB: profileB.max_streak,
      higherIsBetter: true,
    },
  ];

  let winsA = 0;
  let winsB = 0;

  matches.forEach((m) => {
    const aWins = m.higherIsBetter ? m.valueA > m.valueB : m.valueA < m.valueB;
    const bWins = m.higherIsBetter ? m.valueB > m.valueA : m.valueB < m.valueA;
    if (aWins) winsA++;
    if (bWins) winsB++;
  });

  const winner =
    winsA > winsB ? profileA.handle : winsB > winsA ? profileB.handle : null; // 무승부

  const winnerColor =
    winsA > winsB
      ? getTierColor(profileA.tier)
      : winsB > winsA
        ? getTierColor(profileB.tier)
        : "var(--text-secondary)";

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)] text-center">
      <h3 className="text-lg font-bold mb-4">종합 결과</h3>

      {/* 스코어 */}
      <div className="flex items-center justify-center gap-6 mb-4">
        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            {profileA.handle}
          </p>
          <p
            className={`text-4xl font-black ${winsA >= winsB ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
          >
            {winsA}
          </p>
        </div>
        <span className="text-2xl text-[var(--text-secondary)]">:</span>
        <div className="text-center">
          <p className="text-sm text-[var(--text-secondary)]">
            {profileB.handle}
          </p>
          <p
            className={`text-4xl font-black ${winsB >= winsA ? "text-red-400" : "text-[var(--text-secondary)]"}`}
          >
            {winsB}
          </p>
        </div>
      </div>

      {/* 승자 or 무승부 */}
      {winner ? (
        <p className="text-lg">
          🏆 <strong style={{ color: winnerColor }}>{winner}</strong> 승리!
        </p>
      ) : (
        <p className="text-lg text-[var(--text-secondary)]">🤝 무승부!</p>
      )}

      {/* 세부 항목 */}
      <div className="flex justify-center gap-3 mt-4 flex-wrap">
        {matches.map((m) => {
          const aWins = m.higherIsBetter
            ? m.valueA > m.valueB
            : m.valueA < m.valueB;
          const bWins = m.higherIsBetter
            ? m.valueB > m.valueA
            : m.valueB < m.valueA;
          const draw = !aWins && !bWins;

          return (
            <span
              key={m.label}
              className={`text-xs px-3 py-1.5 rounded-full border ${
                draw
                  ? "border-[var(--border)] text-[var(--text-secondary)]"
                  : aWins
                    ? "border-[var(--accent)] text-[var(--accent)]"
                    : "border-red-400 text-red-400"
              }`}
            >
              {m.label}:{" "}
              {aWins ? profileA.handle : bWins ? profileB.handle : "무승부"}
            </span>
          );
        })}
      </div>
    </div>
  );
}
