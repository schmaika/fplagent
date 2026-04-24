import { NextResponse } from "next/server";
import { getBootstrapData } from "@/lib/fpl";

export async function GET() {
  try {
    const data = await getBootstrapData();
    return NextResponse.json(data);
  } catch {
    return NextResponse.json({ error: "Failed to fetch FPL data" }, { status: 500 });
  }
}
