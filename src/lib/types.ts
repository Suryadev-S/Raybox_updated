export type StoreConfig = {
    storePath: string
}

export type CheckStoreResult = {
    exists: boolean
    path?: string
    reason?: string
}

export type FileCategory =
    | "image"
    | "video"
    | "audio"
    | "document"
    | "unknown"

export type FileTypeResult = {
    extension: string
    category: FileCategory
}

export type ThumbnailResult = {
    success: boolean
    outputPath?: string
    reason?: string
}

export type BinRecordData = {
    id: string

    parent_id: string

    name: string
    ancestor_path: string
}

export type FileRecordData = {
    id: string

    parent_bin_id: string

    name: string

    storage_path: string
    ancestor_path: string

    mime_type: string
    type:
    | "image"
    | "video"
    | "audio"
    | "document"
    | "archive"
    | "other"

    extension: string | null

    size_bytes: number

    checksum: string

    width: number | null
    height: number | null

    duration: number | null
}

export type ThumbRecordData = {
    id: string

    file_id: string

    kind: string

    storage_path: string

    mime_type: string

    width: number | null
    height: number | null

    size_bytes: number | null
}