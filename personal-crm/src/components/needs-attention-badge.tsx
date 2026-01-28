'use client';

interface NeedsAttentionBadgeProps {
  lastContacted: string | null;
}

export default function NeedsAttentionBadge({ lastContacted }: NeedsAttentionBadgeProps) {
  if (!lastContacted) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-danger/15 text-danger">
        Never contacted
      </span>
    );
  }

  const daysSince = Math.floor(
    (Date.now() - new Date(lastContacted).getTime()) / (1000 * 60 * 60 * 24)
  );

  if (daysSince > 30) {
    return (
      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-warning/15 text-warning">
        {daysSince}d ago
      </span>
    );
  }

  return null;
}
