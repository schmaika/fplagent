"use client";

import { useState } from "react";
import { Player, Team, POSITION_MAP } from "@/lib/fpl";
import PlayerCard from "./PlayerCard";
import PlayerModal from "./PlayerModal";

const POSITION_TABS = ["All", "GKP", "DEF", "MID", "FWD"] as const;
type PositionTab = (typeof POSITION_TABS)[number];

const SORT_OPTIONS = [
  { value: "total_points", label: "Total Points" },
  { value: "form", label: "Form" },
  { value: "now_cost", label: "Price ↓" },
  { value: "now_cost_asc", label: "Price ↑" },
  { value: "selected_by_percent", label: "Ownership %" },
  { value: "goals_scored", label: "Goals" },
  { value: "assists", label: "Assists" },
  { value: "expected_goal_involvements", label: "xGI" },
  { value: "bonus", label: "Bonus pts" },
] as const;

type SortKey = (typeof SORT_OPTIONS)[number]["value"];

function sortPlayers(players: Player[], key: SortKey): Player[] {
  return [...players].sort((a, b) => {
    switch (key) {
      case "form": return parseFloat(b.form) - parseFloat(a.form);
      case "now_cost": return b.now_cost - a.now_cost;
      case "now_cost_asc": return a.now_cost - b.now_cost;
      case "selected_by_percent": return parseFloat(b.selected_by_percent) - parseFloat(a.selected_by_percent);
      case "goals_scored": return b.goals_scored - a.goals_scored;
      case "assists": return b.assists - a.assists;
      case "expected_goal_involvements":
        return parseFloat(b.expected_goal_involvements) - parseFloat(a.expected_goal_involvements);
      case "bonus": return b.bonus - a.bonus;
      default: return b.total_points - a.total_points;
    }
  });
}

interface Props {
  players: Player[];
  teams: Record<number, Team>;
}

export default function PlayerGrid({ players, teams }: Props) {
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<PositionTab>("All");
  const [sortKey, setSortKey] = useState<SortKey>("total_points");
  const [selected, setSelected] = useState<Player | null>(null);

  const filtered = sortPlayers(
    players
      .filter((p) => activeTab === "All" || POSITION_MAP[p.element_type] === activeTab)
      .filter((p) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          p.web_name.toLowerCase().includes(q) ||
          p.first_name.toLowerCase().includes(q) ||
          p.second_name.toLowerCase().includes(q) ||
          teams[p.team]?.short_name.toLowerCase().includes(q) ||
          teams[p.team]?.name.toLowerCase().includes(q)
        );
      }),
    sortKey
  ).slice(0, 40);

  return (
    <div>
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">🔍</span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search player or team..."
            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-9 pr-8 py-2.5 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 transition-colors"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Sort */}
        <div className="relative">
          <select
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value as SortKey)}
            className="appearance-none bg-gray-800 border border-gray-700 rounded-xl px-4 py-2.5 pr-8 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors cursor-pointer"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none text-xs">▼</span>
        </div>

        {/* Position tabs */}
        <div className="flex gap-1 bg-gray-800/60 rounded-xl p-1 self-start">
          {POSITION_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === tab ? "bg-purple-600 text-white" : "text-gray-400 hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-2xl mb-2">🔍</p>
          <p>No players found for &quot;{search}&quot;</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((player) => (
            <PlayerCard key={player.id} player={player} teams={teams} onClick={() => setSelected(player)} />
          ))}
        </div>
      )}

      {selected && (
        <PlayerModal player={selected} teams={teams} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
