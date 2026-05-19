// services/media/ingestFile.ts

import fs from "fs/promises"
import path from "path"
import { checkStore } from "./checkStore"
import { identifyFileType } from "./identifyFileType"
import { generateImageThumbnail } from "./imageGenerator"

// import { checkStore } from "../store/checkStore"

// import { identifyFileType } from "../file/identifyFileType"

// import { generateImageThumbnail } from "../thumbnail/generators/imageThumbnail"

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
        const fileType = await identifyFileType(
            filePath,
        )

        if (fileType.category === "unknown") {
            return {
                success: false,
                reason: "UNSUPPORTED_FILE_TYPE",
            }
        }

        // STEP 3
        // Create category folder
        const categoryFolderPath = path.join(
            storePath,
            fileType.category,
        )

        await fs.mkdir(categoryFolderPath, {
            recursive: true,
        })

        // STEP 4
        // Create thumb folder
        const thumbFolderPath = path.join(
            storePath,
            "thumb",
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

        const originalPath = path.join(
            categoryFolderPath,
            `${baseName}${extension}`,
        )

        const thumbnailPath = path.join(
            thumbFolderPath,
            `${baseName}_thumb.jpg`,
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