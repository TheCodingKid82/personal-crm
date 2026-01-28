'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { DashboardStats } from '@/lib/types';
import ConnectionStrength from '@/components/connection-strength';

const SENTIMENT_ICONS: Record<string, string> = {
  positive: '😊',
  neutral: '😐',
  negative: '😟',
};

const TYPE_ICONS: Record<string, string> = {
  email: '✉️',
  call: '📞',
  meeting: '🤝',
  text: '💬',
  social: '🌐',
  other: '📌',
};

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-surface rounded-lg" />
          <div className="grid grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-28 bg-surface rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!stats) return null;

  return (
    <div className="p-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted text-sm mt-1">Overview of your network</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <StatCard label="Total Contacts" value={stats.totalContacts} icon="👥" />
        <StatCard label="Contacted This Week" value={stats.recentlyContacted} icon="✅" accent="text-success" />
        <StatCard label="Needs Attention" value={stats.needsAttention} icon="⚠️" accent="text-warning" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Connection Strength Distribution */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">Connection Strength</h2>
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((level) => {
              const entry = stats.strengthDistribution.find((s) => s.strength === level);
              const count = entry?.count || 0;
              const maxCount = Math.max(...stats.strengthDistribution.map((s) => s.count), 1);
              return (
                <div key={level} className="flex items-center gap-3">
                  <ConnectionStrength strength={level} size="sm" />
                  <div className="flex-1 bg-background rounded-full h-2 overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all"
                      style={{ width: `${(count / maxCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-muted w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Relationship Breakdown */}
        <div className="bg-surface border border-border rounded-xl p-6">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider mb-4">By Relationship</h2>
          {stats.relationshipBreakdown.length === 0 ? (
            <p className="text-sm text-muted">No contacts yet</p>
          ) : (
            <div className="space-y-2">
              {stats.relationshipBreakdown.map((item) => (
                <div key={item.type} className="flex items-center justify-between py-1.5">
                  <span className="text-sm text-foreground capitalize">{item.type}</span>
                  <span className="text-sm text-muted">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Interactions */}
        <div className="bg-surface border border-border rounded-xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">Recent Interactions</h2>
            <Link href="/contacts" className="text-xs text-accent hover:text-accent-hover transition-colors">
              View all →
            </Link>
          </div>
          {stats.recentInteractions.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted text-sm">No interactions yet</p>
              <Link href="/contacts" className="text-sm text-accent hover:text-accent-hover mt-2 inline-block">
                Add your first contact →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {stats.recentInteractions.map((interaction) => (
                <Link
                  key={interaction.id}
                  href={`/contacts/${interaction.contactId}`}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-surface-hover transition-colors"
                >
                  <span className="text-lg">{TYPE_ICONS[interaction.type] || '📌'}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-foreground">
                        {interaction.contactFirstName} {interaction.contactLastName}
                      </span>
                      <span className="text-xs text-muted">{interaction.direction}</span>
                      <span className="text-xs">{SENTIMENT_ICONS[interaction.sentiment]}</span>
                    </div>
                    {interaction.subject && (
                      <p className="text-sm text-muted truncate">{interaction.subject}</p>
                    )}
                    <p className="text-xs text-muted mt-0.5">{interaction.date}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon,
  accent,
}: {
  label: string;
  value: number;
  icon: string;
  accent?: string;
}) {
  return (
    <div className="bg-surface border border-border rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-lg">{icon}</span>
      </div>
      <div className={`text-3xl font-bold ${accent || 'text-foreground'}`}>{value}</div>
      <div className="text-sm text-muted mt-1">{label}</div>
    </div>
  );
}
