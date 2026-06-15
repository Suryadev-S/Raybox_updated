// src/shared/ipc.ts

export const IPC = {
    CREATE_STORE: "create-store",
    CHECK_STORE: "check-store",
    GET_ROOT_BIN_ID: "get-root-bin-id",
    GET_BIN_CONTENTS: "get-bin-contents",
    CREATE_BIN: "create-bin",
    IDENTIFY_FILE: "identify-file",
    INGEST_FILE: "ingest-file",
    INGEST_FILE_V2: "ingest-file-v2",
    PICK_FILE: "pick-file",
    DELETE_BIN: "delete-bin",
    DELETE_FILE: "delete-file",
} as const;