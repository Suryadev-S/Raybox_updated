import crypto from "crypto"

import { getDb } from "./database"

export function ensureRootBinExists(): void {
    const db = getDb()

    // Check whether root bin exists
    const existingRoot = db
        .prepare(`
      SELECT id
      FROM bins
      WHERE parent_id IS NULL
      AND name = '/'
    `)
        .get()

    if (existingRoot) {
        return
    }

    // Create root bin
    const rootId = crypto.randomUUID()

    db.prepare(`
    INSERT INTO bins (
      id,
      parent_id,
      name,
      ancestor_path
    )
    VALUES (?, ?, ?, ?)
  `).run(
        rootId,
        null,
        "/",
        "",
    )

    console.log("Root bin created")
}