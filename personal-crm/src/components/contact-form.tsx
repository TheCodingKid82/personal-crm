'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Contact, ContactInput, RelationshipType } from '@/lib/types';

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'business', 'friend', 'family', 'acquaintance', 'investor', 'mentor', 'client', 'vendor', 'other',
];

interface ContactFormProps {
  contact?: Contact;
}

export default function ContactForm({ contact }: ContactFormProps) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [tagInput, setTagInput] = useState('');

  const [form, setForm] = useState<ContactInput>({
    firstName: contact?.firstName || '',
    lastName: contact?.lastName || '',
    email: contact?.email || '',
    additionalEmails: contact?.additionalEmails || [],
    phone: contact?.phone || '',
    company: contact?.company || '',
    jobTitle: contact?.jobTitle || '',
    relationshipType: contact?.relationshipType || 'other',
    howWeMet: contact?.howWeMet || '',
    connectionStrength: contact?.connectionStrength || 3,
    lastContacted: contact?.lastContacted || '',
    firstContacted: contact?.firstContacted || '',
    notes: contact?.notes || '',
    tags: contact?.tags || [],
    linkedIn: contact?.linkedIn || '',
    twitter: contact?.twitter || '',
    website: contact?.website || '',
    avatar: contact?.avatar || '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !form.tags?.includes(tag)) {
      setForm((prev) => ({ ...prev, tags: [...(prev.tags || []), tag] }));
      setTagInput('');
    }
  };

  const removeTag = (tag: string) => {
    setForm((prev) => ({ ...prev, tags: (prev.tags || []).filter((t) => t !== tag) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const url = contact ? `/api/contacts/${contact.id}` : '/api/contacts';
      const method = contact ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        const saved = await res.json();
        router.push(`/contacts/${saved.id}`);
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  };

  const inputClass = 'w-full bg-background border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';
  const labelClass = 'block text-sm font-medium text-muted mb-1.5';

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">
      {/* Name */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Basic Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Name *</label>
            <input name="firstName" value={form.firstName} onChange={handleChange} required className={inputClass} placeholder="First name" />
          </div>
          <div>
            <label className={labelClass}>Last Name *</label>
            <input name="lastName" value={form.lastName} onChange={handleChange} required className={inputClass} placeholder="Last name" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input name="email" type="email" value={form.email || ''} onChange={handleChange} className={inputClass} placeholder="email@example.com" />
          </div>
          <div>
            <label className={labelClass}>Phone</label>
            <input name="phone" value={form.phone || ''} onChange={handleChange} className={inputClass} placeholder="+1 (555) 000-0000" />
          </div>
          <div>
            <label className={labelClass}>Company</label>
            <input name="company" value={form.company || ''} onChange={handleChange} className={inputClass} placeholder="Company name" />
          </div>
          <div>
            <label className={labelClass}>Job Title</label>
            <input name="jobTitle" value={form.jobTitle || ''} onChange={handleChange} className={inputClass} placeholder="Job title" />
          </div>
        </div>
      </section>

      {/* Relationship */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Relationship</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>Relationship Type</label>
            <select name="relationshipType" value={form.relationshipType} onChange={handleChange} className={inputClass}>
              {RELATIONSHIP_TYPES.map((t) => (
                <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Connection Strength (1-5)</label>
            <input
              name="connectionStrength"
              type="range"
              min={1}
              max={5}
              value={form.connectionStrength || 3}
              onChange={(e) => setForm((prev) => ({ ...prev, connectionStrength: parseInt(e.target.value) }))}
              className="w-full accent-accent"
            />
            <div className="flex justify-between text-xs text-muted mt-1">
              <span>1 - Weak</span>
              <span className="text-foreground font-medium">{form.connectionStrength}</span>
              <span>5 - Strong</span>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>How We Met</label>
            <textarea name="howWeMet" value={form.howWeMet || ''} onChange={handleChange} className={inputClass} rows={2} placeholder="How did you meet this person?" />
          </div>
        </div>
      </section>

      {/* Dates */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Timeline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>First Contacted</label>
            <input name="firstContacted" type="date" value={form.firstContacted || ''} onChange={handleChange} className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>Last Contacted</label>
            <input name="lastContacted" type="date" value={form.lastContacted || ''} onChange={handleChange} className={inputClass} />
          </div>
        </div>
      </section>

      {/* Tags */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Tags</h3>
        <div className="flex gap-2 mb-3 flex-wrap">
          {(form.tags || []).map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium bg-accent/15 text-accent">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="hover:text-foreground">×</button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
            className={inputClass}
            placeholder="Add a tag and press Enter"
          />
          <button type="button" onClick={addTag} className="px-4 py-2 bg-surface-hover border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors whitespace-nowrap">
            Add
          </button>
        </div>
      </section>

      {/* Social */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>LinkedIn</label>
            <input name="linkedIn" value={form.linkedIn || ''} onChange={handleChange} className={inputClass} placeholder="linkedin.com/in/..." />
          </div>
          <div>
            <label className={labelClass}>Twitter / X</label>
            <input name="twitter" value={form.twitter || ''} onChange={handleChange} className={inputClass} placeholder="@handle" />
          </div>
          <div>
            <label className={labelClass}>Website</label>
            <input name="website" value={form.website || ''} onChange={handleChange} className={inputClass} placeholder="https://..." />
          </div>
        </div>
      </section>

      {/* Notes */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Notes</h3>
        <textarea name="notes" value={form.notes || ''} onChange={handleChange} className={inputClass} rows={4} placeholder="General notes about this person..." />
      </section>

      {/* Avatar */}
      <section>
        <h3 className="text-sm font-semibold text-foreground mb-4 uppercase tracking-wider">Avatar</h3>
        <input name="avatar" value={form.avatar || ''} onChange={handleChange} className={inputClass} placeholder="https://... (image URL)" />
      </section>

      {/* Submit */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
        >
          {saving ? 'Saving...' : contact ? 'Update Contact' : 'Create Contact'}
        </button>
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-surface-hover border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
