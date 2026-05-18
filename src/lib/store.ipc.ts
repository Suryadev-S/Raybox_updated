import { ipcMain } from "electron"
import { createStore } from "./ipcHandlers/createStore"
import { checkStore } from "./ipcHandlers/checkStore"
import { identifyFileType } from "./ipcHandlers/identifyFileType"


ipcMain.handle("create-store", createStore)

ipcMain.handle("check-store", checkStore)

ipcMain.handle("identify-file", (_, filePath: string) =>
    identifyFileType(filePath),
)

ipcMain.handle("test", async () => {
    console.log("this is a test handler")

    // return {
    //     success: true,
    //     message: "handler works",
    // }
})