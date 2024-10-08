import type { ElectronAPI } from "@electron-toolkit/preload";
import type { api } from "./index";

declare global {
	interface Window {
		electron: ElectronAPI;
		api: typeof api;
	}
}
