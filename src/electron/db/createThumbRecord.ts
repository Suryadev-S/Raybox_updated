// import { ThumbRecordData } from "../types"
import { ThumbRecordData } from "@shared/types"
import { getDb } from "./database"

export function createThumbRecord(
    thumbRecord: ThumbRecordData,
) {

    const db = getDb()

    const stmt = db.prepare(`
    INSERT INTO thumbs (
      id,

      file_id,

      kind,

      storage_path,

      mime_type,

      width,
      height,

      size_bytes
    )
    VALUES (
      @id,

      @file_id,

      @kind,

      @storage_path,

      @mime_type,

      @width,
      @height,

      @size_bytes
    )
  `)

    stmt.run(thumbRecord)

    return thumbRecord
}