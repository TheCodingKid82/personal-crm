import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "clutch.db");

let dbSingleton: Database.Database | null = null;

function migrate(db: Database.Database) {
  db.exec(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS packs (
      id TEXT PRIMARY KEY,
      sourceText TEXT NOT NULL,
      packJson TEXT NOT NULL,
      createdAt INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS joins (
      packId TEXT PRIMARY KEY,
      count INTEGER NOT NULL DEFAULT 0,
      updatedAt INTEGER NOT NULL,
      FOREIGN KEY(packId) REFERENCES packs(id)
    );
  `);
}

export function getDb(): Database.Database {
  if (dbSingleton) return dbSingleton;

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });

  const db = new Database(DB_PATH);
  migrate(db);

  dbSingleton = db;
  return db;
}

export const UNLOCK_THRESHOLD = 5;

export type PackRow = {
  id: string;
  sourceText: string;
  packJson: string;
  createdAt: number;
};

export function getPackById(id: string): PackRow | null {
  const db = getDb();
  const row = db
    .prepare("SELECT id, sourceText, packJson, createdAt FROM packs WHERE id = ?")
    .get(id) as PackRow | undefined;
  return row ?? null;
}

export function upsertPack(args: {
  id: string;
  sourceText: string;
  packJson: string;
}) {
  const db = getDb();
  const now = Date.now();

  db.prepare(
    `INSERT INTO packs (id, sourceText, packJson, createdAt)
     VALUES (@id, @sourceText, @packJson, @createdAt)
     ON CONFLICT(id) DO UPDATE SET
       sourceText=excluded.sourceText,
       packJson=excluded.packJson` ,
  ).run({
    ...args,
    createdAt: now,
  });

  db.prepare(
    `INSERT INTO joins (packId, count, updatedAt)
     VALUES (@packId, 0, @updatedAt)
     ON CONFLICT(packId) DO NOTHING`,
  ).run({ packId: args.id, updatedAt: now });
}

export function getJoinCount(packId: string): number {
  const db = getDb();
  const row = db
    .prepare("SELECT count FROM joins WHERE packId = ?")
    .get(packId) as { count: number } | undefined;
  return row?.count ?? 0;
}

export function incrementJoin(packId: string): number {
  const db = getDb();
  const now = Date.now();
  const tx = db.transaction(() => {
    db.prepare(
      `INSERT INTO joins (packId, count, updatedAt)
       VALUES (@packId, 0, @updatedAt)
       ON CONFLICT(packId) DO NOTHING`,
    ).run({ packId, updatedAt: now });

    db.prepare(
      `UPDATE joins SET count = count + 1, updatedAt = @updatedAt WHERE packId = @packId`,
    ).run({ packId, updatedAt: now });

    const row = db
      .prepare("SELECT count FROM joins WHERE packId = ?")
      .get(packId) as { count: number };

    return row.count;
  });

  return tx();
}

export function isUnlocked(packId: string): boolean {
  return getJoinCount(packId) >= UNLOCK_THRESHOLD;
}
