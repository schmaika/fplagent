import { Player, POSITION_MAP } from "./fpl";

export interface PlayerWithProb extends Player {
  startProbability: number;
  probLabel: string;
  probColor: string;
}

export function getStartProbability(player: Player, totalGW: number): number {
  // Suspended or unavailable = 0%
  if (player.status === "s" || player.status === "u") return 0;

  // Injured = use FPL's chance_of_playing or 0
  if (player.status === "i") {
    return player.chance_of_playing_this_round ?? 0;
  }

  // Doubtful = use FPL's chance_of_playing or 50%
  if (player.status === "d") {
    return player.chance_of_playing_this_round ?? 50;
  }

  // Available — base on minutes consistency
  if (totalGW === 0) return 0;
  const maxMinutes = totalGW * 90;
  return Math.min(100, Math.round((player.minutes / maxMinutes) * 100));
}

export function getProbColor(prob: number): string {
  if (prob >= 75) return "text-green-400";
  if (prob >= 50) return "text-yellow-400";
  if (prob >= 25) return "text-orange-400";
  return "text-red-400";
}

export function getProbLabel(prob: number, status: string): string {
  if (status === "s") return "Suspended";
  if (status === "u") return "Unavailable";
  if (status === "i") return `Injured · ${prob}%`;
  if (status === "d") return `Doubtful · ${prob}%`;
  if (prob >= 90) return `Starter · ${prob}%`;
  if (prob >= 70) return `Likely · ${prob}%`;
  if (prob >= 40) return `Rotation · ${prob}%`;
  return `Bench · ${prob}%`;
}

export function buildProbableXI(
  teamPlayers: Player[],
  totalGW: number
): { xi: PlayerWithProb[]; bench: PlayerWithProb[] } {
  const withProb: PlayerWithProb[] = teamPlayers
    .map((p) => {
      const prob = getStartProbability(p, totalGW);
      return {
        ...p,
        startProbability: prob,
        probLabel: getProbLabel(prob, p.status),
        probColor: getProbColor(prob),
      };
    })
    .sort((a, b) => b.startProbability - a.startProbability);

  // Pick best GK
  const gks = withProb.filter((p) => p.element_type === 1);
  const outfield = withProb.filter((p) => p.element_type !== 1);

  const xi: PlayerWithProb[] = [];
  const bench: PlayerWithProb[] = [];

  // 1 GK
  if (gks.length > 0) xi.push(gks[0]);
  gks.slice(1).forEach((p) => bench.push(p));

  // Best 10 outfield by probability
  outfield.slice(0, 10).forEach((p) => xi.push(p));
  outfield.slice(10).forEach((p) => bench.push(p));

  // Sort XI by position for display: GK → DEF → MID → FWD
  xi.sort((a, b) => a.element_type - b.element_type);

  return { xi, bench };
}

export const POSITION_ROWS: Record<number, string> = {
  1: "Goalkeeper",
  2: "Defenders",
  3: "Midfielders",
  4: "Forwards",
};
