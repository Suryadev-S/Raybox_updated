import { BinRecordData } from "../types"
import { getDb } from "./database"

export function getRootBin() {
    const db = getDb()

    return db.prepare(`
    SELECT *
    FROM bins
    WHERE parent_id IS NULL
    AND name = '/'
  `).get()
}