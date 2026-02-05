import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { deriveReviewPack } from "@/lib/pack";
import { upsertPack } from "@/lib/db";

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON body" },
      { status: 400 },
    );
  }

  const text =
    typeof (body as { text?: unknown })?.text === "string"
      ? (body as { text: string }).text
      : "";

  if (text.trim().length < 20) {
    return NextResponse.json(
      { error: "Paste at least ~20 characters to generate a pack." },
      { status: 400 },
    );
  }

  const id = nanoid(10);
  const pack = deriveReviewPack(text);

  upsertPack({
    id,
    sourceText: text,
    packJson: JSON.stringify(pack),
  });

  return NextResponse.json({ id, pack });
}
