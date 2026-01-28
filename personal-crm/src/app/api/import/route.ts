import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { ContactInput } from '@/lib/types';

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: { contacts: ContactInput[] } = await request.json();

  if (!Array.isArray(body.contacts)) {
    return NextResponse.json({ error: 'Expected { contacts: [...] }' }, { status: 400 });
  }

  const stmt = db.prepare(`
    INSERT INTO contacts (firstName, lastName, email, additionalEmails, phone, company, jobTitle,
      relationshipType, howWeMet, connectionStrength, lastContacted, firstContacted, notes, tags,
      linkedIn, twitter, website, avatar)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((contacts: ContactInput[]) => {
    let imported = 0;
    for (const c of contacts) {
      if (!c.firstName || !c.lastName) continue;
      stmt.run(
        c.firstName,
        c.lastName,
        c.email || null,
        JSON.stringify(c.additionalEmails || []),
        c.phone || null,
        c.company || null,
        c.jobTitle || null,
        c.relationshipType || 'other',
        c.howWeMet || null,
        c.connectionStrength || 3,
        c.lastContacted || null,
        c.firstContacted || null,
        c.notes || null,
        JSON.stringify(c.tags || []),
        c.linkedIn || null,
        c.twitter || null,
        c.website || null,
        c.avatar || null
      );
      imported++;
    }
    return imported;
  });

  const imported = insertMany(body.contacts);
  return NextResponse.json({ imported, total: body.contacts.length }, { status: 201 });
}
