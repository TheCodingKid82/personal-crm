import Database from 'better-sqlite3';
import path from 'path';

const DB_PATH = path.join(process.cwd(), 'crm.db');

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (!db) {
    db = new Database(DB_PATH);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');
    initializeDb(db);
  }
  return db;
}

function initializeDb(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      firstName TEXT NOT NULL,
      lastName TEXT NOT NULL,
      email TEXT,
      additionalEmails TEXT DEFAULT '[]',
      phone TEXT,
      company TEXT,
      jobTitle TEXT,
      relationshipType TEXT DEFAULT 'other',
      howWeMet TEXT,
      connectionStrength INTEGER DEFAULT 3,
      lastContacted TEXT,
      firstContacted TEXT,
      notes TEXT,
      tags TEXT DEFAULT '[]',
      linkedIn TEXT,
      twitter TEXT,
      website TEXT,
      avatar TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      contactId INTEGER NOT NULL,
      date TEXT NOT NULL,
      type TEXT NOT NULL DEFAULT 'other',
      direction TEXT NOT NULL DEFAULT 'outbound',
      subject TEXT,
      summary TEXT,
      sentiment TEXT DEFAULT 'neutral',
      createdAt TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (contactId) REFERENCES contacts(id) ON DELETE CASCADE
    );

    CREATE INDEX IF NOT EXISTS idx_contacts_email ON contacts(email);
    CREATE INDEX IF NOT EXISTS idx_contacts_name ON contacts(firstName, lastName);
    CREATE INDEX IF NOT EXISTS idx_contacts_company ON contacts(company);
    CREATE INDEX IF NOT EXISTS idx_contacts_relationship ON contacts(relationshipType);
    CREATE INDEX IF NOT EXISTS idx_interactions_contact ON interactions(contactId);
    CREATE INDEX IF NOT EXISTS idx_interactions_date ON interactions(date);

    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      priority TEXT NOT NULL DEFAULT 'P2',
      status TEXT NOT NULL DEFAULT 'backlog',
      impact TEXT,
      project TEXT,
      createdAt TEXT DEFAULT (datetime('now')),
      updatedAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS metrics (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date TEXT NOT NULL,
      mrr REAL NOT NULL DEFAULT 0,
      mrrTarget REAL NOT NULL DEFAULT 100000,
      churnRate REAL NOT NULL DEFAULT 0,
      paymentSuccessRate REAL NOT NULL DEFAULT 0,
      notes TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS activity_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      type TEXT NOT NULL,
      description TEXT NOT NULL,
      metadata TEXT,
      createdAt TEXT DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
    CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
    CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);
    CREATE INDEX IF NOT EXISTS idx_activity_log_created ON activity_log(createdAt);
  `);
}
