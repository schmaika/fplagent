import { getBootstrapData } from "@/lib/fpl";
import { buildProbableXI } from "@/lib/probable-xi";
import Image from "next/image";
import { notFound } from "next/navigation";
import Pitch from "@/components/Pitch";
import Navbar from "@/components/Navbar";

export default async function TeamPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const data = await getBootstrapData();

  const team = data.teams.find((t) => t.id === parseInt(id));
  if (!team) notFound();

  const teamPlayers = data.elements.filter((p) => p.team === team.id);
  const finishedGWs = data.events.filter((e) => e.finished).length;
  const totalGW = Math.max(finishedGWs, 1);
  const currentGW = data.events.find((e) => e.is_current) ?? data.events.find((e) => e.is_next);

  const { xi, bench } = buildProbableXI(teamPlayers, totalGW);

  const injuredCount = teamPlayers.filter((p) => p.status === "i" || p.status === "s").length;
  const doubtfulCount = teamPlayers.filter((p) => p.status === "d").length;
  const badgeUrl = `https://resources.premierleague.com/premierleague/badges/t${team.code}.png`;

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar gwName={currentGW?.name} />

      <div className="max-w-2xl mx-auto px-4 py-6">
        {/* Team header */}
        <div className="flex items-center gap-4 mb-6 p-4 bg-gray-900/60 border border-gray-700/50 rounded-xl">
          <Image src={badgeUrl} alt={team.name} width={56} height={56} className="object-contain" />
          <div className="flex-1">
            <p className="font-bold text-white text-lg">{team.name}</p>
            <p className="text-xs text-gray-400">{team.short_name} · Probable XI</p>
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <p className="text-lg font-bold text-red-400">{injuredCount}</p>
              <p className="text-xs text-gray-400">Injured</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-yellow-400">{doubtfulCount}</p>
              <p className="text-xs text-gray-400">Doubtful</p>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex gap-4 mb-4 text-xs text-gray-400 flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-green-500" />≥75% starter</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500" />50–74% likely</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-orange-500" />25–49% rotation</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-red-600" />&lt;25% unlikely</span>
        </div>

        <Pitch xi={xi} bench={bench} />
      </div>
    </div>
  );
}
