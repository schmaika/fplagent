export const TEAM_COLORS: Record<string, { primary: string; bg: string; border: string }> = {
  ARS: { primary: "#EF0107", bg: "rgba(239,1,7,0.08)", border: "rgba(239,1,7,0.5)" },
  AVL: { primary: "#95BFE5", bg: "rgba(103,14,54,0.15)", border: "rgba(149,191,229,0.5)" },
  BOU: { primary: "#DA291C", bg: "rgba(218,41,28,0.08)", border: "rgba(218,41,28,0.5)" },
  BRE: { primary: "#e30613", bg: "rgba(227,6,19,0.08)", border: "rgba(227,6,19,0.5)" },
  BHA: { primary: "#0057B8", bg: "rgba(0,87,184,0.1)", border: "rgba(0,87,184,0.5)" },
  CHE: { primary: "#034694", bg: "rgba(3,70,148,0.1)", border: "rgba(3,70,148,0.6)" },
  CRY: { primary: "#C4122E", bg: "rgba(196,18,46,0.08)", border: "rgba(196,18,46,0.5)" },
  EVE: { primary: "#003399", bg: "rgba(0,51,153,0.1)", border: "rgba(0,51,153,0.6)" },
  FUL: { primary: "#FFFFFF", bg: "rgba(255,255,255,0.05)", border: "rgba(255,255,255,0.25)" },
  IPS: { primary: "#0044A9", bg: "rgba(0,68,169,0.1)", border: "rgba(0,68,169,0.5)" },
  LEI: { primary: "#003090", bg: "rgba(0,48,144,0.1)", border: "rgba(0,48,144,0.6)" },
  LIV: { primary: "#C8102E", bg: "rgba(200,16,46,0.08)", border: "rgba(200,16,46,0.5)" },
  MCI: { primary: "#6CABDD", bg: "rgba(108,171,221,0.1)", border: "rgba(108,171,221,0.5)" },
  MUN: { primary: "#DA291C", bg: "rgba(218,41,28,0.08)", border: "rgba(218,41,28,0.5)" },
  NEW: { primary: "#41B0E4", bg: "rgba(65,176,228,0.08)", border: "rgba(65,176,228,0.4)" },
  NFO: { primary: "#DD0000", bg: "rgba(221,0,0,0.08)", border: "rgba(221,0,0,0.5)" },
  SOU: { primary: "#D71920", bg: "rgba(215,25,32,0.08)", border: "rgba(215,25,32,0.5)" },
  TOT: { primary: "#132257", bg: "rgba(19,34,87,0.2)", border: "rgba(100,120,200,0.4)" },
  WHU: { primary: "#7A263A", bg: "rgba(122,38,58,0.12)", border: "rgba(122,38,58,0.5)" },
  WOL: { primary: "#FDB913", bg: "rgba(253,185,19,0.08)", border: "rgba(253,185,19,0.5)" },
};

export function getTeamColor(shortName: string) {
  return TEAM_COLORS[shortName] ?? {
    primary: "#7c3aed",
    bg: "rgba(124,58,237,0.08)",
    border: "rgba(124,58,237,0.4)",
  };
}
