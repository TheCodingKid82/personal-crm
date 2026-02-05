import Link from "next/link";
import { notFound } from "next/navigation";
import { getJoinCount, getPackById, UNLOCK_THRESHOLD } from "@/lib/db";
import type { ReviewPack } from "@/lib/pack";
import { ReviewPackView } from "@/components/review-pack-view";

export default async function PackPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;
  const row = getPackById(id);
  if (!row) return notFound();

  const pack = JSON.parse(row.packJson) as ReviewPack;
  const joinCount = getJoinCount(id);
  const unlocked = joinCount >= UNLOCK_THRESHOLD;

  const shareUrlPath = `/p/${id}`;

  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 py-8">
      <header className="space-y-3">
        <Link href="/" className="text-sm text-zinc-300 hover:text-white">
          ← Back
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{pack.title}</h1>
        <div className="flex flex-wrap items-center gap-2 text-xs text-zinc-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Share unlocks: {joinCount}/{UNLOCK_THRESHOLD}
          </span>
          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
            Status: {unlocked ? "Unlocked" : "Locked"}
          </span>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm">
          <div className="font-semibold">Share link</div>
          <div className="mt-1 flex items-center justify-between gap-3">
            <code className="truncate rounded-lg bg-black/30 px-2 py-1 text-xs text-zinc-200">
              {shareUrlPath}
            </code>
            <Link
              href={shareUrlPath}
              className="rounded-xl bg-white px-3 py-2 text-xs font-semibold text-black"
            >
              Open preview
            </Link>
          </div>
          <div className="mt-2 text-xs text-zinc-400">
            Send this to friends/classmates. Once 5 people join, the preview page
            reveals the full pack.
          </div>
        </div>
      </header>

      <main className="mt-8">
        <ReviewPackView pack={pack} />
      </main>
    </div>
  );
}
