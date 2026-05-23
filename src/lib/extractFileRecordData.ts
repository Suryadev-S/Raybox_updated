import fs from "fs/promises"
import path from "path"
import crypto from "crypto"

import sharp from "sharp"

import type { BinRecordData, FileRecordData }
    from "./types"
import { getRootBin } from "./db/getRootBin"

type ExtractFileRecordInput = {
    sourcePath: string

    storagePath: string

    checksum: string

    fileType: {
        category: string
        mimeType?: string
    }
}

export async function extractFileRecordData({
    sourcePath,
    storagePath,
    checksum,
    fileType,
}: ExtractFileRecordInput): Promise<FileRecordData> {

    const rootBin = getRootBin() as BinRecordData

    if (!rootBin) {
        throw new Error("ROOT_BIN_NOT_FOUND")
    }

    const stats = await fs.stat(sourcePath)

    const extension =
        path.extname(sourcePath)
            .replace(".", "")
            .toLowerCase()

    const filename =
        path.basename(storagePath)

    let width: number | null = null
    let height: number | null = null

    // Image metadata only for now
    if (fileType.category === "image") {
        try {
            const metadata =
                await sharp(sourcePath)
                    .metadata()

            width = metadata.width || null
            height = metadata.height || null
        } catch (error) {
            console.error(error)
        }
    }

    return {
        id: crypto.randomUUID(),

        parent_bin_id: rootBin.id,

        name: filename,

        storage_path: storagePath,

        ancestor_path: "/",

        mime_type:
            fileType.mimeType ||
            "application/octet-stream",

        type:
            fileType.category as FileRecordData["type"],

        extension:
            extension || null,

        size_bytes: stats.size,

        checksum,

        width,
        height,

        duration: null,
    }
}