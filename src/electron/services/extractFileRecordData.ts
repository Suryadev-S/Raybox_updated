import fs from "fs/promises"
import path from "path"

import sharp from "sharp"
import { BinRecordData, FileRecordData } from "@shared/types"

// import type { BinRecordData, FileRecordData }
//     from "./types"
// import { getRootBin } from "./db/getRootBin"

type ExtractFileRecordInput = {
    id: string
    sourcePath: string
    logicalName: string

    relativePath: string

    absolutePath: string

    checksum: string

    fileType: {
        category: string
        mimeType?: string
    }

    bin: BinRecordData
}

export async function extractFileRecordData({
    id,
    sourcePath,
    logicalName,
    relativePath,
    absolutePath,
    checksum,
    fileType,
    bin
}: ExtractFileRecordInput): Promise<FileRecordData> {

    // const rootBin = getRootBin() as BinRecordData

    // if (!rootBin) {
    //     throw new Error("ROOT_BIN_NOT_FOUND")
    // }

    const stats = await fs.stat(sourcePath)

    const extension =
        path.extname(sourcePath)
            .replace(".", "")
            .toLowerCase()

    const filename =
        path.basename(absolutePath)

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
        id,

        parent_bin_id: bin.id,

        original_name: filename,

        file_name: logicalName,

        storage_path: relativePath,

        ancestor_path: `${bin.ancestor_path}/${bin.name}`.replace(/\/+/g, "/"),

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