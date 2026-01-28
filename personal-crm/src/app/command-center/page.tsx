'use client';

import { useEffect, useState, useCallback } from 'react';
import { Task, Metric, ActivityLog, TaskPriority, TaskStatus } from '@/lib/types';

const STATUS_COLUMNS: { key: TaskStatus; label: string; icon: string }[] = [
  { key: 'backlog', label: 'Backlog', icon: '📋' },
  { key: 'in_progress', label: 'In Progress', icon: '🔨' },
  { key: 'review', label: 'Review', icon: '🔍' },
  { key: 'done', label: 'Done', icon: '✅' },
];

const PRIORITY_COLORS: Record<TaskPriority, string> = {
  P0: 'bg-danger text-white',
  P1: 'bg-warning text-black',
  P2: 'bg-accent text-white',
  P3: 'bg-border text-foreground',
};

const ACTIVITY_ICONS: Record<string, string> = {
  contact_added: '👤',
  task_created: '📝',
  task_moved: '➡️',
  metric_updated: '📊',
  note: '💬',
};

export default function CommandCenterPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [metric, setMetric] = useState<Metric | null>(null);
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showMetricModal, setShowMetricModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  const fetchAll = useCallback(async () => {
    const [tasksRes, metricRes, activityRes] = await Promise.all([
      fetch('/api/tasks'),
      fetch('/api/metrics?latest=true'),
      fetch('/api/activity?limit=15'),
    ]);
    const [tasksData, metricData, activityData] = await Promise.all([
      tasksRes.json(),
      metricRes.json(),
      activityRes.json(),
    ]);
    setTasks(tasksData);
    setMetric(metricData);
    setActivities(activityData);
    setLoading(false);
  }, []);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const moveTask = async (taskId: number, newStatus: TaskStatus) => {
    await fetch(`/api/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });
    fetchAll();
  };

  const deleteTask = async (taskId: number) => {
    await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    fetchAll();
  };

  // Compute metrics
  const mrr = metric?.mrr ?? 0;
  const mrrTarget = metric?.mrrTarget ?? 100000;
  const churnRate = metric?.churnRate ?? 0;
  const paymentSuccess = metric?.paymentSuccessRate ?? 0;
  const progress = mrrTarget > 0 ? (mrr / mrrTarget) * 100 : 0;

  // Days to goal - target Feb 25, 2026
  const goalDate = new Date('2026-02-25');
  const now = new Date();
  const daysToGoal = Math.max(0, Math.ceil((goalDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-64 bg-surface rounded-lg" />
          <div className="grid grid-cols-5 gap-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-28 bg-surface rounded-xl" />
            ))}
          </div>
          <div className="h-12 bg-surface rounded-xl" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-96 bg-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Command Center</h1>
          <p className="text-muted text-sm mt-1">Spark Studio — Business Metrics & Task Board</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowMetricModal(true)}
            className="px-4 py-2 bg-surface border border-border hover:border-accent text-foreground rounded-lg text-sm font-medium transition-colors"
          >
            📊 Update Metrics
          </button>
          <button
            onClick={() => { setEditingTask(null); setShowTaskModal(true); }}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
          >
            + Add Task
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <MetricCard label="Current MRR" value={`$${mrr.toLocaleString()}`} />
        <MetricCard label="Target MRR" value={`$${mrrTarget.toLocaleString()}`} />
        <MetricCard label="Churn Rate" value={`${churnRate}%`} accent={churnRate > 10 ? 'text-danger' : 'text-success'} />
        <MetricCard label="Payment Success" value={`${paymentSuccess}%`} accent={paymentSuccess < 70 ? 'text-danger' : 'text-success'} />
        <MetricCard label="Days to Goal" value={`${daysToGoal}`} />
      </div>

      {/* Goal Progress Bar */}
      <div className="bg-surface border border-border rounded-xl p-5 mb-6">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">
            Progress to ${mrrTarget.toLocaleString()} MRR
          </h3>
          <span className="text-sm text-muted">
            {progress.toFixed(1)}% (${mrr.toLocaleString()} / ${mrrTarget.toLocaleString()})
          </span>
        </div>
        <div className="w-full bg-background rounded-full h-4 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-accent to-warning transition-all duration-500"
            style={{ width: `${Math.min(progress, 100)}%` }}
          />
        </div>
      </div>

      {/* Kanban Board */}
      <div className="mb-6">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Task Board</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {STATUS_COLUMNS.map((col) => {
            const columnTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div
                key={col.key}
                className="bg-surface border border-border rounded-xl p-4 min-h-[300px]"
                onDragOver={(e) => { e.preventDefault(); e.currentTarget.classList.add('border-accent'); }}
                onDragLeave={(e) => { e.currentTarget.classList.remove('border-accent'); }}
                onDrop={(e) => {
                  e.preventDefault();
                  e.currentTarget.classList.remove('border-accent');
                  if (draggedTask && draggedTask.status !== col.key) {
                    moveTask(draggedTask.id, col.key);
                  }
                  setDraggedTask(null);
                }}
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-border">
                  <span className="text-sm font-semibold text-foreground">
                    {col.icon} {col.label}
                  </span>
                  <span className="text-xs bg-background px-2 py-0.5 rounded-full text-muted">
                    {columnTasks.length}
                  </span>
                </div>
                <div className="space-y-2">
                  {columnTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={() => { setEditingTask(task); setShowTaskModal(true); }}
                      onDelete={() => deleteTask(task.id)}
                      onDragStart={() => setDraggedTask(task)}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Activity Log */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-muted py-4 text-center">No activity yet</p>
        ) : (
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {activities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors border-l-2 border-accent/30">
                <span className="text-base shrink-0">{ACTIVITY_ICONS[activity.type] || '📌'}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-foreground">{activity.description}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {new Date(activity.createdAt).toLocaleString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                      hour: 'numeric', minute: '2-digit', hour12: true,
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <TaskModal
          task={editingTask}
          onClose={() => { setShowTaskModal(false); setEditingTask(null); }}
          onSaved={() => { setShowTaskModal(false); setEditingTask(null); fetchAll(); }}
        />
      )}

      {/* Metric Modal */}
      {showMetricModal && (
        <MetricModal
          current={metric}
          onClose={() => setShowMetricModal(false)}
          onSaved={() => { setShowMetricModal(false); fetchAll(); }}
        />
      )}
    </div>
  );
}

function MetricCard({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className={`text-2xl font-bold ${accent || 'text-foreground'}`}>{value}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}

function TaskCard({
  task,
  onEdit,
  onDelete,
  onDragStart,
}: {
  task: Task;
  onEdit: () => void;
  onDelete: () => void;
  onDragStart: () => void;
}) {
  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="bg-background border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-accent/40 transition-all group"
    >
      <div className="flex items-start justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{task.title}</span>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={onEdit} className="text-xs text-muted hover:text-accent p-0.5" title="Edit">✏️</button>
          <button onClick={onDelete} className="text-xs text-muted hover:text-danger p-0.5" title="Delete">🗑️</button>
        </div>
      </div>
      {task.description && (
        <p className="text-xs text-muted mb-2 line-clamp-2">{task.description}</p>
      )}
      <div className="flex items-center justify-between">
        <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${PRIORITY_COLORS[task.priority]}`}>
          {task.priority}
        </span>
        {task.impact && (
          <span className="text-xs text-success">{task.impact}</span>
        )}
      </div>
      {task.project && (
        <div className="mt-1.5">
          <span className="text-xs text-muted bg-surface px-1.5 py-0.5 rounded">{task.project}</span>
        </div>
      )}
    </div>
  );
}

