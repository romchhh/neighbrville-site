import Database from "better-sqlite3";
import fs from "node:fs";
import path from "node:path";

const DEFAULT_PATH = path.join(process.cwd(), "data", "neighbrville.db");

let db: Database.Database | null = null;

function ensureDataDir(filePath: string) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function columnExists(
  database: Database.Database,
  table: string,
  column: string,
) {
  const cols = database.prepare(`PRAGMA table_info(${table})`).all() as Array<{
    name: string;
  }>;
  return cols.some((col) => col.name === column);
}

function ensureColumn(
  database: Database.Database,
  table: string,
  column: string,
  definition: string,
) {
  if (columnExists(database, table, column)) return;
  database.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${definition}`);
}

function initSchema(database: Database.Database) {
  database.exec(`
    CREATE TABLE IF NOT EXISTS registrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT NOT NULL COLLATE NOCASE UNIQUE,
      name TEXT NOT NULL,
      role TEXT NOT NULL CHECK (role IN ('neighbr', 'partner')),
      edit_token TEXT NOT NULL UNIQUE,
      interests TEXT NOT NULL DEFAULT '[]',
      languages TEXT NOT NULL DEFAULT '[]',
      categories TEXT NOT NULL DEFAULT '[]',
      location TEXT NOT NULL DEFAULT '',
      address TEXT NOT NULL DEFAULT '',
      socials TEXT NOT NULL DEFAULT '',
      about TEXT NOT NULL DEFAULT '',
      profile_completed INTEGER NOT NULL DEFAULT 0,
      email_confirmed INTEGER NOT NULL DEFAULT 0,
      email_confirmed_at TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_registrations_completed
      ON registrations (profile_completed);

    CREATE TABLE IF NOT EXISTS admin_sessions (
      token TEXT PRIMARY KEY,
      login TEXT NOT NULL,
      created_at TEXT NOT NULL,
      expires_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS site_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      data TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS analytics_events (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      path TEXT NOT NULL,
      referrer TEXT NOT NULL DEFAULT '',
      value TEXT NOT NULL DEFAULT '',
      meta TEXT NOT NULL DEFAULT '{}',
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_analytics_created
      ON analytics_events (created_at);
    CREATE INDEX IF NOT EXISTS idx_analytics_type
      ON analytics_events (type);
  `);

  // Existing DBs predate email confirmation — add columns before indexing.
  ensureColumn(
    database,
    "registrations",
    "email_confirmed",
    "INTEGER NOT NULL DEFAULT 0",
  );
  ensureColumn(database, "registrations", "email_confirmed_at", "TEXT");

  database.exec(`
    CREATE INDEX IF NOT EXISTS idx_registrations_email_confirmed
      ON registrations (email_confirmed);
  `);
}

export function getDb() {
  if (db) return db;

  const filePath = process.env.DATABASE_PATH ?? DEFAULT_PATH;
  ensureDataDir(filePath);

  db = new Database(filePath);
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  initSchema(db);

  return db;
}
