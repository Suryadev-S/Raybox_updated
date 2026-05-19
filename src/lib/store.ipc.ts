import { dialog, ipcMain } from "electron"
import { createStore } from "./ipcHandlers/createStore"
import { checkStore } from "./ipcHandlers/checkStore"
import { identifyFileType } from "./ipcHandlers/identifyFileType"
import { ingestFile } from "./ipcHandlers/ingestFile"


ipcMain.handle("create-store", createStore)

ipcMain.handle("check-store", checkStore)

ipcMain.handle("identify-file", (_, filePath: string) =>
    identifyFileType(filePath),
)

ipcMain.handle("ingest-file", async (_, filePath: string) => {
    return ingestFile(filePath)
})

ipcMain.handle("pick-file", async () => {
    const result = await dialog.showOpenDialog({
        properties: ["openFile"],

        filters: [
            {
                name: "Media Files",
                extensions: [
                    // Images
                    "jpg",
                    "jpeg",
                    "png",
                    "webp",
                    "gif",

                    // Videos
                    "mp4",
                    "mov",
                    "mkv",
                    "avi",

                    // Audio
                    "mp3",
                    "wav",
                    "flac",

                    // Documents
                    "pdf",
                    "txt",
                ],
            },
        ],
    })

    if (
        result.canceled ||
        result.filePaths.length === 0
    ) {
        return {
            canceled: true,
        }
    }

    return {
        canceled: false,
        path: result.filePaths[0],
    }
})

ipcMain.handle("test", async () => {
    console.log("this is a test handler")

    // return {
    //     success: true,
    //     message: "handler works",
    // }
})