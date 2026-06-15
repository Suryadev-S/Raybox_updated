import { getDb } from "@electron/db/database";
import { IPC } from "@shared/ipc";
import { ipcMain } from "electron";

export function deleteFile(
    fileId: string
): void {
    const db = getDb();

    db.prepare(`
        UPDATE files
        SET
            deleted_at = CURRENT_TIMESTAMP,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
        AND deleted_at IS NULL
    `).run(fileId);
}

ipcMain.handle(IPC.DELETE_FILE, async (_, fileId: string) => {
    return deleteFile(fileId);
})