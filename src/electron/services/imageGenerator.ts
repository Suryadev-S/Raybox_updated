import { THUMBNAIL_QUALITY, THUMBNAIL_SIZE } from "@shared/constants"
import { ThumbnailResult } from "@shared/types"
import sharp from "sharp"

// import {
//     THUMBNAIL_SIZE,
//     THUMBNAIL_QUALITY,
// } from "../constants"

// import type { ThumbnailResult } from "../types"

export async function generateImageThumbnail(
    inputPath: string,
    outputPath: string,
): Promise<ThumbnailResult> {
    try {
        await sharp(inputPath)
            .resize({
                width: THUMBNAIL_SIZE,
                height: THUMBNAIL_SIZE,
                fit: "inside",
                withoutEnlargement: true,
            })
            .jpeg({
                quality: THUMBNAIL_QUALITY,
            })
            .toFile(outputPath)

        return {
            success: true,
            outputPath,
        }
    } catch (error) {
        console.error(error)

        return {
            success: false,
            reason: "THUMBNAIL_GENERATION_FAILED",
        }
    }
}