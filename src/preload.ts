// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("store", {
  create: () => ipcRenderer.invoke("create-store"),
  check: () => ipcRenderer.invoke("check-store"),
  test: () => ipcRenderer.invoke("test"),
})

contextBridge.exposeInMainWorld("file", {
  identify: (filePath: string) => ipcRenderer.invoke("identify-file", filePath),
  ingest: (filePath: string) => ipcRenderer.invoke("ingest-file", filePath),
  pick: () => ipcRenderer.invoke("pick-file"),
})