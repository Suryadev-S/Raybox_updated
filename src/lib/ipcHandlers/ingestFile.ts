// services/media/ingestFile.ts

import fs from "fs/promises"
import path from "path"
import { checkStore } from "./checkStore"
import { identifyFileType } from "./identifyFileType"
import { generateImageThumbnail } from "./imageGenerator"
import { generateFileHash } from "../generateFileHash"
import { extractFileRecordData } from "../extractFileRecordData"
import { createFileRecord } from "../db/createFileRecord"
import { extractThumbRecordData } from "../extractThumbRecordData"
import { createThumbRecord } from "../db/createThumbRecord"
import { getDb } from "../db/database"

type IngestResult = {
    success: boolean
    originalPath?: string
    thumbnailPath?: string
    reason?: string
}

export async function ingestFile(
    filePath: string,
): Promise<IngestResult> {
    try {
        console.log("inside ingst")
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

        // STEP 3
        // Create category folder
        const categoryFolderPath = path.join(
            storePath,
            fileType.category,
            fileHash.slice(0, 2),
            fileHash.slice(2, 4)
        )

        await fs.mkdir(categoryFolderPath, {
            recursive: true,
        })

        // STEP 4
        // Create thumb folder
        const thumbFolderPath = path.join(
            storePath,
            "thumb",
            fileHash.slice(0, 2),
            fileHash.slice(2, 4)
        )

        await fs.mkdir(thumbFolderPath, {
            recursive: true,
        })

        // STEP 5
        // Generate names
        const extension = path.extname(filePath)

        const baseName = path.basename(
            filePath,
            extension,
        )

        const timestamp = Date.now();

        const originalPath = path.join(
            categoryFolderPath,
            `${baseName}_${timestamp}${extension}`,
        )

        const thumbnailPath = path.join(
            thumbFolderPath,
            `${baseName}_thumb_${timestamp}.jpg`,
        )

        // STEP 6
        // Copy original
        await fs.copyFile(
            filePath,
            originalPath,
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
                originalPath,
                thumbnailPath,
            )
        }

        // STEP 9
        // Extract DB record data
        const fileRecord =
            await extractFileRecordData({
                sourcePath: filePath,

                storagePath: originalPath,

                checksum: fileHash,

                fileType: {
                    category: fileType.category,
                    // mimeType: fileType.mimeType,
                },
            });

        const thumbRecord =
            await extractThumbRecordData({
                fileId: fileRecord.id,

                kind: "preview",

                storagePath: thumbnailPath,
            })

        // STEP 10
        // Create DB record
        createFileRecord(fileRecord);
        // debug test
        const db = getDb()

        const existing = db
            .prepare(`
    SELECT id
    FROM files
    WHERE id = ?
  `)
            .get(fileRecord.id)

        console.log(existing)
        createThumbRecord(thumbRecord);

        return {
            success: true,
            originalPath,
            thumbnailPath,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            reason: "INGESTION_FAILED",
        }
    }
}