import { getDb } from "@electron/db/database";
import { IPC } from "@shared/ipc";
import { ipcMain } from "electron";

type RenameResult = {
    success: boolean;
    reason?: string;
};


export function renameFile(
    fileId: string,
    newName: string
): RenameResult {
    newName = newName.trim();
    const db = getDb();
    const file = db.prepare(`
        SELECT
            id,
            parent_bin_id,
            file_name

        FROM files

        WHERE id = ?
    `)
        .get(fileId) as {
            id: string;
            parent_bin_id: string;
            file_name: string;
        } | undefined;



    if (!file) {

        return {
            success: false,
            reason: "FILE_NOT_FOUND"
        };
    }
    // Same name check inside same bin

    const duplicate = db.prepare(`
        SELECT id

        FROM files

        WHERE
            parent_bin_id = ?
            AND file_name = ?
            AND id != ?

    `)
        .get(
            file.parent_bin_id,
            newName,
            fileId
        );

    if (duplicate) {

        return {
            success: false,
            reason: "DUPLICATE_FILE_NAME"
        };
    }

    db.prepare(`
        UPDATE files

        SET
            file_name = ?,
            updated_at =
                CURRENT_TIMESTAMP

        WHERE id = ?

    `)
        .run(
            newName,
            fileId
        );

    return {
        success: true
    };
}

ipcMain.handle(IPC.RENAME_FILE, async (_, fileId: string, newName: string) => {
    return renameFile(fileId, newName);
})