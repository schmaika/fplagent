import { getBootstrapData } from "@/lib/fpl";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/Navbar";

export default async function TeamsPage() {
  const data = await getBootstrapData();
  const teams = [...data.teams].sort((a, b) => a.name.localeCompare(b.name));

  const injuredByTeam = data.elements.reduce<Record<number, number>>((acc, p) => {
    if (p.status === "i" || p.status === "d") acc[p.team] = (acc[p.team] ?? 0) + 1;
    return acc;
  }, {});

  const currentGW = data.events.find((e) => e.is_current) ?? data.events.find((e) => e.is_next);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar gwName={currentGW?.name} />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-white mb-4">All Teams</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {teams.map((team) => {
            const injured = injuredByTeam[team.id] ?? 0;
            const badgeUrl = `https://resources.premierleague.com/premierleague/badges/t${team.code}.png`;
            return (
              <Link
                key={team.id}
                href={`/teams/${team.id}`}
                className="bg-gray-800/60 border border-gray-700/50 rounded-xl p-4 hover:border-purple-500/50 hover:bg-gray-800/90 transition-all group flex flex-col items-center text-center gap-3"
              >
                <div className="w-16 h-16 flex items-center justify-center">
                  <Image
                    src={badgeUrl}
                    alt={team.name}
                    width={64}
                    height={64}
                    className="object-contain group-hover:scale-110 transition-transform duration-200"
                  />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white leading-tight">{team.name}</p>
                  {injured > 0 && (
                    <p className="text-xs text-red-400 mt-0.5">{injured} out/doubt</p>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
