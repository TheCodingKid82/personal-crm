"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

export function PublicPreviewClient({
  packId,
  threshold,
}: {
  packId: string;
  threshold: number;
}) {
  const [joinCount, setJoinCount] = useState<number | null>(null);
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const progress = useMemo(() => {
    if (joinCount == null) return 0;
    return Math.min(100, Math.round((joinCount / threshold) * 100));
  }, [joinCount, threshold]);

  const refresh = async () => {
    const res = await fetch(`/api/packs/${packId}/status`, { cache: "no-store" });
    const data = (await res.json()) as {
      joinCount?: number;
      unlocked?: boolean;
      threshold?: number;
      error?: string;
    };

    if (!res.ok) throw new Error(data.error || "Failed to load status");

    setJoinCount(data.joinCount ?? 0);
    setUnlocked(Boolean(data.unlocked));
  };

  useEffect(() => {
    refresh().catch((e) => setError(e instanceof Error ? e.message : "Failed"));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [packId]);

  const onJoin = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`/api/packs/${packId}/join`, { method: "POST" });
      const data = (await res.json()) as {
        joinCount?: number;
        unlocked?: boolean;
        error?: string;
      };
      if (!res.ok) throw new Error(data.error || "Join failed");
      setJoinCount(data.joinCount ?? 0);
      setUnlocked(Boolean(data.unlocked));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Join failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-sm font-semibold">Unlock this pack</div>
          <div className="mt-1 text-xs text-zinc-300">
            {joinCount == null
              ? "Loading…"
              : `${joinCount}/${threshold} people have joined`}
          </div>
        </div>
        <div className="text-xs text-zinc-400">{progress}%</div>
      </div>

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full bg-emerald-400"
          style={{ width: `${progress}%` }}
        />
      </div>

      {error ? (
        <div className="mt-3 rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-xs text-red-200">
          {error}
        </div>
      ) : null}

      <div className="mt-4 flex gap-2">
        <button
          onClick={onJoin}
          disabled={loading}
          className="flex-1 rounded-xl bg-white px-3 py-2 text-sm font-semibold text-black disabled:opacity-60"
        >
          {loading ? "Joining…" : "Join to unlock"}
        </button>
        <button
          onClick={() => refresh().catch(() => {})}
          className="rounded-xl border border-white/15 px-3 py-2 text-sm font-semibold"
        >
          Refresh
        </button>
      </div>

      {unlocked ? (
        <div className="mt-4 text-xs text-emerald-300">
          Unlocked! <Link className="underline" href={`/pack/${packId}`}>Open full pack</Link>
        </div>
      ) : (
        <div className="mt-4 text-xs text-zinc-400">
          Share this link to get classmates to join.
        </div>
      )}
    </div>
  );
}
