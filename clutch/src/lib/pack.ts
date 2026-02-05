export type Flashcard = {
  q: string;
  a: string;
};

export type QuizQuestion = {
  q: string;
  options: string[];
  answerIndex: number;
};

export type ReviewPack = {
  title: string;
  onePager: {
    summary: string;
    keyPoints: string[];
  };
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
};

const STOPWORDS = new Set(
  [
    "the",
    "and",
    "that",
    "with",
    "from",
    "this",
    "these",
    "those",
    "into",
    "your",
    "you",
    "are",
    "was",
    "were",
    "has",
    "have",
    "had",
    "their",
    "there",
    "then",
    "than",
    "also",
    "because",
    "which",
    "what",
    "when",
    "where",
    "why",
    "how",
    "can",
    "could",
    "should",
    "would",
    "will",
    "just",
    "about",
    "over",
    "under",
    "between",
    "through",
    "before",
    "after",
    "during",
    "while",
    "them",
    "they",
    "we",
    "our",
    "us",
    "i",
    "me",
    "my",
    "it",
    "its",
    "in",
    "on",
    "at",
    "of",
    "to",
    "for",
    "as",
    "is",
    "be",
    "by",
    "an",
    "a",
  ].map((w) => w.toLowerCase()),
);

function normalize(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function splitSentences(text: string): string[] {
  const cleaned = normalize(text);
  if (!cleaned) return [];
  // Simple sentence splitter.
  return cleaned
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .map((w) => w.trim())
    .filter((w) => w.length >= 4 && !STOPWORDS.has(w));
}

function topKeywords(text: string, limit = 8): string[] {
  const freq = new Map<string, number>();
  for (const w of tokenize(text)) {
    freq.set(w, (freq.get(w) ?? 0) + 1);
  }

  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([w]) => w);
}

function pickTitle(text: string): string {
  const firstLine = text.split(/\r?\n/).find((l) => l.trim().length > 0);
  if (firstLine) {
    const t = firstLine.trim();
    if (t.length <= 80) return t;
  }
  const kws = topKeywords(text, 3);
  if (kws.length) return `Review: ${kws.map((k) => k[0].toUpperCase() + k.slice(1)).join(", ")}`;
  return "Review Pack";
}

export function deriveReviewPack(sourceText: string): ReviewPack {
  const text = normalize(sourceText);
  const sentences = splitSentences(text);

  const title = pickTitle(text);

  const summary =
    sentences.slice(0, 2).join(" ") ||
    (text.length > 220 ? `${text.slice(0, 220)}…` : text) ||
    "(No text provided)";

  const keyPoints = sentences
    .slice(0, 6)
    .map((s) => s.replace(/^[\-•\*]\s*/, ""))
    .filter(Boolean);

  const kws = topKeywords(text, 10);

  const flashcards: Flashcard[] = kws.slice(0, 8).map((kw) => {
    const sentence =
      sentences.find((s) => s.toLowerCase().includes(kw.toLowerCase())) ||
      "";
    const a = sentence
      ? sentence
      : `Define or explain “${kw}” based on your notes.`;

    return {
      q: `What is ${kw}?`,
      a,
    };
  });

  // Build a tiny multiple-choice quiz from flashcards.
  const quiz: QuizQuestion[] = flashcards.slice(0, 5).map((fc, idx) => {
    const answer = fc.a.length > 120 ? fc.a.slice(0, 120).trim() + "…" : fc.a;
    const distractors = flashcards
      .filter((_, j) => j !== idx)
      .slice(0, 3)
      .map((d) => {
        const t = d.a.length > 120 ? d.a.slice(0, 120).trim() + "…" : d.a;
        return t || `Not: ${d.q}`;
      });

    const options = [answer, ...distractors].slice(0, 4);
    // Naive shuffle (stable enough for mock).
    const shuffled = [...options].sort(() => Math.random() - 0.5);
    const answerIndex = shuffled.indexOf(answer);

    return {
      q: fc.q,
      options: shuffled,
      answerIndex: Math.max(0, answerIndex),
    };
  });

  return {
    title,
    onePager: {
      summary,
      keyPoints,
    },
    flashcards,
    quiz,
  };
}
