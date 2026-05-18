import path from "path"

import { extensionMap } from "../extensionMap"
import type { FileTypeResult } from "../types"

export function identifyFileType(
  filePath: string,
): FileTypeResult {
  const extension = path.extname(filePath).toLowerCase()

  return {
    extension,
    category: extensionMap[extension] || "unknown",
  }
}