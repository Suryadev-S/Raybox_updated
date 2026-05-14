// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("store", {
  create: () => ipcRenderer.invoke("store:create"),
  check: () => ipcRenderer.invoke("store:check"),
  test: () => ipcRenderer.invoke("store:test"),
})