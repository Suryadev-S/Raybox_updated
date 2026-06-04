import Database from 'better-sqlite3'
import path from 'path'
import { app } from 'electron'
import { schema } from './schemas'

let db: Database.Database | null = null

export function initializeDatabase(): void {
    if (db) {
        return
    }

    const dbPath = path.join(app.getPath('userData'), 'mam.db')

    db = new Database(dbPath);
    db.pragma('journal_mode = WAL');
    db.pragma('foreign_keys = ON');

    // Create tables
    db.exec(schema);

    console.log(`Database initialized at: ${dbPath}`)
}

export function getDb(): Database.Database {
    if (!db) {
        throw new Error(
            'Database has not been initialized. Call initializeDatabase() first.'
        )
    }

    return db
}