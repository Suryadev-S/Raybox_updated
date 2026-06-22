import { ipcMain } from "electron"
import { getDb } from "../db/database"
import { IPC } from "@shared/ipc"

export function getBinContents(binId: string) {
    const db = getDb()

    const bins = db.prepare(`
        SELECT
           *
        FROM bins
        WHERE parent_id = ?
        AND deleted_at IS NULL
        ORDER BY name
    `).all(binId)

    const files = db.prepare(`
        SELECT
            *
        FROM files
        WHERE parent_bin_id = ?
        AND deleted_at IS NULL
        ORDER BY file_name
    `).all(binId)

    return {
        bins,
        files,
    }
}

ipcMain.handle(
    IPC.GET_BIN_CONTENTS,
    async (_, binId: string) => {
        return getBinContents(binId)
    }
)