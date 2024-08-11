import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import type { MainHandlers } from "../main/query-handler";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type OmitFirstArg<F> = F extends (x: any, ...args: infer P) => infer R ? (...args: P) => R : never;

export const api = {
	getHistories: ipcRenderer.invoke.bind(ipcRenderer, "getHistories") as OmitFirstArg<
		MainHandlers["getHistories"]
	>,
};

contextBridge.exposeInMainWorld("electron", electronAPI);
contextBridge.exposeInMainWorld("api", api);
