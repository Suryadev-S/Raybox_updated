import { getDb } from "../db/database"

export function getRootBinId(): string | null {
    console.log("inside get root bin");
    const db = getDb()

    const root = db.prepare(`
        SELECT id
        FROM bins
        WHERE parent_id IS NULL
        AND name = '/'
        LIMIT 1
    `).get() as { id: string } | undefined

    return root?.id || null
}