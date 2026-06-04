import type { FileCategory } from "./types"

export const extensionMap: Record<string, FileCategory> = {
    // Images
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".webp": "image",
    ".gif": "image",

    // Videos
    ".mp4": "video",
    ".mov": "video",
    ".mkv": "video",
    ".avi": "video",

    // Audio
    ".mp3": "audio",
    ".wav": "audio",
    ".flac": "audio",

    // Documents
    ".pdf": "document",
    ".docx": "document",
    ".txt": "document",
}