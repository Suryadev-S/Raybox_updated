import { getDb } from "../db/database"

export function getBinContents(binId: string) {
    const db = getDb()

    const bins = db.prepare(`
        SELECT
            id,
            name,
            created_at
        FROM bins
        WHERE parent_id = ?
        AND deleted_at IS NULL
        ORDER BY name
    `).all(binId)

    const files = db.prepare(`
        SELECT
            id,
            name,
            type,
            mime_type,
            size_bytes,
            created_at
        FROM files
        WHERE parent_bin_id = ?
        AND deleted_at IS NULL
        ORDER BY name
    `).all(binId)

    return {
        bins,
        files,
    }
}