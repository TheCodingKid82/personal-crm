import { NextResponse } from "next/server";
import { getPackById, getJoinCount, UNLOCK_THRESHOLD } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const row = getPackById(id);
  
  if (!row) {
    return NextResponse.json({ error: "Pack not found" }, { status: 404 });
  }

  const joinCount = getJoinCount(id);
  const unlocked = joinCount >= UNLOCK_THRESHOLD;

  try {
    const pack = JSON.parse(row.packJson);
    return NextResponse.json({
      id,
      pack,
      joinCount,
      threshold: UNLOCK_THRESHOLD,
      unlocked,
      createdAt: row.createdAt,
    });
  } catch {
    return NextResponse.json(
      { error: "Invalid pack data" },
      { status: 500 },
    );
  }
}
