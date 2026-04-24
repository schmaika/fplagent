import { getBootstrapData, Team } from "@/lib/fpl";
import PlayerGrid from "@/components/PlayerGrid";
import Navbar from "@/components/Navbar";

export default async function Home() {
  const data = await getBootstrapData();
  const teams = Object.fromEntries(data.teams.map((t) => [t.id, t])) as Record<number, Team>;
  const currentGW = data.events.find((e) => e.is_current) ?? data.events.find((e) => e.is_next);
  const players = data.elements.filter((p) => p.minutes > 90 && p.status !== "u");

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar gwName={currentGW?.name} />

      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h2 className="text-lg font-bold text-white mb-4">Players</h2>
        <PlayerGrid players={players} teams={teams} />
      </div>
    </div>
  );
}
