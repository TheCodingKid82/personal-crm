import type { ReviewPack } from "@/lib/pack";

export function ReviewPackView({ pack }: { pack: ReviewPack }) {
  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">One-pager</h2>
        <p className="mt-3 text-sm leading-6 text-zinc-200">{pack.onePager.summary}</p>
        {pack.onePager.keyPoints.length ? (
          <ul className="mt-4 list-disc space-y-1 pl-5 text-sm text-zinc-200">
            {pack.onePager.keyPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        ) : null}
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Flashcards</h2>
        <div className="mt-4 grid gap-3">
          {pack.flashcards.map((fc, i) => (
            <details
              key={i}
              className="group rounded-xl border border-white/10 bg-zinc-950/40 p-4"
            >
              <summary className="cursor-pointer text-sm font-semibold text-white">
                {fc.q}
              </summary>
              <div className="mt-2 text-sm leading-6 text-zinc-200">{fc.a}</div>
            </details>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h2 className="text-lg font-semibold">Quiz</h2>
        <div className="mt-4 space-y-5">
          {pack.quiz.map((q, i) => (
            <div key={i} className="rounded-xl border border-white/10 bg-zinc-950/40 p-4">
              <div className="text-sm font-semibold">{q.q}</div>
              <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-zinc-200">
                {q.options.map((opt, j) => (
                  <li key={j}>
                    <span className={j === q.answerIndex ? "text-emerald-300" : undefined}>
                      {opt}
                    </span>
                  </li>
                ))}
              </ol>
              <div className="mt-3 text-xs text-zinc-400">
                (Correct answer highlighted)
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
