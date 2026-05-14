import fs from "fs/promises"
import path from "path"
import { dialog } from "electron"
import { app } from "electron"

// import { getConfigPath } from "./getStorePath"
import type { StoreConfig } from "../types"


export function getConfigPath() {
    return path.join(app.getPath("userData"), "config.json")
}

export async function createStore() {
    const result = await dialog.showOpenDialog({
        properties: ["openDirectory", "createDirectory"],
    })

    if (result.canceled || result.filePaths.length === 0) {
        return {
            success: false,
            reason: "STORE_SELECTION_CANCELLED",
        }
    }

    const selectedPath = result.filePaths[0]

    const config: StoreConfig = {
        storePath: selectedPath,
    }

    await fs.writeFile(
        getConfigPath(),
        JSON.stringify(config, null, 2),
        "utf-8",
    )

    return {
        success: true,
        path: selectedPath,
    }
}