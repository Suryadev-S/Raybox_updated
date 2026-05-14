import { ipcMain } from "electron"
import { createStore } from "../createStore"
import { checkStore } from "../checkStore"


ipcMain.handle("store:create", createStore)

ipcMain.handle("store:check", checkStore)

ipcMain.handle("store:test", async () => {
    console.log("this is a test handler")

    // return {
    //     success: true,
    //     message: "handler works",
    // }
})