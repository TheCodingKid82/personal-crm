import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ActivityLog, ActivityLogInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '20');
  const offset = parseInt(url.searchParams.get('offset') || '0');
  const type = url.searchParams.get('type') || '';

  let query = 'SELECT * FROM activity_log WHERE 1=1';
  const params: (string | number)[] = [];

  if (type) {
    query += ' AND type = ?';
    params.push(type);
  }

  query += ' ORDER BY createdAt DESC LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const logs = db.prepare(query).all(...params) as ActivityLog[];
  return NextResponse.json(logs);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: ActivityLogInput = await request.json();

  const stmt = db.prepare(`
    INSERT INTO activity_log (type, description, metadata)
    VALUES (?, ?, ?)
  `);

  const result = stmt.run(
    body.type,
    body.description,
    body.metadata ? JSON.stringify(body.metadata) : null
  );

  const log = db.prepare('SELECT * FROM activity_log WHERE id = ?').get(result.lastInsertRowid) as ActivityLog;
  return NextResponse.json(log, { status: 201 });
}
