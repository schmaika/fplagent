import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { getBootstrapData, POSITION_MAP, formatPrice } from "@/lib/fpl";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export const maxDuration = 30;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const messages = body.messages as { role: "user" | "assistant"; content: string }[];

    if (!messages || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided" }, { status: 400 });
    }

    // Try to get FPL data — but don't crash the chat if it fails
    let fplContext = "Live FPL data is temporarily unavailable.";
    let gwName = "Unknown";

    try {
      const data = await getBootstrapData();
      const currentGW = data.events.find((e) => e.is_current) ?? data.events.find((e) => e.is_next);
      gwName = currentGW?.name ?? "Unknown";
      const teams = Object.fromEntries(data.teams.map((t) => [t.id, t]));

      const topPlayers = [...data.elements]
        .filter((p) => p.minutes > 90)
        .sort((a, b) => b.total_points - a.total_points)
        .slice(0, 40)
        .map((p) => ({
          name: p.web_name,
          pos: POSITION_MAP[p.element_type],
          team: teams[p.team]?.short_name,
          price: formatPrice(p.now_cost),
          pts: p.total_points,
          form: p.form,
          own: p.selected_by_percent + "%",
          g: p.goals_scored,
          a: p.assists,
          status: p.status === "a" ? "fit" : p.status === "d" ? "doubtful" : p.status === "i" ? "injured" : p.status,
          news: p.news || undefined,
        }));

      fplContext = JSON.stringify(topPlayers);
    } catch (fplErr) {
      console.error("FPL fetch failed:", fplErr);
    }

    const systemPrompt = `You are an expert Fantasy Premier League (FPL) assistant. Help users make smart decisions about their FPL teams.

Current Gameweek: ${gwName}

Top 40 players by total points this season:
${fplContext}

Rules:
- Be concise, use bullet points.
- Mention prices and form when recommending.
- Flag injuries clearly.
- For captaincy questions give top 3 picks with reasons.
- Respond in English only.`;

    const response = await client.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 800,
      system: systemPrompt,
      messages,
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    return NextResponse.json({ reply: text });
  } catch (err: unknown) {
    const error = err as { status?: number; message?: string; error?: { type: string; message: string } };
    console.error("Chat route error:", JSON.stringify(error, null, 2));
    return NextResponse.json(
      { error: error?.error?.message ?? error?.message ?? "Chat failed" },
      { status: error?.status ?? 500 }
    );
  }
}
