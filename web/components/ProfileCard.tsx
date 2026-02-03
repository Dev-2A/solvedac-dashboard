import { UserProfile } from "@/lib/api";

// 티어 번호 → 이름 변환
function getTierName(tier: number): string {
  const tiers = [
    "Unrated",
    "Bronze V",
    "Bronze IV",
    "Bronze III",
    "Bronze II",
    "Bronze I",
    "Silver V",
    "Silver IV",
    "Silver III",
    "Silver II",
    "Silver I",
    "Gold V",
    "Gold IV",
    "Gold III",
    "Gold II",
    "Gold I",
    "Platinum V",
    "Platinum IV",
    "Platinum III",
    "Platinum II",
    "Platinum I",
    "Diamond V",
    "Diamond IV",
    "Diamond III",
    "Diamond II",
    "Diamond I",
    "Ruby V",
    "Ruby IV",
    "Ruby III",
    "Ruby II",
    "Ruby I",
    "Master",
  ];
  return tiers[tier] || "Unknown";
}

function getTierColor(tier: number): string {
  if (tier === 0) return "#666";
  if (tier <= 5) return "#ad5600";
  if (tier <= 10) return "#435f7a";
  if (tier <= 15) return "#ec9a00";
  if (tier <= 20) return "#27e2a4";
  if (tier <= 25) return "#00b4fc";
  if (tier <= 30) return "#ff0062";
  return "#b300e0";
}

interface ProfileCardProps {
  profile: UserProfile;
}

export default function ProfileCard({ profile }: ProfileCardProps) {
  const tierColor = getTierColor(profile.tier);

  return (
    <div className="flex items-center gap-6 p-6 rounded-xl bg-[var(--bg-card)] border border-[var(--border)]">
      <img
        src={
          profile.profile_image_url ||
          "https://static.solved.ac/misc/default_profile.png"
        }
        alt={profile.handle}
        className="w-20 h-20 rounded-full border-2"
        style={{ borderColor: tierColor }}
      />
      <div className="flex-1">
        <div className="flex items-center gap-3 mb-2">
          <h2 className="text-xl font-bold">{profile.handle}</h2>
          <span
            className="text-sm font-semibold px-2 py-0.5 rounded"
            style={{ backgroundColor: tierColor + "22", color: tierColor }}
          >
            {getTierName(profile.tier)}
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-[var(--text-secondary)]">solved</p>
            <p className="text-lg font-bold">
              {profile.solved_count.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)]">rating</p>
            <p className="text-lg font-bold">
              {profile.rating.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)]">ranking</p>
            <p className="text-lg font-bold">
              #{profile.ranking?.toLocaleString() || "-"}
            </p>
          </div>
          <div>
            <p className="text-[var(--text-secondary)]">max streak</p>
            <p className="text-lg font-bold">{profile.max_streak}일</p>
          </div>
        </div>
      </div>
    </div>
  );
}
