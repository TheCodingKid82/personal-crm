export type RelationshipType =
  | 'business'
  | 'friend'
  | 'family'
  | 'acquaintance'
  | 'investor'
  | 'mentor'
  | 'client'
  | 'vendor'
  | 'other';

export type InteractionType =
  | 'email'
  | 'call'
  | 'meeting'
  | 'text'
  | 'social'
  | 'other';

export type Direction = 'inbound' | 'outbound';

export type Sentiment = 'positive' | 'neutral' | 'negative';

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  additionalEmails: string[];
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  relationshipType: RelationshipType;
  howWeMet: string | null;
  connectionStrength: number;
  lastContacted: string | null;
  firstContacted: string | null;
  notes: string | null;
  tags: string[];
  linkedIn: string | null;
  twitter: string | null;
  website: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ContactRow {
  id: number;
  firstName: string;
  lastName: string;
  email: string | null;
  additionalEmails: string;
  phone: string | null;
  company: string | null;
  jobTitle: string | null;
  relationshipType: string;
  howWeMet: string | null;
  connectionStrength: number;
  lastContacted: string | null;
  firstContacted: string | null;
  notes: string | null;
  tags: string;
  linkedIn: string | null;
  twitter: string | null;
  website: string | null;
  avatar: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Interaction {
  id: number;
  contactId: number;
  date: string;
  type: InteractionType;
  direction: Direction;
  subject: string | null;
  summary: string | null;
  sentiment: Sentiment;
  createdAt: string;
}

export interface InteractionWithContact extends Interaction {
  contactFirstName: string;
  contactLastName: string;
}

export interface DashboardStats {
  totalContacts: number;
  recentlyContacted: number;
  needsAttention: number;
  strengthDistribution: { strength: number; count: number }[];
  recentInteractions: InteractionWithContact[];
  relationshipBreakdown: { type: string; count: number }[];
}

export interface ContactInput {
  firstName: string;
  lastName: string;
  email?: string | null;
  additionalEmails?: string[];
  phone?: string | null;
  company?: string | null;
  jobTitle?: string | null;
  relationshipType?: RelationshipType;
  howWeMet?: string | null;
  connectionStrength?: number;
  lastContacted?: string | null;
  firstContacted?: string | null;
  notes?: string | null;
  tags?: string[];
  linkedIn?: string | null;
  twitter?: string | null;
  website?: string | null;
  avatar?: string | null;
}

export interface InteractionInput {
  contactId: number;
  date: string;
  type: InteractionType;
  direction: Direction;
  subject?: string | null;
  summary?: string | null;
  sentiment?: Sentiment;
}

export function parseContact(row: ContactRow): Contact {
  return {
    ...row,
    additionalEmails: JSON.parse(row.additionalEmails || '[]'),
    tags: JSON.parse(row.tags || '[]'),
    relationshipType: row.relationshipType as RelationshipType,
  };
}

// =====================
// Command Center Types
// =====================

export type TaskPriority = 'P0' | 'P1' | 'P2' | 'P3';
export type TaskStatus = 'backlog' | 'in_progress' | 'review' | 'done';

export interface Task {
  id: number;
  title: string;
  description: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  impact: string | null;
  project: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface TaskInput {
  title: string;
  description?: string | null;
  priority?: TaskPriority;
  status?: TaskStatus;
  impact?: string | null;
  project?: string | null;
}

export interface Metric {
  id: number;
  date: string;
  mrr: number;
  mrrTarget: number;
  churnRate: number;
  paymentSuccessRate: number;
  notes: string | null;
  createdAt: string;
}

export interface MetricInput {
  date: string;
  mrr: number;
  mrrTarget: number;
  churnRate: number;
  paymentSuccessRate: number;
  notes?: string | null;
}

export type ActivityType = 'contact_added' | 'task_created' | 'task_moved' | 'metric_updated' | 'note';

export interface ActivityLog {
  id: number;
  type: ActivityType;
  description: string;
  metadata: string | null;
  createdAt: string;
}

export interface ActivityLogInput {
  type: ActivityType;
  description: string;
  metadata?: Record<string, unknown> | null;
}
