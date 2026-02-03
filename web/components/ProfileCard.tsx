import { UserProfile } from "@/lib/api";
import { getTierName, getTierColor } from "@/lib/tier";

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
