'use client';

import { RelationshipType } from '@/lib/types';

const COLORS: Record<RelationshipType, string> = {
  business: 'bg-blue-500/15 text-blue-400',
  friend: 'bg-green-500/15 text-green-400',
  family: 'bg-pink-500/15 text-pink-400',
  acquaintance: 'bg-zinc-500/15 text-zinc-400',
  investor: 'bg-purple-500/15 text-purple-400',
  mentor: 'bg-amber-500/15 text-amber-400',
  client: 'bg-cyan-500/15 text-cyan-400',
  vendor: 'bg-orange-500/15 text-orange-400',
  other: 'bg-zinc-500/15 text-zinc-400',
};

interface RelationshipBadgeProps {
  type: RelationshipType;
}

export default function RelationshipBadge({ type }: RelationshipBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${COLORS[type] || COLORS.other}`}>
      {type}
    </span>
  );
}
