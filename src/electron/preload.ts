// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { BinRecordData, CreateBinInput } from "@shared/types";
import { contextBridge, ipcRenderer } from "electron";
// import { BinRecordData, CreateBinInput } from "./lib/types";
import { IPC } from '@shared/ipc'

contextBridge.exposeInMainWorld("store", {
  create: () => ipcRenderer.invoke(IPC.CREATE_STORE),
  check: () => ipcRenderer.invoke(IPC.CHECK_STORE),
  getRootBinId: () => ipcRenderer.invoke(IPC.GET_ROOT_BIN_ID),
  getBin: (binId: string) => ipcRenderer.invoke(IPC.GET_BIN_CONTENTS, binId),
  createBin: (input: CreateBinInput) => ipcRenderer.invoke(IPC.CREATE_BIN, input),
  test: () => ipcRenderer.invoke("test"),
})

contextBridge.exposeInMainWorld("file", {
  identify: (filePath: string) => ipcRenderer.invoke(IPC.IDENTIFY_FILE, filePath),
  ingest: (filePath: string, bin: BinRecordData) => ipcRenderer.invoke(IPC.INGEST_FILE, filePath, bin),
  pick: () => ipcRenderer.invoke(IPC.PICK_FILE),
})