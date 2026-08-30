// Accent colors per team, used for driver chips, podium pickers and the
// leaderboard. Kept separate from driver data (which lives in Supabase) so
// the palette can be tuned without touching seed data.
export const TEAM_COLORS: Record<string, { from: string; to: string; solid: string }> = {
  "Red Bull Racing": { from: "#1e3a8a", to: "#0c1445", solid: "#1e40af" },
  Ferrari: { from: "#ff2d2d", to: "#8b0000", solid: "#dc0000" },
  Mercedes: { from: "#00d2be", to: "#003d38", solid: "#00a19a" },
  McLaren: { from: "#ff8000", to: "#7a3b00", solid: "#ff8700" },
  "Aston Martin": { from: "#00665e", to: "#003330", solid: "#00594f" },
  Alpine: { from: "#ff87bc", to: "#005ba9", solid: "#2173b8" },
  Haas: { from: "#b6babd", to: "#3a3a3a", solid: "#8c8c8c" },
  Williams: { from: "#00a3e0", to: "#00354a", solid: "#0090d0" },
  Sauber: { from: "#52e252", to: "#0a4a0a", solid: "#00e701" },
  "Racing Bulls": { from: "#4562c2", to: "#1a2a5e", solid: "#6692ff" },
};

export const DEFAULT_TEAM_COLOR = { from: "#525252", to: "#171717", solid: "#737373" };

export function teamColor(team: string) {
  return TEAM_COLORS[team] ?? DEFAULT_TEAM_COLOR;
}
