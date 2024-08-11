import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";

export const api = {
	getHistories: ipcRenderer.invoke.bind(ipcRenderer, "getHistories"),
};

contextBridge.exposeInMainWorld("electron", electronAPI);
contextBridge.exposeInMainWorld("api", api);
