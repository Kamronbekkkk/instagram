import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { ADMIN_CREDENTIALS } from './auth';

const dbDir = path.join(process.cwd(), '.data');
import fs from 'node:fs';
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'instaphone.db');
const db = new DatabaseSync(dbPath);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    contact TEXT NOT NULL,
    username TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    isAdmin INTEGER DEFAULT 0
  );
`);

export interface AppUser {
  id: string;
  name: string;
  contact: string;
  username: string;
  password: string;
  createdAt: string;
  isAdmin?: boolean;
}

function ensureAdminUser(): void {
  const existing = db.prepare('SELECT 1 FROM users WHERE username = ?').get(ADMIN_CREDENTIALS.username);
  if (!existing) {
    db.prepare(
      'INSERT INTO users (id, name, contact, username, password, createdAt, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)'
    ).run(
      'admin-twadmin',
      'TW Admin',
      'admin@tw.local',
      ADMIN_CREDENTIALS.username,
      ADMIN_CREDENTIALS.password,
      new Date().toISOString(),
      1,
    );
  }
}

ensureAdminUser();

export function getAllUsers(): AppUser[] {
  const stmt = db.prepare('SELECT * FROM users ORDER BY createdAt DESC');
  return stmt.all() as AppUser[];
}

export function createUser(user: {
  id: string;
  name: string;
  contact: string;
  username: string;
  password: string;
}): AppUser {
  const createdAt = new Date().toISOString();
  db.prepare(
    'INSERT INTO users (id, name, contact, username, password, createdAt, isAdmin) VALUES (?, ?, ?, ?, ?, ?, ?)'
  ).run(user.id, user.name, user.contact, user.username, user.password, createdAt, 0);
  return { ...user, password: user.password, createdAt, isAdmin: false };
}

export function userExists(username: string, contact: string): boolean {
  const stmt = db.prepare('SELECT 1 FROM users WHERE username = ? OR contact = ?');
  return !!stmt.get(username.toLowerCase(), contact.toLowerCase());
}

export function findUserByCredentials(login: string, password: string): AppUser | null {
  const target = login.trim().toLowerCase();
  const stmt = db.prepare('SELECT * FROM users WHERE (LOWER(username) = ? OR LOWER(contact) = ?) AND password = ?');
  const result = stmt.get(target, target, password);
  if (!result) return null;
  return { ...result, isAdmin: Boolean(result.isAdmin) };
}
