import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Task, TaskInput } from '@/lib/types';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parseInt(id)) as Task | undefined;

  if (!task) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  return NextResponse.json(task);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();
  const body: Partial<TaskInput> & { status?: string } = await request.json();

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parseInt(id)) as Task | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  const fields: string[] = [];
  const values: (string | number | null)[] = [];

  if (body.title !== undefined) { fields.push('title = ?'); values.push(body.title); }
  if (body.description !== undefined) { fields.push('description = ?'); values.push(body.description || null); }
  if (body.priority !== undefined) { fields.push('priority = ?'); values.push(body.priority); }
  if (body.status !== undefined) { fields.push('status = ?'); values.push(body.status); }
  if (body.impact !== undefined) { fields.push('impact = ?'); values.push(body.impact || null); }
  if (body.project !== undefined) { fields.push('project = ?'); values.push(body.project || null); }

  if (fields.length > 0) {
    fields.push("updatedAt = datetime('now')");
    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    values.push(parseInt(id));
    db.prepare(query).run(...values);
  }

  // Log status changes
  if (body.status && body.status !== existing.status) {
    const statusLabels: Record<string, string> = {
      backlog: 'Backlog',
      in_progress: 'In Progress',
      review: 'Review',
      done: 'Done',
    };
    db.prepare(`
      INSERT INTO activity_log (type, description, metadata)
      VALUES (?, ?, ?)
    `).run(
      'task_moved',
      `Moved "${existing.title}" from ${statusLabels[existing.status] || existing.status} to ${statusLabels[body.status] || body.status}`,
      JSON.stringify({ taskId: parseInt(id), from: existing.status, to: body.status })
    );
  }

  const updated = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parseInt(id)) as Task;
  return NextResponse.json(updated);
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const db = getDb();

  const existing = db.prepare('SELECT * FROM tasks WHERE id = ?').get(parseInt(id)) as Task | undefined;
  if (!existing) {
    return NextResponse.json({ error: 'Task not found' }, { status: 404 });
  }

  db.prepare('DELETE FROM tasks WHERE id = ?').run(parseInt(id));

  return NextResponse.json({ success: true });
}
