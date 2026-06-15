import { getDb } from "@electron/db/database";
import { IPC } from "@shared/ipc";
import { ipcMain } from "electron";

export function deleteBin(
    binId: string,
    fullPath: string
): void {
    const db = getDb();
    const tx = db.transaction(() => {

        // Delete files in subtree

        db.prepare(`
            UPDATE files
            SET
                deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE ancestor_path LIKE ?
        `).run(`${fullPath}%`);

        // Delete descendant bins

        db.prepare(`
            UPDATE bins
            SET
                deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE ancestor_path LIKE ?
        `).run(`${fullPath}%`);

        // Delete target bin

        db.prepare(`
            UPDATE bins
            SET
                deleted_at = CURRENT_TIMESTAMP,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
        `).run(binId);

    });

    tx();
}

ipcMain.handle(IPC.DELETE_BIN, async (_, binId: string, fullPath: string) => {
    return deleteBin(binId, fullPath);
})