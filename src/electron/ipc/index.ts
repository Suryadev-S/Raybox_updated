import { dialog, ipcMain } from "electron"
import './createStore'
import './checkStore'
import './identifyFileType'
import './ingestFile'
import './getBinContents'
import './createBin'
import './getRootBinId'
import './ingestFile_v2'
import './deleteFile';
import './deleteBin'

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
});

ipcMain.handle("test", async () => {
    console.log("this is a test handler")

    // return {
    //     success: true,
    //     message: "handler works",
    // }
});