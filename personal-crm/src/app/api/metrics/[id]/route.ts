import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Metric, MetricInput } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const metric = db.prepare('SELECT * FROM metrics WHERE id = ?').get(parseInt(id)) as Metric | undefined;

  if (!metric) {
    return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
  }

  return NextResponse.json(metric);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const body: Partial<MetricInput> = await request.json();

  const existing = db.prepare('SELECT * FROM metrics WHERE id = ?').get(parseInt(id)) as Metric | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (body.date !== undefined) { fields.push('date = ?'); values.push(body.date); }
  if (body.mrr !== undefined) { fields.push('mrr = ?'); values.push(body.mrr); }
  if (body.mrrTarget !== undefined) { fields.push('mrrTarget = ?'); values.push(body.mrrTarget); }
  if (body.churnRate !== undefined) { fields.push('churnRate = ?'); values.push(body.churnRate); }
  if (body.paymentSuccessRate !== undefined) { fields.push('paymentSuccessRate = ?'); values.push(body.paymentSuccessRate); }
  if (body.notes !== undefined) { fields.push('notes = ?'); values.push(body.notes || null); }

  if (fields.length > 0) {
    const query = `UPDATE metrics SET ${fields.join(', ')} WHERE id = ?`;
    values.push(parseInt(id));
    db.prepare(query).run(...values);
  }

  const updated = db.prepare('SELECT * FROM metrics WHERE id = ?').get(parseInt(id)) as Metric;

  // Log activity
  db.prepare(`
    INSERT INTO activity_log (type, description, metadata)
    VALUES (?, ?, ?)
  `).run(
    'metric_updated',
    `Updated metrics for ${updated.date}`,
    JSON.stringify({ metricId: parseInt(id) })
  );

  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM metrics WHERE id = ?').get(parseInt(id)) as Metric | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Metric not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM metrics WHERE id = ?').run(parseInt(id));
  return NextResponse.json({ success: true });
}
