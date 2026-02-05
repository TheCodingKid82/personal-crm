import { NextResponse } from "next/server";
import { getPackById, incrementJoin, UNLOCK_THRESHOLD } from "@/lib/db";

export async function POST(
  _req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const pack = getPackById(id);
  if (!pack) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const count = incrementJoin(id);

  return NextResponse.json({
    id,
    joinCount: count,
    threshold: UNLOCK_THRESHOLD,
    unlocked: count >= UNLOCK_THRESHOLD,
  });
}
