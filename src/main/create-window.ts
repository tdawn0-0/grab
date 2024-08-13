import { join } from "node:path";
import { is } from "@electron-toolkit/utils";
import { BrowserWindow, screen, shell } from "electron";
import icon from "../../resources/icon.png?asset";

let mainWindow: BrowserWindow | null = null;
const winHeight = 300;

export function createWindow(): BrowserWindow {
	const cursor = screen.getCursorScreenPoint();
	const display = screen.getDisplayNearestPoint(cursor);
	const { x, y, width, height: safeHeight } = display.workArea;
	if (mainWindow) {
		mainWindow.setBounds({
			x,
			y: y + safeHeight - winHeight,
			width,
			height: winHeight,
		});
		mainWindow.show();
		return mainWindow;
	}
	// Create the browser window.
	mainWindow = new BrowserWindow({
		x: 0,
		y: y + safeHeight - winHeight,
		width: width,
		height: winHeight,
		show: false,
		autoHideMenuBar: true,
		...(process.platform === "linux" ? { icon } : {}),
		webPreferences: {
			preload: join(__dirname, "../preload/index.js"),
			sandbox: false,
		},
		alwaysOnTop: !is.dev,
		resizable: is.dev,
		frame: is.dev,
		vibrancy: "fullscreen-ui",
		backgroundMaterial: "mica",
	});

	mainWindow.on("ready-to-show", () => {
		mainWindow?.show();
	});

	if (is.dev) {
		mainWindow.webContents.openDevTools({ mode: "detach" });
	}
	if (!is.dev) {
		mainWindow.on("blur", () => {
			mainWindow?.hide();
		});
	}

	mainWindow.webContents.setWindowOpenHandler((details) => {
		shell.openExternal(details.url);
		return { action: "deny" };
	});

	// HMR for renderer base on electron-vite cli.
	// Load the remote URL for development or the local html file for production.
	if (is.dev && process.env.ELECTRON_RENDERER_URL) {
		mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL);
	} else {
		mainWindow.loadFile(join(__dirname, "../renderer/index.html"));
	}
	return mainWindow;
}
