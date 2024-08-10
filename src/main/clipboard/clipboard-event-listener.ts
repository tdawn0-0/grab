import { type ChildProcess, execFile } from "node:child_process";
import { EventEmitter } from "node:events";
import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { is } from "@electron-toolkit/utils";
import { app } from "electron";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const resourcesPath = app.getAppPath();
const unpackedPath = path.join(resourcesPath, "../app.asar.unpacked");

class ClipboardEventListener extends EventEmitter {
	private child: ChildProcess | null;
	constructor() {
		super();
		this.child = null;
	}

	startListening() {
		try {
			const { platform } = process;
			if (platform === "win32") {
				const filePath = is.dev
					? path.join(
							__dirname,
							"../../resources/clipboard-bin",
							"clipboard-event-handler-win32.exe",
						)
					: path.join(unpackedPath, "clipboard-bin", "clipboard-event-handler-win32.exe");
				this.child = execFile(filePath);
			} else if (platform === "linux") {
				const filePath = is.dev
					? path.join(__dirname, "../../resources/clipboard-bin", "clipboard-event-handler-linux")
					: path.join(unpackedPath, "clipboard-bin", "clipboard-event-handler-linux");
				fs.chmodSync(filePath, "755");
				this.child = execFile(filePath);
			} else if (platform === "darwin") {
				const filePath = is.dev
					? path.join(__dirname, "../../resources/clipboard-bin", "clipboard-event-handler-mac")
					: path.join(unpackedPath, "clipboard-bin", "clipboard-event-handler-mac");
				fs.chmodSync(filePath, "755");
				this.child = execFile(filePath);
			} else {
				throw new Error(`Unsupported platform: ${platform}`);
			}

			this.child?.stdout?.on("data", (data) => {
				if (data.trim() === "CLIPBOARD_CHANGE") {
					this.emit("change");
				}
			});

			this.child?.on("error", (error) => {
				throw new Error(`Error with the child process: ${error.message}`);
			});
		} catch (error) {
			if (error instanceof Error) {
				console.error("Error in startListening:", error.message);
			}
		}
	}

	stopListening() {
		return this.child?.kill();
	}
}

export const clipboardEventListener = new ClipboardEventListener();

// Sample usage
/*
// To start listening
clipboardListener.startListening();

clipboardListener.on('change', () => {
  console.log('Clipboard changed');
});

// To stop listening
clipboardListener.stopListening();
*/
