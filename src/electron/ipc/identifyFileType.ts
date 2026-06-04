import { extensionMap } from "@electron/services/extensionMap"
import { IPC } from "@shared/ipc"
import { FileTypeResult } from "@shared/types"
import { ipcMain } from "electron"
import path from "path"

// import { extensionMap } from "../extensionMap"
// import type { FileTypeResult } from "../types"

export function identifyFileType(
  filePath: string,
): FileTypeResult {
  const extension = path.extname(filePath).toLowerCase()

  return {
    extension,
    category: extensionMap[extension] || "unknown",
  }
}

ipcMain.handle(IPC.IDENTIFY_FILE, (_, filePath: string) =>
  identifyFileType(filePath),
)