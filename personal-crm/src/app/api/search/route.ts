import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactRow, parseContact } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const q = url.searchParams.get('q') || '';

  if (!q || q.length < 1) {
    return NextResponse.json([]);
  }

  const searchTerm = `%${q}%`;
  const rows = db.prepare(`
    SELECT * FROM contacts
    WHERE firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR company LIKE ? OR tags LIKE ?
    ORDER BY
      CASE
        WHEN firstName LIKE ? OR lastName LIKE ? THEN 1
        WHEN email LIKE ? THEN 2
        WHEN company LIKE ? THEN 3
        ELSE 4
      END
    LIMIT 20
  `).all(
    searchTerm, searchTerm, searchTerm, searchTerm, searchTerm,
    searchTerm, searchTerm, searchTerm, searchTerm
  ) as ContactRow[];

  return NextResponse.json(rows.map(parseContact));
}
