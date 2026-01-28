import { NextRequest, NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { Task, TaskInput } from '@/lib/types';

export async function GET(request: NextRequest) {
  const db = getDb();
  const url = new URL(request.url);
  const status = url.searchParams.get('status') || '';
  const priority = url.searchParams.get('priority') || '';
  const project = url.searchParams.get('project') || '';

  let query = 'SELECT * FROM tasks WHERE 1=1';
  const params: (string | number)[] = [];

  if (status) {
    query += ' AND status = ?';
    params.push(status);
  }
  if (priority) {
    query += ' AND priority = ?';
    params.push(priority);
  }
  if (project) {
    query += ' AND project = ?';
    params.push(project);
  }

  query += ' ORDER BY CASE priority WHEN \'P0\' THEN 0 WHEN \'P1\' THEN 1 WHEN \'P2\' THEN 2 WHEN \'P3\' THEN 3 END, updatedAt DESC';

  const tasks = db.prepare(query).all(...params) as Task[];
  return NextResponse.json(tasks);
}

export async function POST(request: NextRequest) {
  const db = getDb();
  const body: TaskInput = await request.json();

  const stmt = db.prepare(`
    INSERT INTO tasks (title, description, priority, status, impact, project)
    VALUES (?, ?, ?, ?, ?, ?)
  `);

  const result = stmt.run(
    body.title,
    body.description || null,
    body.priority || 'P2',
    body.status || 'backlog',
    body.impact || null,
    body.project || null
  );

  const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid) as Task;

  // Log activity
  db.prepare(`
    INSERT INTO activity_log (type, description, metadata)
    VALUES (?, ?, ?)
  `).run(
    'task_created',
    `Created task: ${body.title}`,
    JSON.stringify({ taskId: task.id, title: body.title, priority: body.priority || 'P2' })
  );

  return NextResponse.json(task, { status: 201 });
}
