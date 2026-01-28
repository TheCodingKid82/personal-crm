'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InteractionInput, InteractionType, Direction, Sentiment } from '@/lib/types';

const INTERACTION_TYPES: InteractionType[] = ['email', 'call', 'meeting', 'text', 'social', 'other'];
const DIRECTIONS: Direction[] = ['outbound', 'inbound'];
const SENTIMENTS: Sentiment[] = ['positive', 'neutral', 'negative'];

interface InteractionFormProps {
  contactId: number;
  onSuccess?: () => void;
}

export default function InteractionForm({ contactId, onSuccess }: InteractionFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<InteractionInput>({
    contactId,
    date: new Date().toISOString().split('T')[0],
    type: 'email',
    direction: 'outbound',
    subject: '',
    summary: '',
    sentiment: 'neutral',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch('/api/interactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setForm({
          contactId,
          date: new Date().toISOString().split('T')[0],
          type: 'email',
          direction: 'outbound',
          subject: '',
          summary: '',
          sentiment: 'neutral',
        });
        router.refresh();
        onSuccess?.();
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';
  const labelClass = 'block text-sm font-medium text-muted mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div>
          <label className={labelClass}>Date</label>
          <input name="date" type="date" value={form.date} onChange={handleChange} required className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Type</label>
          <select name="type" value={form.type} onChange={handleChange} className={inputClass}>
            {INTERACTION_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Direction</label>
          <select name="direction" value={form.direction} onChange={handleChange} className={inputClass}>
            {DIRECTIONS.map((d) => (
              <option key={d} value={d}>{d.charAt(0).toUpperCase() + d.slice(1)}</option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>Sentiment</label>
          <select name="sentiment" value={form.sentiment} onChange={handleChange} className={inputClass}>
            {SENTIMENTS.map((s) => (
              <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={labelClass}>Subject</label>
        <input name="subject" value={form.subject || ''} onChange={handleChange} className={inputClass} placeholder="What was it about?" />
      </div>

      <div>
        <label className={labelClass}>Summary</label>
        <textarea name="summary" value={form.summary || ''} onChange={handleChange} className={inputClass} rows={3} placeholder="Brief summary of the interaction..." />
      </div>

      <button
        type="submit"
        disabled={saving}
        className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
      >
        {saving ? 'Adding...' : 'Add Interaction'}
      </button>
    </form>
  );
}
