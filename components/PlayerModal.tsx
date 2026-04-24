"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Player, Team, POSITION_MAP, formatPrice } from "@/lib/fpl";
import { getTeamColor } from "@/lib/team-colors";

interface GWHistory {
  round: number;
  total_points: number;
  minutes: number;
  goals_scored: number;
  assists: number;
  clean_sheets: number;
  bonus: number;
  was_home: boolean;
  opponent_team: number;
  selected: number;
  transfers_in: number;
  transfers_out: number;
  value: number;
}

interface Props {
  player: Player;
  teams: Record<number, Team>;
  onClose: () => void;
}

function StatBox({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="bg-gray-800/60 rounded-xl p-3 text-center">
      <p className={`text-lg font-bold ${highlight ? "text-purple-400" : "text-white"}`}>{value}</p>
      <p className="text-xs text-gray-400 mt-0.5">{label}</p>
    </div>
  );
}

export default function PlayerModal({ player, teams, onClose }: Props) {
  const [history, setHistory] = useState<GWHistory[]>([]);
  const [loading, setLoading] = useState(true);

  const team = teams[player.team];
  const color = getTeamColor(team?.short_name ?? "");
  const photoUrl = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  useEffect(() => {
    fetch(`/api/player/${player.id}`)
      .then((r) => r.json())
      .then((d) => {
        setHistory((d.history ?? []).slice(-8).reverse());
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [player.id]);

  const statusLabel =
    player.status === "i" ? "🚑 Injured" :
    player.status === "d" ? "⚠️ Doubtful" :
    player.status === "s" ? "🚫 Suspended" : null;

  const pointsColor = (pts: number) =>
    pts >= 9 ? "text-green-400 font-bold" :
    pts >= 6 ? "text-green-300" :
    pts >= 2 ? "text-gray-300" : "text-red-400";

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-x-4 top-[50%] -translate-y-[50%] sm:inset-auto sm:left-1/2 sm:-translate-x-1/2 sm:top-1/2 sm:-translate-y-1/2 sm:w-[520px] bg-gray-900 border border-gray-700/60 rounded-2xl z-50 overflow-hidden shadow-2xl max-h-[90vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center gap-4 p-5 border-b border-gray-700/50" style={{ borderLeftColor: color.primary, borderLeftWidth: 4 }}>
          <div className="w-14 h-20 rounded-xl overflow-hidden bg-gray-700/80 border border-gray-600 flex items-center justify-center shrink-0">
            {!imgError ? (
              <Image
                src={photoUrl}
                alt={player.web_name}
                width={56}
                height={80}
                className="object-contain object-bottom w-full h-full"
                onError={() => setImgError(true)}
              />
            ) : (
              <span className="text-xl font-bold text-white">{player.web_name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-white">{player.first_name} {player.second_name}</h2>
            <p className="text-sm font-medium" style={{ color: color.primary === "#FFFFFF" ? "#aaa" : color.primary }}>
              {team?.name}
            </p>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-xs bg-gray-700 text-gray-300 px-2 py-0.5 rounded-full">{POSITION_MAP[player.element_type]}</span>
              <span className="text-xs text-gray-400">{formatPrice(player.now_cost)}</span>
              <span className="text-xs text-cyan-400">{player.selected_by_percent}% owned</span>
              {statusLabel && <span className="text-xs text-yellow-400">{statusLabel}</span>}
            </div>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-white text-xl leading-none shrink-0">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">
          {/* Season stats */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Season</p>
            <div className="grid grid-cols-4 gap-2">
              <StatBox label="Points" value={player.total_points} highlight />
              <StatBox label="Goals" value={player.goals_scored} />
              <StatBox label="Assists" value={player.assists} />
              <StatBox label="Bonus" value={player.bonus} />
            </div>
            <div className="grid grid-cols-4 gap-2 mt-2">
              <StatBox label="Minutes" value={player.minutes} />
              <StatBox label="Form" value={player.form} />
              <StatBox label="xGI" value={Number(player.expected_goal_involvements).toFixed(1)} />
              <StatBox label="Clean Sheets" value={player.clean_sheets} />
            </div>
          </div>

          {/* News */}
          {player.news && (
            <div className="bg-yellow-400/10 border border-yellow-400/20 rounded-xl p-3">
              <p className="text-xs text-yellow-300">{player.news}</p>
            </div>
          )}

          {/* Recent GW history */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Last 8 Gameweeks</p>
            {loading ? (
              <div className="flex justify-center py-8">
                <div className="flex gap-1">
                  {[0, 150, 300].map((d) => (
                    <span key={d} className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{ animationDelay: `${d}ms` }} />
                  ))}
                </div>
              </div>
            ) : history.length === 0 ? (
              <p className="text-gray-500 text-sm text-center py-4">No history available</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-xs text-gray-500 border-b border-gray-700/50">
                      <th className="text-left pb-2 font-medium">GW</th>
                      <th className="text-left pb-2 font-medium">Opponent</th>
                      <th className="text-center pb-2 font-medium">Min</th>
                      <th className="text-center pb-2 font-medium">G</th>
                      <th className="text-center pb-2 font-medium">A</th>
                      <th className="text-center pb-2 font-medium">CS</th>
                      <th className="text-center pb-2 font-medium">B</th>
                      <th className="text-center pb-2 font-medium">Pts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((gw) => {
                      const opponent = teams[gw.opponent_team];
                      return (
                        <tr key={gw.round} className="border-b border-gray-800/60 hover:bg-gray-800/30 transition-colors">
                          <td className="py-2 text-gray-400">GW{gw.round}</td>
                          <td className="py-2 text-gray-300">
                            {opponent?.short_name ?? "?"} {gw.was_home ? "(H)" : "(A)"}
                          </td>
                          <td className="py-2 text-center text-gray-400">{gw.minutes}</td>
                          <td className="py-2 text-center text-white">{gw.goals_scored || "—"}</td>
                          <td className="py-2 text-center text-white">{gw.assists || "—"}</td>
                          <td className="py-2 text-center text-white">{gw.clean_sheets || "—"}</td>
                          <td className="py-2 text-center text-white">{gw.bonus || "—"}</td>
                          <td className={`py-2 text-center ${pointsColor(gw.total_points)}`}>{gw.total_points}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
