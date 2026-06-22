// import { FileRecordData } from "../types"
import { FileRecordData } from "@shared/types"
import { getDb } from "./database"


export function createFileRecord(
  fileRecord: FileRecordData,
) {
  const db = getDb()


  const stmt = db.prepare(`
    INSERT INTO files (
      id,

      parent_bin_id,

      original_name,

      file_name,

      storage_path,
      ancestor_path,

      mime_type,
      type,
      extension,

      size_bytes,

      checksum,

      width,
      height,

      duration
    )
    VALUES (
      @id,

      @parent_bin_id,

      @original_name,

      @file_name,

      @storage_path,
      @ancestor_path,

      @mime_type,
      @type,
      @extension,

      @size_bytes,

      @checksum,

      @width,
      @height,

      @duration
    )
  `)

  stmt.run(fileRecord)

  return fileRecord
}