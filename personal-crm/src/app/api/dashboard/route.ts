import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { DashboardStats, InteractionWithContact } from '@/lib/types';

export async function GET() {
  const db = getDb();

  const { totalContacts } = db.prepare('SELECT COUNT(*) as totalContacts FROM contacts').get() as { totalContacts: number };

  const { recentlyContacted } = db.prepare(`
    SELECT COUNT(*) as recentlyContacted FROM contacts
    WHERE lastContacted >= date('now', '-7 days')
  `).get() as { recentlyContacted: number };

  const { needsAttention } = db.prepare(`
    SELECT COUNT(*) as needsAttention FROM contacts
    WHERE lastContacted < date('now', '-30 days') OR lastContacted IS NULL
  `).get() as { needsAttention: number };

  const strengthDistribution = db.prepare(`
    SELECT connectionStrength as strength, COUNT(*) as count
    FROM contacts
    GROUP BY connectionStrength
    ORDER BY connectionStrength
  `).all() as { strength: number; count: number }[];

  const recentInteractions = db.prepare(`
    SELECT i.*, c.firstName as contactFirstName, c.lastName as contactLastName
    FROM interactions i
    JOIN contacts c ON i.contactId = c.id
    ORDER BY i.date DESC
    LIMIT 10
  `).all() as InteractionWithContact[];

  const relationshipBreakdown = db.prepare(`
    SELECT relationshipType as type, COUNT(*) as count
    FROM contacts
    GROUP BY relationshipType
    ORDER BY count DESC
  `).all() as { type: string; count: number }[];

  const stats: DashboardStats = {
    totalContacts,
    recentlyContacted,
    needsAttention,
    strengthDistribution,
    recentInteractions,
    relationshipBreakdown,
  };

  return NextResponse.json(stats);
}
