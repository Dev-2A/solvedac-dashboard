export const TIER_NAMES: string[] = [
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

export const TIER_GROUPS = [
  { name: "Bronze", color: "#ad5600", range: [1, 5] },
  { name: "Silver", color: "#435f7a", range: [6, 10] },
  { name: "Gold", color: "#ec9a00", range: [11, 15] },
  { name: "Platinum", color: "#27e2a4", range: [16, 20] },
  { name: "Diamond", color: "#00b4fc", range: [21, 25] },
  { name: "Ruby", color: "#ff0062", range: [26, 30] },
];

export function getTierName(tier: number): string {
  return TIER_NAMES[tier] || "Unknown";
}

export function getTierColor(tier: number): string {
  if (tier === 0) return "#666";
  if (tier <= 5) return "#ad5600";
  if (tier <= 10) return "#435f7a";
  if (tier <= 15) return "#ec9a00";
  if (tier <= 20) return "#27e2a4";
  if (tier <= 25) return "#00b4fc";
  if (tier <= 30) return "#ff0062";
  return "#b300e0";
}

export function getTierGroupName(level: number): string {
  if (level === 0) return "Unrated";
  const group = TIER_GROUPS.find(
    (g) => level >= g.range[0] && level <= g.range[1],
  );
  return group?.name || "Unknown";
}

export function getTierGroupColor(level: number): string {
  if (level === 0) return "#666";
  const group = TIER_GROUPS.find(
    (g) => level >= g.range[0] && level <= g.range[1],
  );
  return group?.color || "#666";
}
