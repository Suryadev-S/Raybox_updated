import { createFileRecord } from "@electron/db/createFileRecord";
import { createThumbRecord } from "@electron/db/createThumbRecord";
import { getDb } from "@electron/db/database";
import { BinRecordData, FileRecordData, IngestInputOptions, IngestResult, ThumbRecordData } from "@shared/types";
import path from "path";
import fs from "fs/promises"
import { checkStore } from "./checkStore";
import { generateFileHash } from "@electron/services/generateFileHash";
import { extractThumbRecordData } from "@electron/services/extractThumbRecordData";
import { extractFileRecordData } from "@electron/services/extractFileRecordData";
import { generateImageThumbnail } from "@electron/services/imageGenerator";
import { identifyFileType } from "./identifyFileType";
import { ipcMain } from "electron";
import { IPC } from "@shared/ipc";

function generateDuplicateName(
    originalName: string
): string {
    const ext = path.extname(originalName);
    const base = path.basename(
        originalName,
        ext
    );

    return `${base.slice(0, base.lastIndexOf('_'))}_copy_${Date.now()}${ext}`;
}

function findThumbByFileId(id: string): ThumbRecordData {
    const db = getDb();

    return db
        .prepare(`
            SELECT
                *
            FROM thumbs
            WHERE file_id = ?
            LIMIT 1
        `)
        .get(id) as ThumbRecordData;

}

export function findFileByChecksum(
    checksum: string
): FileRecordData {
    const db = getDb();

    return db
        .prepare(`
            SELECT
                *
            FROM files
            WHERE checksum = ?
            LIMIT 1
        `)
        .get(checksum) as FileRecordData;
}

async function createDuplicateReference(
    dupeFile: FileRecordData,
    bin: BinRecordData,
): Promise<void> {
    const newFileId =
        crypto.randomUUID();

    const duplicateFileRecord: FileRecordData = {
        ...dupeFile,

        id: newFileId,

        parent_bin_id: bin.id,

        name: generateDuplicateName(
            dupeFile.name,
        ),
        ancestor_path: `${bin.ancestor_path}/${bin.name}`.replace(/\/+/g, "/")
    };

    createFileRecord(
        duplicateFileRecord
    );

    const existingThumb =
        findThumbByFileId(
            dupeFile.id,
        );
    if (existingThumb) {

        const duplicateThumb = {
            ...existingThumb,

            id: crypto.randomUUID(),

            file_id: newFileId,
        };

        createThumbRecord(
            duplicateThumb
        );
    }
}

export async function ingestFile_v2({
    filePath,
    bin,
    options,
}: IngestInputOptions): Promise<IngestResult> {
    try {
        const strategy =
            options?.duplicateStrategy ??
            "ask";

        // STEP 1
        // Check store

        const storeResult =
            await checkStore();

        if (
            !storeResult.exists ||
            !storeResult.path
        ) {
            return {
                success: false,
                reason:
                    "STORE_NOT_FOUND",
            };
        }

        const storePath =
            storeResult.path;

        // STEP 2
        // Generate checksum

        const fileHash =
            await generateFileHash(
                filePath,
            );

        // STEP 3
        // Check duplicates

        const dupeFile =
            findFileByChecksum(
                fileHash,
            );

        if (dupeFile) {
            switch (strategy) {
                case "ask":

                    return {
                        success: false,

                        reason:
                            "DUPLICATE_FOUND",

                        duplicateFile: {
                            id:
                                dupeFile.id,

                            name:
                                dupeFile.name,

                            checksum:
                                dupeFile.checksum,

                            storagePath:
                                dupeFile.storage_path,
                        },
                    };
                case "discard":

                    return {
                        success: false,
                        reason:
                            "DUPLICATE_DISCARDED",
                    };
                case "keep":

                    await createDuplicateReference(
                        dupeFile,
                        bin,
                    );

                    return {
                        success: true,
                        reason:
                            "DUPLICATE_REFERENCE_CREATED",
                    };
            }
        }

        // STEP 4
        // Normal ingestion

        return await ingestNewFile(
            filePath,
            bin,
            storePath,
            fileHash,
        );
    } catch (error) {
        console.error(error);

        return {
            success: false,
            reason:
                "INGESTION_FAILED",
        };
    }
}

async function ingestNewFile(
    filePath: string,
    bin: BinRecordData,
    storePath: string,
    fileHash: string) {
    try {
        // STEP 2
        // Identify file type
        const fileType = identifyFileType(
            filePath,
        )

        if (fileType.category === "unknown") {
            return {
                success: false,
                reason: "UNSUPPORTED_FILE_TYPE",
            }
        }

        // STEP 5
        // Generate names
        const extension = path.extname(filePath)
        const baseName = path.basename(
            filePath,
            extension,
        )
        const timestamp = Date.now();
        const originalFileName = `${baseName}_${timestamp}${extension}`;
        const thumbnailFileName = `${baseName}_thumb_${timestamp}.jpg`;

        // STEP 3
        // Create category folder
        const categoryFolderPath_relative = path.join(
            fileType.category,
            fileHash.slice(0, 2),
            fileHash.slice(2, 4)
        )

        const categoryFolderPath_absolute = path.join(
            storePath,
            categoryFolderPath_relative
        )

        await fs.mkdir(categoryFolderPath_absolute, {
            recursive: true,
        });

        const originalFilePath = path.join(
            categoryFolderPath_absolute,
            originalFileName
        );

        // STEP 4
        // Create thumb folder
        const thumbFolderPath_relative = path.join(
            "thumb",
            fileHash.slice(0, 2),
            fileHash.slice(2, 4)
        )

        const thumbFolderPath_absolute = path.join(
            storePath,
            thumbFolderPath_relative
        )
        await fs.mkdir(thumbFolderPath_absolute, {
            recursive: true,
        })

        const thumbFilePath = path.join(
            thumbFolderPath_absolute,
            thumbnailFileName
        )

        // STEP 6
        // Copy original
        await fs.copyFile(
            filePath,
            originalFilePath
        )

        // STEP 7
        // Thumbnail generator strategy map
        const thumbnailGenerators: Record<
            string,
            (
                input: string,
                output: string,
            ) => Promise<any>
        > = {
            image: generateImageThumbnail,
        }

        const generator =
            thumbnailGenerators[fileType.category]

        // STEP 8
        // Generate thumbnail if supported
        if (generator) {
            await generator(
                originalFilePath,
                thumbFilePath,
            )
        }

        // STEP 9
        // Extract DB record data
        const fileRecord =
            await extractFileRecordData({
                sourcePath: filePath,
                relativePath: path.join(categoryFolderPath_relative, originalFileName),
                absolutePath: originalFilePath,
                checksum: fileHash,
                fileType: {
                    category: fileType.category,
                    // mimeType: fileType.mimeType,
                },
                bin
            });

        const thumbRecord =
            await extractThumbRecordData({
                fileId: fileRecord.id,
                kind: "preview",
                relativePath: path.join(thumbFolderPath_relative, thumbnailFileName),
                absolutePath: thumbFilePath,
            })

        // STEP 10
        // Create DB record
        createFileRecord(fileRecord);
        createThumbRecord(thumbRecord);

        return {
            success: true,
            originalPath: originalFilePath,
            thumbnailPath: thumbFilePath,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            reason: "INGESTION_FAILED",
        }
    }
}

ipcMain.handle(IPC.INGEST_FILE_V2, async (_, payload: IngestInputOptions) => {
    return ingestFile_v2(payload)
})