function TaskModal({
  task,
  onClose,
  onSaved,
}: {
  task: Task | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [priority, setPriority] = useState<TaskPriority>(task?.priority || 'P2');
  const [status, setStatus] = useState<TaskStatus>(task?.status || 'backlog');
  const [impact, setImpact] = useState(task?.impact || '');
  const [project, setProject] = useState(task?.project || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!title.trim()) return;
    setSaving(true);

    const body = { title, description: description || null, priority, status, impact: impact || null, project: project || null };

    if (task) {
      await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } else {
      await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    }

    onSaved();
  };

  const inputClass = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';
  const selectClass = 'bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-foreground mb-4">
          {task ? 'Edit Task' : 'New Task'}
        </h2>
        <div className="space-y-3">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" className={inputClass} autoFocus />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" className={`${inputClass} h-20 resize-none`} />
          <div className="grid grid-cols-2 gap-3">
            <select value={priority} onChange={(e) => setPriority(e.target.value as TaskPriority)} className={selectClass}>
              <option value="P0">P0 — Critical</option>
              <option value="P1">P1 — High</option>
              <option value="P2">P2 — Medium</option>
              <option value="P3">P3 — Low</option>
            </select>
            <select value={status} onChange={(e) => setStatus(e.target.value as TaskStatus)} className={selectClass}>
              <option value="backlog">Backlog</option>
              <option value="in_progress">In Progress</option>
              <option value="review">Review</option>
              <option value="done">Done</option>
            </select>
          </div>
          <input value={impact} onChange={(e) => setImpact(e.target.value)} placeholder="Impact (e.g. +$2k MRR potential)" className={inputClass} />
          <input value={project} onChange={(e) => setProject(e.target.value)} placeholder="Project (e.g. Announcements, Booked.Travel)" className={inputClass} />
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!title.trim() || saving}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : task ? 'Update' : 'Create'}
          </button>
        </div>
      </div>
    </div>
  );
}

