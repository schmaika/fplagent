"use client";

import { useState } from "react";
import Image from "next/image";
import { PlayerWithProb } from "@/lib/probable-xi";

interface Props {
  xi: PlayerWithProb[];
  bench: PlayerWithProb[];
}

function PitchPlayer({ player }: { player: PlayerWithProb }) {
  const [imgError, setImgError] = useState(false);
  const prob = player.startProbability;

  const ringColor =
    prob >= 75 ? "border-green-400" :
    prob >= 50 ? "border-yellow-400" :
    prob >= 25 ? "border-orange-400" :
                 "border-red-500";

  const badgeBg =
    prob >= 75 ? "bg-green-500" :
    prob >= 50 ? "bg-yellow-500" :
    prob >= 25 ? "bg-orange-500" :
                 "bg-red-600";

  const photoUrl = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;
  const displayName = player.web_name.length > 10 ? player.web_name.slice(0, 10) + "." : player.web_name;

  return (
    <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
      <div className={`relative w-12 h-16 sm:w-14 sm:h-[72px] rounded-xl border-2 ${ringColor} overflow-hidden bg-gray-700/80 flex items-center justify-center shadow-lg`}>
        {!imgError ? (
          <Image
            src={photoUrl}
            alt={player.web_name}
            fill
            className="object-contain object-bottom"
            onError={() => setImgError(true)}
            sizes="56px"
          />
        ) : (
          <span className="text-xs font-bold text-white">{player.web_name.slice(0, 2).toUpperCase()}</span>
        )}
        <span className={`absolute bottom-0 left-0 right-0 text-center text-[10px] font-bold ${badgeBg} text-white leading-4`}>
          {prob}%
        </span>
      </div>
      <div className="text-center mt-0.5">
        <p className="text-[11px] sm:text-xs font-semibold text-white leading-tight">{displayName}</p>
        {(player.status === "i" || player.status === "d" || player.status === "s") && (
          <p className="text-[9px] leading-tight text-red-400">
            {player.status === "i" ? "Inj" : player.status === "d" ? "Doubt" : "Susp"}
          </p>
        )}
      </div>
    </div>
  );
}

function BenchPlayer({ player, index }: { player: PlayerWithProb; index: number }) {
  const [imgError, setImgError] = useState(false);
  const prob = player.startProbability;
  const probColor =
    prob >= 75 ? "text-green-400" :
    prob >= 50 ? "text-yellow-400" :
    prob >= 25 ? "text-orange-400" : "text-red-400";

  const photoUrl = `https://resources.premierleague.com/premierleague/photos/players/110x140/p${player.code}.png`;

  return (
    <div className="flex flex-col items-center gap-1 w-16 sm:w-20">
      <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-full border-2 border-gray-600 overflow-hidden bg-gray-700 flex items-center justify-center">
        {!imgError ? (
          <Image
            src={photoUrl}
            alt={player.web_name}
            fill
            className="object-cover object-top scale-125 opacity-70"
            onError={() => setImgError(true)}
            sizes="56px"
          />
        ) : (
          <span className="text-xs font-bold text-gray-300">{player.web_name.slice(0, 2).toUpperCase()}</span>
        )}
        <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-gray-600 text-gray-200 rounded-full w-5 h-5 flex items-center justify-center z-10">
          {index + 1}
        </span>
      </div>
      <div className="text-center">
        <p className="text-[11px] font-medium text-gray-300 leading-tight">
          {player.web_name.length > 10 ? player.web_name.slice(0, 10) + "." : player.web_name}
        </p>
        <p className={`text-[10px] font-semibold ${probColor}`}>{prob}%</p>
      </div>
    </div>
  );
}

export default function Pitch({ xi, bench }: Props) {
  const byPos: Record<number, PlayerWithProb[]> = { 1: [], 2: [], 3: [], 4: [] };
  xi.forEach((p) => byPos[p.element_type].push(p));

  const rows = [4, 3, 2, 1]; // FWD → MID → DEF → GK

  return (
    <div className="flex flex-col gap-4">
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(180deg, #1a4a1a 0%, #1e5c1e 25%, #1a4a1a 50%, #1e5c1e 75%, #1a4a1a 100%)",
          minHeight: 460,
        }}
      >
        {/* Field lines */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 500" preserveAspectRatio="none">
          <rect x="20" y="20" width="360" height="460" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <line x1="20" y1="250" x2="380" y2="250" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <circle cx="200" cy="250" r="50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" />
          <circle cx="200" cy="250" r="3" fill="rgba(255,255,255,0.35)" />
          <rect x="100" y="20" width="200" height="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
          <rect x="150" y="20" width="100" height="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
          <rect x="100" y="390" width="200" height="90" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
          <rect x="150" y="460" width="100" height="40" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
        </svg>

        {/* Players */}
        <div className="relative z-10 flex flex-col justify-around py-5 px-2" style={{ minHeight: 460 }}>
          {rows.map((pos) =>
            byPos[pos].length > 0 ? (
              <div key={pos} className="flex justify-center items-end gap-1 sm:gap-3 py-1">
                {byPos[pos].map((player) => (
                  <PitchPlayer key={player.id} player={player} />
                ))}
              </div>
            ) : null
          )}
        </div>
      </div>

      {/* Bench */}
      {bench.length > 0 && (
        <div className="bg-gray-900/60 border border-gray-700/50 rounded-2xl p-4">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Bench</p>
          <div className="flex justify-center gap-3 sm:gap-6 flex-wrap">
            {bench.slice(0, 7).map((player, i) => (
              <BenchPlayer key={player.id} player={player} index={i} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
