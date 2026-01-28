import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Interaction } from '@/lib/types';

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();
  const row = db.prepare('SELECT * FROM interactions WHERE id = ?').get(parseInt(id)) as Interaction | undefined;

  if (!row) {
    return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
  }

  return NextResponse.json(row);
}

export async function PUT(request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();
  const body = await request.json();

  const existing = db.prepare('SELECT * FROM interactions WHERE id = ?').get(parseInt(id));
  if (!existing) {
    return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
  }

  const stmt = db.prepare(`
    UPDATE interactions SET
      date = ?, type = ?, direction = ?, subject = ?, summary = ?, sentiment = ?
    WHERE id = ?
  `);

  stmt.run(
    body.date,
    body.type || 'other',
    body.direction || 'outbound',
    body.subject || null,
    body.summary || null,
    body.sentiment || 'neutral',
    parseInt(id)
  );

  const updated = db.prepare('SELECT * FROM interactions WHERE id = ?').get(parseInt(id)) as Interaction;
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  const { id } = await context.params;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM interactions WHERE id = ?').get(parseInt(id));
  if (!existing) {
    return NextResponse.json({ error: 'Interaction not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM interactions WHERE id = ?').run(parseInt(id));
  return NextResponse.json({ success: true });
}
