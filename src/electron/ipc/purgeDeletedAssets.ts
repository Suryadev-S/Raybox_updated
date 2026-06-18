import { getDb } from "@electron/db/database";
import fs from "fs/promises";
import path from "path";
import { checkStore } from "./checkStore";
import { ipcMain } from "electron";
import { IPC } from "@shared/ipc";

type DeletedFileRow = {
    id: string;
    checksum: string;
    storage_path: string;
    thumb_path: string | null;
    activeDuplicate: number;
};

export async function purgeDeletedAssets(): Promise<void> {

    const db = getDb();

    const storeResult = await checkStore();

    if (
        !storeResult.exists ||
        !storeResult.path
    ) {
        throw new Error(
            "STORE_NOT_FOUND"
        );
    }

    const storePath =
        storeResult.path;

    const deletedFiles =
        db.prepare(`
            SELECT
                f.id,
                f.checksum,
                f.storage_path,

                t.storage_path AS thumb_path,

                CASE
                    WHEN EXISTS (
                        SELECT 1
                        FROM files f2
                        WHERE
                            f2.checksum = f.checksum
                            AND f2.deleted_at IS NULL
                    )
                    THEN 1
                    ELSE 0
                END AS activeDuplicate

            FROM files f

            LEFT JOIN thumbs t
                ON t.file_id = f.id

            WHERE f.deleted_at IS NOT NULL
        `).all() as DeletedFileRow[];

    const processedChecksums =
        new Set<string>();

    const fileIdsToDelete: string[] =
        [];

    for (const file of deletedFiles) {

        try {

            // -------------------------------------------------
            // Active duplicate exists
            // -------------------------------------------------

            if (
                file.activeDuplicate === 1
            ) {
                fileIdsToDelete.push(
                    file.id
                );

                continue;
            }

            // -------------------------------------------------
            // Asset already processed
            // -------------------------------------------------

            if (
                processedChecksums.has(
                    file.checksum
                )
            ) {
                fileIdsToDelete.push(
                    file.id
                );

                continue;
            }

            // -------------------------------------------------
            // Delete original asset
            // -------------------------------------------------

            await fs.rm(
                path.join(
                    storePath,
                    file.storage_path
                ),
                {
                    force: true,
                }
            );

            // -------------------------------------------------
            // Delete thumbnail
            // -------------------------------------------------

            if (
                file.thumb_path
            ) {
                await fs.rm(
                    path.join(
                        storePath,
                        file.thumb_path
                    ),
                    {
                        force: true,
                    }
                );
            }

            processedChecksums.add(
                file.checksum
            );

            fileIdsToDelete.push(
                file.id
            );

        } catch (error) {

            console.error(
                `Failed to purge asset ${file.id}`,
                error
            );
        }
    }

    // ---------------------------------------------------------
    // Database cleanup
    // ---------------------------------------------------------

    const tx =
        db.transaction(() => {

            if (
                fileIdsToDelete.length > 0
            ) {

                const placeholders =
                    fileIdsToDelete
                        .map(() => "?")
                        .join(",");

                db.prepare(`
                    DELETE FROM files
                    WHERE id IN (${placeholders})
                `).run(
                    ...fileIdsToDelete
                );
            }

            db.prepare(`
                DELETE FROM bins
                WHERE deleted_at IS NOT NULL
            `).run();
        });

    tx();
}

ipcMain.handle(IPC.PURGE, purgeDeletedAssets);