import fs from "fs/promises"

import { getConfigPath } from "./createStore"
import type {
    StoreConfig,
    CheckStoreResult,
} from "../types"

export async function checkStore(): Promise<CheckStoreResult> {
    try {
        const configExists = await fs
            .access(getConfigPath())
            .then(() => true)
            .catch(() => false)

        if (!configExists) {
            return {
                exists: false,
                reason: "CONFIG_NOT_FOUND",
            }
        }

        const configRaw = await fs.readFile(
            getConfigPath(),
            "utf-8",
        )

        const config = JSON.parse(configRaw) as StoreConfig

        const storeExists = await fs
            .access(config.storePath)
            .then(() => true)
            .catch(() => false)

        if (!storeExists) {
            return {
                exists: false,
                reason: "STORE_PATH_MISSING",
            }
        }

        return {
            exists: true,
            path: config.storePath,
        }
    } catch {
        return {
            exists: false,
            reason: "UNKNOWN_ERROR",
        }
    }
}