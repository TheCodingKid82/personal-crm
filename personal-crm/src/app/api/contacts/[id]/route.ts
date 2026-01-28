import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactInput, ContactRow, parseContact } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();
  const row = db.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(id)) as ContactRow | undefined;

  if (!row) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  return NextResponse.json(parseContact(row));
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();
  const body: ContactInput = await request.json();

  const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(id)) as ContactRow | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  const stmt = db.prepare(`
    UPDATE contacts SET
      firstName = ?, lastName = ?, email = ?, additionalEmails = ?, phone = ?,
      company = ?, jobTitle = ?, relationshipType = ?, howWeMet = ?,
      connectionStrength = ?, lastContacted = ?, firstContacted = ?,
      notes = ?, tags = ?, linkedIn = ?, twitter = ?, website = ?, avatar = ?,
      updatedAt = datetime('now')
    WHERE id = ?
  `);

  stmt.run(
    body.firstName,
    body.lastName,
    body.email || null,
    JSON.stringify(body.additionalEmails || []),
    body.phone || null,
    body.company || null,
    body.jobTitle || null,
    body.relationshipType || 'other',
    body.howWeMet || null,
    body.connectionStrength || 3,
    body.lastContacted || null,
    body.firstContacted || null,
    body.notes || null,
    JSON.stringify(body.tags || []),
    body.linkedIn || null,
    body.twitter || null,
    body.website || null,
    body.avatar || null,
    parseInt(id)
  );

  const updated = db.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(id)) as ContactRow;
  return NextResponse.json(parseContact(updated));
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM contacts WHERE id = ?').get(parseInt(id));
  if (!existing) {
    return NextResponse.json({ error: 'Contact not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM contacts WHERE id = ?').run(parseInt(id));
  return NextResponse.json({ success: true });
}
