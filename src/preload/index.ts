import { electronAPI } from "@electron-toolkit/preload";
import { contextBridge, ipcRenderer } from "electron";
import { mapValues } from "es-toolkit";
import { mainHandlers } from "../main/query-handler";

// biome-ignore lint/suspicious/noExplicitAny: <explanation>
type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never;

// Custom APIs for renderer
export const api = mapValues(mainHandlers, (f, key) => {
	return ipcRenderer.invoke.bind(ipcRenderer, key) as (
		...args: OmitFirst<Parameters<typeof f>>
	) => ReturnType<typeof f>;
});

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
	try {
		contextBridge.exposeInMainWorld("electron", electronAPI);
		contextBridge.exposeInMainWorld("api", api);
	} catch (error) {
		console.error(error);
	}
} else {
	window.electron = electronAPI;
	window.api = api;
}
