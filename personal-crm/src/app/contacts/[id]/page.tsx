'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Contact, InteractionWithContact } from '@/lib/types';
import ConnectionStrength from '@/components/connection-strength';
import RelationshipBadge from '@/components/relationship-badge';
import NeedsAttentionBadge from '@/components/needs-attention-badge';
import InteractionForm from '@/components/interaction-form';

const TYPE_ICONS: Record<string, string> = {
  email: '✉️',
  call: '📞',
  meeting: '🤝',
  text: '💬',
  social: '🌐',
  other: '📌',
};

const SENTIMENT_COLORS: Record<string, string> = {
  positive: 'text-success',
  neutral: 'text-muted',
  negative: 'text-danger',
};

export default function ContactDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [contact, setContact] = useState<Contact | null>(null);
  const [interactions, setInteractions] = useState<InteractionWithContact[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const id = params.id as string;

  const fetchData = useCallback(async () => {
    const [contactRes, interactionsRes] = await Promise.all([
      fetch(`/api/contacts/${id}`),
      fetch(`/api/interactions?contactId=${id}`),
    ]);

    if (contactRes.ok) {
      setContact(await contactRes.json());
    }
    if (interactionsRes.ok) {
      setInteractions(await interactionsRes.json());
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this contact? This cannot be undone.')) return;
    setDeleting(true);
    const res = await fetch(`/api/contacts/${id}`, { method: 'DELETE' });
    if (res.ok) {
      router.push('/contacts');
    }
    setDeleting(false);
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-surface rounded-lg" />
          <div className="h-64 bg-surface rounded-xl" />
        </div>
      </div>
    );
  }

  if (!contact) {
    return (
      <div className="p-8">
        <p className="text-muted">Contact not found</p>
        <Link href="/contacts" className="text-accent hover:text-accent-hover text-sm mt-2 inline-block">
          ← Back to contacts
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-5xl">
      {/* Back link */}
      <Link href="/contacts" className="text-sm text-muted hover:text-foreground transition-colors mb-4 inline-block">
        ← Back to contacts
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xl font-bold shrink-0">
            {contact.avatar ? (
              <img src={contact.avatar} alt="" className="w-full h-full rounded-full object-cover" />
            ) : (
              `${contact.firstName[0]}${contact.lastName[0]}`
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {contact.firstName} {contact.lastName}
            </h1>
            <div className="flex items-center gap-2 mt-1">
              {contact.jobTitle && <span className="text-sm text-muted">{contact.jobTitle}</span>}
              {contact.jobTitle && contact.company && <span className="text-muted">at</span>}
              {contact.company && <span className="text-sm text-foreground">{contact.company}</span>}
            </div>
            <div className="flex items-center gap-3 mt-2">
              <RelationshipBadge type={contact.relationshipType} />
              <ConnectionStrength strength={contact.connectionStrength} />
              <NeedsAttentionBadge lastContacted={contact.lastContacted} />
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/contacts/${id}/edit`}
            className="px-4 py-2 bg-surface-hover border border-border rounded-lg text-sm text-foreground hover:bg-border transition-colors"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="px-4 py-2 bg-danger/10 border border-danger/30 rounded-lg text-sm text-danger hover:bg-danger/20 transition-colors disabled:opacity-50"
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Contact Info */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Contact Info</h2>
            <div className="space-y-3">
              {contact.email && (
                <InfoRow label="Email" value={contact.email} href={`mailto:${contact.email}`} />
              )}
              {contact.additionalEmails.length > 0 && (
                <InfoRow label="Other Emails" value={contact.additionalEmails.join(', ')} />
              )}
              {contact.phone && (
                <InfoRow label="Phone" value={contact.phone} href={`tel:${contact.phone}`} />
              )}
            </div>
          </div>

          {/* Social Links */}
          {(contact.linkedIn || contact.twitter || contact.website) && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Social</h2>
              <div className="space-y-3">
                {contact.linkedIn && <InfoRow label="LinkedIn" value={contact.linkedIn} href={contact.linkedIn.startsWith('http') ? contact.linkedIn : `https://${contact.linkedIn}`} />}
                {contact.twitter && <InfoRow label="Twitter" value={contact.twitter} href={contact.twitter.startsWith('@') ? `https://twitter.com/${contact.twitter.slice(1)}` : contact.twitter} />}
                {contact.website && <InfoRow label="Website" value={contact.website} href={contact.website.startsWith('http') ? contact.website : `https://${contact.website}`} />}
              </div>
            </div>
          )}

          {/* How We Met */}
          {contact.howWeMet && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">How We Met</h2>
              <p className="text-sm text-muted leading-relaxed">{contact.howWeMet}</p>
            </div>
          )}

          {/* Tags */}
          {contact.tags.length > 0 && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Tags</h2>
              <div className="flex flex-wrap gap-2">
                {contact.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 rounded-md text-xs font-medium bg-accent/15 text-accent">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {contact.notes && (
            <div className="bg-surface border border-border rounded-xl p-5">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Notes</h2>
              <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{contact.notes}</p>
            </div>
          )}

          {/* Timeline */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Timeline</h2>
            <div className="space-y-2">
              {contact.firstContacted && <InfoRow label="First Contact" value={contact.firstContacted} />}
              {contact.lastContacted && <InfoRow label="Last Contact" value={contact.lastContacted} />}
              <InfoRow label="Added" value={contact.createdAt.split('T')[0] || contact.createdAt.split(' ')[0]} />
            </div>
          </div>
        </div>

        {/* Right: Interactions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Add Interaction */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Log Interaction</h2>
              <button
                onClick={() => setShowInteractionForm(!showInteractionForm)}
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                {showInteractionForm ? 'Cancel' : '+ Add'}
              </button>
            </div>
            {showInteractionForm && (
              <InteractionForm
                contactId={contact.id}
                onSuccess={() => {
                  setShowInteractionForm(false);
                  fetchData();
                }}
              />
            )}
          </div>

          {/* Interactions Timeline */}
          <div className="bg-surface border border-border rounded-xl p-5">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">
              Interactions ({interactions.length})
            </h2>
            {interactions.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted text-sm">No interactions logged yet</p>
                <button
                  onClick={() => setShowInteractionForm(true)}
                  className="text-sm text-accent hover:text-accent-hover mt-2"
                >
                  Log your first interaction →
                </button>
              </div>
            ) : (
              <div className="space-y-1">
                {interactions.map((interaction, i) => (
                  <div key={interaction.id} className="flex gap-3 py-3 border-b border-border last:border-b-0">
                    <div className="flex flex-col items-center">
                      <span className="text-lg">{TYPE_ICONS[interaction.type] || '📌'}</span>
                      {i < interactions.length - 1 && (
                        <div className="w-px flex-1 bg-border mt-2" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-foreground capitalize">{interaction.type}</span>
                        <span className="text-xs text-muted">•</span>
                        <span className="text-xs text-muted capitalize">{interaction.direction}</span>
                        <span className="text-xs text-muted">•</span>
                        <span className={`text-xs capitalize ${SENTIMENT_COLORS[interaction.sentiment]}`}>
                          {interaction.sentiment}
                        </span>
                      </div>
                      {interaction.subject && (
                        <p className="text-sm text-foreground mt-1">{interaction.subject}</p>
                      )}
                      {interaction.summary && (
                        <p className="text-sm text-muted mt-1 leading-relaxed">{interaction.summary}</p>
                      )}
                      <p className="text-xs text-muted mt-1.5">{interaction.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs text-muted">{label}</dt>
      <dd className="text-sm text-foreground mt-0.5">
        {href ? (
          <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent hover:text-accent-hover transition-colors">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}
