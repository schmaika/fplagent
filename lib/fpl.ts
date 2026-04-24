const FPL_BASE = "https://fantasy.premierleague.com/api";

export interface Player {
  id: number;
  code: number;
  web_name: string;
  first_name: string;
  second_name: string;
  team: number;
  element_type: number; // 1=GK, 2=DEF, 3=MID, 4=FWD
  now_cost: number; // divide by 10 for £
  total_points: number;
  form: string;
  selected_by_percent: string;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  yellow_cards: number;
  red_cards: number;
  saves: number;
  bonus: number;
  bps: number;
  influence: string;
  creativity: string;
  threat: string;
  ict_index: string;
  expected_goals: string;
  expected_assists: string;
  expected_goal_involvements: string;
  status: string; // a=available, d=doubtful, i=injured, s=suspended, u=unavailable
  news: string;
  chance_of_playing_this_round: number | null;
  transfers_in_event: number;
  transfers_out_event: number;
  event_points: number;
}

export interface Team {
  id: number;
  code: number;
  name: string;
  short_name: string;
  strength_overall_home: number;
  strength_overall_away: number;
  strength_attack_home: number;
  strength_attack_away: number;
  strength_defence_home: number;
  strength_defence_away: number;
}

export interface Gameweek {
  id: number;
  name: string;
  deadline_time: string;
  finished: boolean;
  is_current: boolean;
  is_next: boolean;
  average_entry_score: number;
  highest_score: number;
}

export interface BootstrapData {
  elements: Player[];
  teams: Team[];
  events: Gameweek[];
}

export const POSITION_MAP: Record<number, string> = {
  1: "GKP",
  2: "DEF",
  3: "MID",
  4: "FWD",
};

const FPL_HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  "Accept": "application/json, text/plain, */*",
  "Accept-Language": "en-US,en;q=0.9",
  "Origin": "https://fantasy.premierleague.com",
  "Referer": "https://fantasy.premierleague.com/",
};

export async function getBootstrapData(): Promise<BootstrapData> {
  const res = await fetch(`${FPL_BASE}/bootstrap-static/`, {
    headers: FPL_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Failed to fetch FPL data: ${res.status}`);
  return res.json();
}

export async function getFixtures() {
  const res = await fetch(`${FPL_BASE}/fixtures/`, {
    headers: FPL_HEADERS,
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Failed to fetch fixtures: ${res.status}`);
  return res.json();
}

export function formatPrice(cost: number): string {
  return `£${(cost / 10).toFixed(1)}m`;
}

export function getStatusColor(status: string): string {
  switch (status) {
    case "a": return "text-green-400";
    case "d": return "text-yellow-400";
    case "i": return "text-red-400";
    case "s": return "text-red-600";
    default: return "text-gray-400";
  }
}

export function getStatusLabel(status: string): string {
  switch (status) {
    case "a": return "Available";
    case "d": return "Doubtful";
    case "i": return "Injured";
    case "s": return "Suspended";
    case "u": return "Unavailable";
    default: return "Unknown";
  }
}
