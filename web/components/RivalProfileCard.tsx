import { UserProfile } from "@/lib/api";
import { getTierName, getTierColor } from "@/lib/tier";

interface RivalProfileCardProps {
  profileA: UserProfile;
  profileB: UserProfile;
}

interface StatCompareProps {
  label: string;
  valueA: number;
  valueB: number;
  higherIsBetter?: boolean;
}

function StatCompare({
  label,
  valueA,
  valueB,
  higherIsBetter = true,
}: StatCompareProps) {
  const aWins = higherIsBetter ? valueA > valueB : valueA < valueB;
  const bWins = higherIsBetter ? valueB > valueA : valueB < valueA;

  return (
    <div className="flex items-center gap-4 py-2">
      <span
        className={`flex-1 text-right text-lg font-bold ${aWins ? "text-[var(--accent)]" : "text-[var(--text-secondary)]"}`}
      >
        {valueA.toLocaleString()}
      </span>
      <span className="text-sm text-[var(--text-secondary)] w-20 text-center">
        {label}
      </span>
      <span
        className={`flex-1 text-left text-lg font-bold ${bWins ? "text-red-400" : "text-[var(--text-secondary)]"}`}
      >
        {valueB.toLocaleString()}
      </span>
    </div>
  );
}

export default function RivalProfileCard({
  profileA,
  profileB,
}: RivalProfileCardProps) {
  const colorA = getTierColor(profileA.tier);
  const colorB = getTierColor(profileB.tier);

  return (
    <div className="p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      {/* 헤더: 두 프로필 */}
      <div className="flex items-center justify-between mb-6">
        {/* Player A */}
        <div className="flex items-center gap-3">
          <img
            src={
              profileA.profile_image_url ||
              "https://static.solved.ac/misc/default_profile.png"
            }
            alt={profileA.handle}
            className="w-14 h-14 rounded-full border-2"
            style={{ borderColor: colorA }}
          />
          <div>
            <p className="font-bold text-lg">{profileA.handle}</p>
            <p className="text-sm" style={{ color: colorA }}>
              {getTierName(profileA.tier)}
            </p>
          </div>
        </div>

        <span className="text-2xl font-black text-[var(--text-secondary)]">
          VS
        </span>

        {/* Player B */}
        <div className="flex items-center gap-3 text-right">
          <div>
            <p className="font-bold text-lg">{profileB.handle}</p>
            <p className="text-sm" style={{ color: colorB }}>
              {getTierName(profileB.tier)}
            </p>
          </div>
          <img
            src={
              profileB.profile_image_url ||
              "https://static.solved.ac/misc/default_profile.png"
            }
            alt={profileB.handle}
            className="w-14 h-14 rounded-full border-2"
            style={{ borderColor: colorB }}
          />
        </div>
      </div>

      {/* 스탯 비교 */}
      <div className="border-t border-[var(--border)] pt-4">
        <StatCompare
          label="solved"
          valueA={profileA.solved_count}
          valueB={profileB.solved_count}
        />
        <StatCompare
          label="rating"
          valueA={profileA.rating}
          valueB={profileB.rating}
        />
        <StatCompare
          label="ranking"
          valueA={profileA.ranking}
          valueB={profileB.ranking}
          higherIsBetter={false}
        />
        <StatCompare
          label="streak"
          valueA={profileA.max_streak}
          valueB={profileB.max_streak}
        />
      </div>
    </div>
  );
}
