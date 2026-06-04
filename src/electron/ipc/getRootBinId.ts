import { ipcMain } from "electron";
import { getDb } from "../db/database"
import { IPC } from "@shared/ipc";

export function getRootBinId() {
    // console.log("inside get root bin");
    const db = getDb()

    const root = db.prepare(`
        SELECT id, name, parent_id, ancestor_path, created_at
        FROM bins
        WHERE parent_id IS NULL
        AND name = '/'
        LIMIT 1
    `).get()

    return root || null
}

ipcMain.handle(IPC.GET_ROOT_BIN_ID, getRootBinId)