export type StoreConfig = {
    storePath: string
}

export type CheckStoreResult = {
    exists: boolean
    path?: string
    reason?: string
}