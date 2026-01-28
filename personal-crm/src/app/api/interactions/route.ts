import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { InteractionInput, Interaction, InteractionWithContact } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const contactId = url.searchParams.get('contactId');
  const limit = parseInt(url.searchParams.get('limit') || '50');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query: string;
  const params: (string | number)[] = [];

  if (contactId) {
    query = `SELECT i.*, c.firstName as contactFirstName, c.lastName as contactLastName
             FROM interactions i
             JOIN contacts c ON i.contactId = c.id
             WHERE i.contactId = ?
             ORDER BY i.date DESC
             LIMIT ? OFFSET ?`;
    params.push(parseInt(contactId), limit, offset);
  } else {
    query = `SELECT i.*, c.firstName as contactFirstName, c.lastName as contactLastName
             FROM interactions i
             JOIN contacts c ON i.contactId = c.id
             ORDER BY i.date DESC
             LIMIT ? OFFSET ?`;
    params.push(limit, offset);
  }

  const rows = db.prepare(query).all(...params) as InteractionWithContact[];
  return NextResponse.json(rows);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: InteractionInput = await request.json();

  const contact = db.prepare('SELECT id FROM contacts WHERE id = ?').get(body.contactId);
  if (!contact) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const stmt = db.prepare(`
    INSERT INTO interactions (contactId, date, type, direction, subject, summary, sentiment)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    body.contactId,
    body.date,
    body.type || 'other',
    body.direction || 'outbound',
    body.subject || null,
    body.summary || null,
    body.sentiment || 'neutral'
  );

  // Update lastContacted on the contact
  db.prepare(`
    UPDATE contacts SET lastContacted = ?, updatedAt = datetime('now') WHERE id = ?
  `).run(body.date, body.contactId);

  const interaction = db.prepare('SELECT * FROM interactions WHERE id = ?').get(result.lastInsertRowid) as Interaction;
  return NextResponse.json(interaction, { status: 201 });
}
