// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { BinRecordData, CreateBinInput } from "./lib/types";

contextBridge.exposeInMainWorld("store", {
  create: () => ipcRenderer.invoke("create-store"),
  check: () => ipcRenderer.invoke("check-store"),
  getRootBinId: () => ipcRenderer.invoke("get-root-bin-id"),
  getBin: (binId: string) => ipcRenderer.invoke('get-bin-contents', binId),
  createBin: (input: CreateBinInput) => ipcRenderer.invoke('create-bin', input),
  test: () => ipcRenderer.invoke("test"),
})

contextBridge.exposeInMainWorld("file", {
  identify: (filePath: string) => ipcRenderer.invoke("identify-file", filePath),
  ingest: (filePath: string, bin: BinRecordData) => ipcRenderer.invoke("ingest-file", filePath, bin),
  pick: () => ipcRenderer.invoke("pick-file"),
})