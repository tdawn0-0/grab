import { electronApp, optimizer } from "@electron-toolkit/utils";
import { app, globalShortcut, ipcMain } from "electron";
import { initDatabase } from "../db/db";
import { startListenClipboard } from "./clipboard/clipboard";
import { createWindow } from "./create-window";

app.whenReady().then(async () => {
	// Set app user model id for windows
	electronApp.setAppUserModelId("com.electron");

	// Default open or close DevTools by F12 in development
	// and ignore CommandOrControl + R in production.
	// see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
	app.on("browser-window-created", (_, window) => {
		optimizer.watchWindowShortcuts(window);
	});

	await initDatabase();

	startListenClipboard();

	// IPC test
	ipcMain.on("ping", () => console.log("pong"));

	app.on("activate", () => {
		// On macOS it's common to re-create a window in the app when the
		// dock icon is clicked and there are no other windows open.
		createWindow();
	});
	const mainwindow = createWindow();

	globalShortcut.register("Shift+CommandOrControl+C", () => {
		if (mainwindow.isVisible()) {
			mainwindow.hide();
		} else {
			createWindow();
		}
		console.log("Electron loves global shortcuts!");
	});
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
// app.on("window-all-closed", () => {
// 	if (process.platform !== "darwin") {
// 		app.quit();
// 	}
// });
