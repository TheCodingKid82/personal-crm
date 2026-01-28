import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactInput, ContactRow, parseContact } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const search = url.searchParams.get('search') || '';
  const relationshipType = url.searchParams.get('relationshipType') || '';
  const tag = url.searchParams.get('tag') || '';
  const minStrength = url.searchParams.get('minStrength') || '';
  const maxStrength = url.searchParams.get('maxStrength') || '';
  const sortBy = url.searchParams.get('sortBy') || 'updatedAt';
  const sortOrder = url.searchParams.get('sortOrder') || 'desc';
  const limit = parseInt(url.searchParams.get('limit') || '100');
  const offset = parseInt(url.searchParams.get('offset') || '0');

  let query = 'SELECT * FROM contacts WHERE 1=1';
  const params: (string | number)[] = [];

  if (search) {
    query += ` AND (firstName LIKE ? OR lastName LIKE ? OR email LIKE ? OR company LIKE ? OR notes LIKE ? OR tags LIKE ?)`;
    const searchTerm = `%${search}%`;
    params.push(searchTerm, searchTerm, searchTerm, searchTerm, searchTerm, searchTerm);
  }

  if (relationshipType) {
    query += ' AND relationshipType = ?';
    params.push(relationshipType);
  }

  if (tag) {
    query += ' AND tags LIKE ?';
    params.push(`%"${tag}"%`);
  }

  if (minStrength) {
    query += ' AND connectionStrength >= ?';
    params.push(parseInt(minStrength));
  }

  if (maxStrength) {
    query += ' AND connectionStrength <= ?';
    params.push(parseInt(maxStrength));
  }

  const allowedSorts = ['firstName', 'lastName', 'company', 'connectionStrength', 'lastContacted', 'createdAt', 'updatedAt'];
  const safeSortBy = allowedSorts.includes(sortBy) ? sortBy : 'updatedAt';
  const safeSortOrder = sortOrder === 'asc' ? 'ASC' : 'DESC';
  query += ` ORDER BY ${safeSortBy} ${safeSortOrder}`;
  query += ' LIMIT ? OFFSET ?';
  params.push(limit, offset);

  const rows = db.prepare(query).all(...params) as ContactRow[];
  const contacts = rows.map(parseContact);

  const countQuery = query.replace(/SELECT \*/, 'SELECT COUNT(*) as count').replace(/ ORDER BY.*/, '');
  const countParams = params.slice(0, -2);
  const { count } = db.prepare(countQuery).get(...countParams) as { count: number };

  return NextResponse.json({ contacts, total: count });
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: ContactInput = await request.json();

  const stmt = db.prepare(`
    INSERT INTO contacts (firstName, lastName, email, additionalEmails, phone, company, jobTitle,
      relationshipType, howWeMet, connectionStrength, lastContacted, firstContacted, notes, tags,
      linkedIn, twitter, website, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
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
    body.avatar || null
  );

  const contact = db.prepare('SELECT * FROM contacts WHERE id = ?').get(result.lastInsertRowid) as ContactRow;
  return NextResponse.json(parseContact(contact), { status: 201 });
}
