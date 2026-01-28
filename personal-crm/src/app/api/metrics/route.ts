import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Metric, MetricInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const limit = parseInt(url.searchParams.get('limit') || '30');
  const latest = url.searchParams.get('latest');

  if (latest === 'true') {
    const metric = db.prepare('SELECT * FROM metrics ORDER BY date DESC LIMIT 1').get() as Metric | undefined;
    return NextResponse.json(metric || null);
  }

  const metrics = db.prepare('SELECT * FROM metrics ORDER BY date DESC LIMIT ?').all(limit) as Metric[];
  return NextResponse.json(metrics);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: MetricInput = await request.json();

  const stmt = db.prepare(`
    INSERT INTO metrics (date, mrr, mrrTarget, churnRate, paymentSuccessRate, notes)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    body.date,
    body.mrr,
    body.mrrTarget,
    body.churnRate,
    body.paymentSuccessRate,
    body.notes || null
  );

  const metric = db.prepare('SELECT * FROM metrics WHERE id = ?').get(result.lastInsertRowid) as Metric;

  // Log activity
  db.prepare(`
    INSERT INTO activity_log (type, description, metadata)
    VALUES (?, ?, ?)
  `).run(
    'metric_updated',
    `Updated metrics: MRR $${body.mrr.toLocaleString()} | Churn ${body.churnRate}% | Payment ${body.paymentSuccessRate}%`,
    JSON.stringify({ metricId: metric.id, mrr: body.mrr, churnRate: body.churnRate })
  );

  return NextResponse.json(metric, { status: 201 });
}
