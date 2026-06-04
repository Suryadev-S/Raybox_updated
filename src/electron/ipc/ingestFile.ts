// services/media/ingestFile.ts

import fs from "fs/promises"
import path from "path"
// import { checkStore } from "./checkStore"
// import { identifyFileType } from "./identifyFileType"
// import { generateImageThumbnail } from "./imageGenerator"
// import { generateFileHash } from "../generateFileHash"
// import { extractFileRecordData } from "../extractFileRecordData"
// import { createFileRecord } from "../db/createFileRecord"
// import { extractThumbRecordData } from "../extractThumbRecordData"
// import { createThumbRecord } from "../db/createThumbRecord"
// import { getDb } from "../db/database"
import { ipcMain } from "electron"
import { IPC } from "@shared/ipc"
import { BinRecordData } from "@shared/types"
import { checkStore } from "./checkStore"
import { identifyFileType } from "./identifyFileType"
import { generateFileHash } from "@electron/services/generateFileHash"
import { generateImageThumbnail } from "../services/imageGenerator"
import { extractFileRecordData } from "@electron/services/extractFileRecordData"
import { extractThumbRecordData } from "@electron/services/extractThumbRecordData"
import { createFileRecord } from "@electron/db/createFileRecord"
import { createThumbRecord } from "@electron/db/createThumbRecord"

type IngestResult = {
    success: boolean
    originalPath?: string
    thumbnailPath?: string
    reason?: string
}

export async function ingestFile(
    filePath: string,
    bin: BinRecordData
): Promise<IngestResult> {
    try {
        // STEP 1
        // Check store
        const storeResult = await checkStore()

        if (!storeResult.exists || !storeResult.path) {
            return {
                success: false,
                reason: "STORE_NOT_FOUND",
            }
        }

        const storePath = storeResult.path

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


        // Generate file hash
        const fileHash = await generateFileHash(
            filePath,
        )

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

ipcMain.handle(IPC.INGEST_FILE, async (_, filePath: string, bin: BinRecordData) => {
    return ingestFile(filePath, bin)
})