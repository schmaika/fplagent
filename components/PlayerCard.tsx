"use client";

import { Player, Team, POSITION_MAP, formatPrice } from "@/lib/fpl";
import { getTeamColor } from "@/lib/team-colors";

interface Props {
  player: Player;
  teams: Record<number, Team>;
  onClick?: () => void;
}

const positionBadge: Record<number, string> = {
  1: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  2: "bg-green-500/20 text-green-300 border-green-500/30",
  3: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  4: "bg-red-500/20 text-red-300 border-red-500/30",
};

export default function PlayerCard({ player, teams, onClick }: Props) {
  const team = teams[player.team];
  const color = getTeamColor(team?.short_name ?? "");

  const statusIcon =
    player.status === "a" ? null :
    player.status === "d" ? "⚠️" :
    player.status === "i" ? "🚑" :
    player.status === "s" ? "🚫" : null;

  return (
    <div
      onClick={onClick}
      className="rounded-xl p-4 border bg-gray-800/60 transition-all duration-200 hover:scale-[1.02] hover:bg-gray-800/80 cursor-pointer"
      style={{ borderColor: color.border }}
    >
      {/* Top row */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <p className="font-bold text-white truncate">{player.web_name}</p>
            {statusIcon && <span className="text-sm">{statusIcon}</span>}
          </div>
          <p
            className="text-xs font-semibold mt-0.5"
            style={{ color: color.primary === "#FFFFFF" ? "#aaa" : color.primary }}
          >
            {team?.name ?? "Unknown"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1 ml-2 shrink-0">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${positionBadge[player.element_type]}`}>
            {POSITION_MAP[player.element_type]}
          </span>
          <span className="text-xs text-gray-400">{formatPrice(player.now_cost)}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2 text-center">
        <div className="bg-black/20 rounded-lg py-1.5">
          <p className="text-base font-bold text-white">{player.total_points}</p>
          <p className="text-[10px] text-gray-400">pts</p>
        </div>
        <div className="bg-black/20 rounded-lg py-1.5">
          <p className="text-base font-bold text-purple-400">{player.form}</p>
          <p className="text-[10px] text-gray-400">form</p>
        </div>
        <div className="bg-black/20 rounded-lg py-1.5">
          <p className="text-base font-bold text-cyan-400">{player.selected_by_percent}%</p>
          <p className="text-[10px] text-gray-400">owned</p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="flex justify-between mt-3 pt-2.5 border-t border-gray-700/50 text-xs text-gray-400">
        <span>{player.goals_scored}G · {player.assists}A · {player.bonus}bonus</span>
        <span className="text-gray-500">{player.minutes}min</span>
      </div>

      {player.news && (
        <p className="mt-2 text-xs text-yellow-300/80 bg-yellow-400/5 rounded-lg p-2 leading-snug">{player.news}</p>
      )}
    </div>
  );
}