function MetricModal({
  current,
  onClose,
  onSaved,
}: {
  current: Metric | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const [mrr, setMrr] = useState(current?.mrr?.toString() || '');
  const [mrrTarget, setMrrTarget] = useState(current?.mrrTarget?.toString() || '100000');
  const [churnRate, setChurnRate] = useState(current?.churnRate?.toString() || '');
  const [paymentSuccessRate, setPaymentSuccessRate] = useState(current?.paymentSuccessRate?.toString() || '');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        mrr: parseFloat(mrr) || 0,
        mrrTarget: parseFloat(mrrTarget) || 100000,
        churnRate: parseFloat(churnRate) || 0,
        paymentSuccessRate: parseFloat(paymentSuccessRate) || 0,
        notes: notes || null,
      }),
    });
    onSaved();
  };

  const inputClass = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60" onClick={onClose}>
      <div className="bg-surface border border-border rounded-xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-lg font-semibold text-foreground mb-4">Update Metrics</h2>
        <div className="space-y-3">
          <div>
            <label className="text-xs text-muted mb-1 block">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputClass} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Current MRR ($)</label>
              <input type="number" value={mrr} onChange={(e) => setMrr(e.target.value)} placeholder="8535" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Target MRR ($)</label>
              <input type="number" value={mrrTarget} onChange={(e) => setMrrTarget(e.target.value)} placeholder="100000" className={inputClass} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-muted mb-1 block">Churn Rate (%)</label>
              <input type="number" step="0.01" value={churnRate} onChange={(e) => setChurnRate(e.target.value)} placeholder="23.14" className={inputClass} />
            </div>
            <div>
              <label className="text-xs text-muted mb-1 block">Payment Success (%)</label>
              <input type="number" step="0.01" value={paymentSuccessRate} onChange={(e) => setPaymentSuccessRate(e.target.value)} placeholder="40.47" className={inputClass} />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted mb-1 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="What changed?" className={`${inputClass} h-16 resize-none`} />
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-5">
          <button onClick={onClose} className="px-4 py-2 text-sm text-muted hover:text-foreground transition-colors">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Metrics'}
          </button>
        </div>
      </div>
    </div>
  );
}
