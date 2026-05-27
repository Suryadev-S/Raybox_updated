import crypto from "crypto"
import { BinRecordData, CreateBinInput } from "../types"
import { getDb } from "../db/database"

export function createBin({
    name,
    parentId,
}: CreateBinInput): BinRecordData {

    const db = getDb()

    // ROOT BIN CREATION
    if (parentId === null) {

        const rootBin: BinRecordData = {
            id: crypto.randomUUID(),

            parent_id: null,

            name,

            ancestor_path: "/",
        }

        db.prepare(`
      INSERT INTO bins (
        id,
        parent_id,
        name,
        ancestor_path
      )
      VALUES (?, ?, ?, ?)
    `).run(
            rootBin.id,
            rootBin.parent_id,
            rootBin.name,
            rootBin.ancestor_path,
        )

        return rootBin
    }

    // FIND PARENT BIN
    const parentBin = db.prepare(`
    SELECT *
    FROM bins
    WHERE id = ?
    AND deleted_at IS NULL
  `).get(parentId) as BinRecordData | undefined

    if (!parentBin) {
        throw new Error("PARENT_BIN_NOT_FOUND")
    }

    // BUILD ANCESTOR PATH
    const ancestorPath =
        parentBin.ancestor_path === "/"
            ? `/${parentBin.name}`
            : `${parentBin.ancestor_path}/${parentBin.name}`

    const bin: BinRecordData = {
        id: crypto.randomUUID(),

        parent_id: parentId,

        name,

        ancestor_path: ancestorPath,
    }

    db.prepare(`
    INSERT INTO bins (
      id,
      parent_id,
      name,
      ancestor_path
    )
    VALUES (?, ?, ?, ?)
  `).run(
        bin.id,
        bin.parent_id,
        bin.name,
        bin.ancestor_path,
    )

    return bin
}