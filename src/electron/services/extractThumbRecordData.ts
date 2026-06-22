import fs from "fs/promises"
import crypto from "crypto"

import sharp from "sharp"
import { ThumbRecordData } from "@shared/types"


type ExtractThumbInput = {
    fileId: string

    kind: string

    relativePath: string
    absolutePath: string
}

export async function extractThumbRecordData({
    fileId,
    kind,
    relativePath,
    absolutePath
}: ExtractThumbInput): Promise<ThumbRecordData> {

    const stats = await fs.stat(absolutePath)

    let width: number | null = null
    let height: number | null = null

    try {
        const metadata =
            await sharp(absolutePath)
                .metadata()

        width = metadata.width || null
        height = metadata.height || null
    } catch (error) {
        console.error(error)
    }

    return {
        id: crypto.randomUUID(),

        file_id: fileId,

        kind,

        storage_path: relativePath,

        mime_type: "image/jpeg",

        width,
        height,

        size_bytes: stats.size,
    }
}