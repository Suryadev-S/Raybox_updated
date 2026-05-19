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