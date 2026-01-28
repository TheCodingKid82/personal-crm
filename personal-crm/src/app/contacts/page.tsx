'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Contact, RelationshipType } from '@/lib/types';
import ConnectionStrength from '@/components/connection-strength';
import RelationshipBadge from '@/components/relationship-badge';
import NeedsAttentionBadge from '@/components/needs-attention-badge';
import SearchBar from '@/components/search-bar';

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'business', 'friend', 'family', 'acquaintance', 'investor', 'mentor', 'client', 'vendor', 'other',
];

type ViewMode = 'table' | 'card';

export default function ContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [relationshipFilter, setRelationshipFilter] = useState('');
  const [sortBy, setSortBy] = useState('updatedAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [view, setView] = useState<ViewMode>('table');

  const fetchContacts = useCallback(async () => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (relationshipFilter) params.set('relationshipType', relationshipFilter);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);

    const res = await fetch(`/api/contacts?${params.toString()}`);
    if (res.ok) {
      const data = await res.json();
      setContacts(data.contacts);
      setTotal(data.total);
    }
    setLoading(false);
  }, [search, relationshipFilter, sortBy, sortOrder]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContacts();
    }, 200);
    return () => clearTimeout(timer);
  }, [fetchContacts]);

  const selectClass = 'bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors';

  return (
    <div className="p-8 max-w-7xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Contacts</h1>
          <p className="text-muted text-sm mt-1">{total} contacts</p>
        </div>
        <Link
          href="/contacts/new"
          className="px-4 py-2 bg-accent hover:bg-accent-hover text-white rounded-lg text-sm font-medium transition-colors"
        >
          + Add Contact
        </Link>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <SearchBar />

        <div className="flex items-center gap-3 ml-auto">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter list..."
            className="bg-surface border border-border rounded-lg px-3 py-2 text-sm text-foreground placeholder:text-muted focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-colors w-48"
          />

          <select value={relationshipFilter} onChange={(e) => setRelationshipFilter(e.target.value)} className={selectClass}>
            <option value="">All Types</option>
            {RELATIONSHIP_TYPES.map((t) => (
              <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>
            ))}
          </select>

          <select
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [sb, so] = e.target.value.split('-');
              setSortBy(sb);
              setSortOrder(so);
            }}
            className={selectClass}
          >
            <option value="updatedAt-desc">Recently Updated</option>
            <option value="firstName-asc">Name A-Z</option>
            <option value="firstName-desc">Name Z-A</option>
            <option value="company-asc">Company A-Z</option>
            <option value="connectionStrength-desc">Strongest First</option>
            <option value="connectionStrength-asc">Weakest First</option>
            <option value="lastContacted-desc">Last Contacted</option>
          </select>

          {/* View Toggle */}
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button
              onClick={() => setView('table')}
              className={`px-3 py-2 text-sm transition-colors ${view === 'table' ? 'bg-accent/20 text-accent' : 'bg-surface text-muted hover:text-foreground'}`}
            >
              ☰
            </button>
            <button
              onClick={() => setView('card')}
              className={`px-3 py-2 text-sm transition-colors ${view === 'card' ? 'bg-accent/20 text-accent' : 'bg-surface text-muted hover:text-foreground'}`}
            >
              ▦
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-16 bg-surface rounded-xl" />
          ))}
        </div>
      ) : contacts.length === 0 ? (
        <div className="text-center py-16 bg-surface border border-border rounded-xl">
          <p className="text-muted text-lg mb-2">No contacts found</p>
          <Link href="/contacts/new" className="text-accent hover:text-accent-hover text-sm">
            Add your first contact →
          </Link>
        </div>
      ) : view === 'table' ? (
        <TableView contacts={contacts} />
      ) : (
        <CardView contacts={contacts} />
      )}
    </div>
  );
}

function TableView({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="bg-surface border border-border rounded-xl overflow-hidden">
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Name</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Company</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Type</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Strength</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Last Contact</th>
            <th className="text-left text-xs font-medium text-muted uppercase tracking-wider px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map((contact) => (
            <tr key={contact.id} className="border-b border-border last:border-b-0 hover:bg-surface-hover transition-colors">
              <td className="px-4 py-3">
                <Link href={`/contacts/${contact.id}`} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-bold">
                    {contact.firstName[0]}{contact.lastName[0]}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-foreground">{contact.firstName} {contact.lastName}</div>
                    {contact.email && <div className="text-xs text-muted">{contact.email}</div>}
                  </div>
                </Link>
              </td>
              <td className="px-4 py-3">
                <div className="text-sm text-foreground">{contact.company || '—'}</div>
                {contact.jobTitle && <div className="text-xs text-muted">{contact.jobTitle}</div>}
              </td>
              <td className="px-4 py-3">
                <RelationshipBadge type={contact.relationshipType} />
              </td>
              <td className="px-4 py-3">
                <ConnectionStrength strength={contact.connectionStrength} size="sm" />
              </td>
              <td className="px-4 py-3">
                <span className="text-sm text-muted">{contact.lastContacted || 'Never'}</span>
              </td>
              <td className="px-4 py-3">
                <NeedsAttentionBadge lastContacted={contact.lastContacted} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function CardView({ contacts }: { contacts: Contact[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {contacts.map((contact) => (
        <Link
          key={contact.id}
          href={`/contacts/${contact.id}`}
          className="bg-surface border border-border rounded-xl p-5 hover:border-accent/50 transition-colors group"
        >
          <div className="flex items-start gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent text-sm font-bold shrink-0">
              {contact.firstName[0]}{contact.lastName[0]}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-medium text-foreground group-hover:text-accent transition-colors">
                {contact.firstName} {contact.lastName}
              </div>
              {contact.company && (
                <div className="text-xs text-muted truncate">
                  {contact.jobTitle ? `${contact.jobTitle} at ` : ''}{contact.company}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <RelationshipBadge type={contact.relationshipType} />
            <NeedsAttentionBadge lastContacted={contact.lastContacted} />
          </div>

          <div className="flex items-center justify-between">
            <ConnectionStrength strength={contact.connectionStrength} size="sm" />
            {contact.tags.length > 0 && (
              <div className="flex gap-1">
                {contact.tags.slice(0, 2).map((tag) => (
                  <span key={tag} className="text-xs text-muted bg-background px-1.5 py-0.5 rounded">{tag}</span>
                ))}
                {contact.tags.length > 2 && (
                  <span className="text-xs text-muted">+{contact.tags.length - 2}</span>
                )}
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
}
