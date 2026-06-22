import { getDb } from "@electron/db/database";
import { IPC } from "@shared/ipc";
import { DeletedItem } from "@shared/types";
import { ipcMain } from "electron";

export function getDeletedItems(): DeletedItem[] {
    const db = getDb();

    return db.prepare(`
        SELECT
            id,
            name,
            ancestor_path,
            'bin' AS recordType,
            deleted_at
        FROM bins
        WHERE deleted_at IS NOT NULL

        UNION ALL

        SELECT
            id,
            file_name,
            ancestor_path,
            'file' AS recordType,
            deleted_at
        FROM files
        WHERE deleted_at IS NOT NULL

        ORDER BY deleted_at DESC
    `).all() as DeletedItem[];
}

ipcMain.handle(IPC.GET_DELETED, getDeletedItems);