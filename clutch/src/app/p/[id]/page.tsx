import Link from "next/link";
import { notFound } from "next/navigation";
import { getJoinCount, getPackById, UNLOCK_THRESHOLD } from "@/lib/db";
import type { ReviewPack } from "@/lib/pack";
import { ReviewPackView } from "@/components/review-pack-view";
import { PublicPreviewClient } from "@/components/public-preview";

export default async function PublicPackPreviewPage({
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

  return (
    <div className="mx-auto min-h-dvh max-w-2xl px-4 py-8">
      <header className="space-y-3">
        <Link href="/" className="text-sm text-zinc-300 hover:text-white">
          ← Home
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{pack.title}</h1>
        <p className="text-sm text-zinc-300">
          You’ve been invited to help unlock this review pack.
        </p>
      </header>

      <main className="mt-6 space-y-6">
        <PublicPreviewClient packId={id} threshold={UNLOCK_THRESHOLD} />

        {unlocked ? (
          <div>
            <div className="mb-3 text-xs text-zinc-400">
              (Unlocked content)
            </div>
            <ReviewPackView pack={pack} />
          </div>
        ) : (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <div className="text-sm font-semibold">Preview</div>
            <p className="mt-2 text-sm text-zinc-200">
              {pack.onePager.summary}
            </p>
            <div className="mt-4">
              <div className="text-xs text-zinc-400">Full pack is hidden until {UNLOCK_THRESHOLD} joins.</div>
              <div className="mt-3 select-none rounded-xl border border-white/10 bg-black/30 p-4 text-sm text-zinc-400 blur-sm">
                (Flashcards + quiz will appear here once unlocked)
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
