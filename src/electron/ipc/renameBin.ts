import { getDb } from "@electron/db/database";
import { IPC } from "@shared/ipc";
import { ipcMain } from "electron";

type RenameResult = {
    success: boolean;
    reason?: string;
};

export function renameBin(
    binId: string,
    newName: string
): RenameResult {
    newName = newName.trim();
    const db = getDb();
    const bin = db.prepare(`
        SELECT
            id,
            parent_id,
            name,
            ancestor_path

        FROM bins

        WHERE id = ?

    `)
        .get(binId) as {
            id: string;
            parent_id: string | null;
            name: string;
            ancestor_path: string;

        } | undefined;

    if (!bin) {

        return {
            success: false,
            reason: "BIN_NOT_FOUND"
        };
    }
    /*
        Check sibling duplicate
        Same parent
        Same name
    */

    const duplicate = db.prepare(`
        SELECT id
        FROM bins
        WHERE
            parent_id IS ?
            AND name = ?
            AND id != ?

    `)
        .get(
            bin.parent_id,
            newName,
            binId
        );

    if (duplicate) {
        return {
            success: false,
            reason: "DUPLICATE_BIN_NAME"
        };
    }

    const oldPath =
        `${bin.ancestor_path}/${bin.name}`
            .replace("//", "/");

    const newPath =
        `${bin.ancestor_path}/${newName}`
            .replace("//", "/");

    const transaction =
        db.transaction(() => {
            /*
                Rename target bin
            */
            db.prepare(`
                UPDATE bins

                SET
                    name = ?,
                    updated_at =
                        CURRENT_TIMESTAMP

                WHERE id = ?

            `)
                .run(
                    newName,
                    binId
                );
            /*
                Update child bins
            */
            db.prepare(`
                UPDATE bins

                SET
                    ancestor_path =
                    REPLACE(
                        ancestor_path,
                        ?,
                        ?
                    ),

                    updated_at =
                    CURRENT_TIMESTAMP

                WHERE ancestor_path LIKE ?

            `)
                .run(
                    oldPath,
                    newPath,
                    `${oldPath}%`
                );

            /*
                Update files
            */
            db.prepare(`
                UPDATE files

                SET
                    ancestor_path =
                    REPLACE(
                        ancestor_path,
                        ?,
                        ?
                    ),

                    updated_at =
                    CURRENT_TIMESTAMP

                WHERE ancestor_path LIKE ?

            `)
                .run(
                    oldPath,
                    newPath,
                    `${oldPath}%`
                );

        });

    transaction();

    return {
        success: true
    };
}

ipcMain.handle(IPC.RENAME_BIN, async (_, binId: string, newName: string) => {
    return renameBin(binId, newName);
})