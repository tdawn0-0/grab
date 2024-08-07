import { is } from "@electron-toolkit/utils";
import to from "await-to-js";
import { eq } from "drizzle-orm";
import { clipboard } from "electron";
import clipboardEx from "electron-clipboard-ex";
import { db } from "../../db/db";
import { type NewHistory, historyTable } from "../../db/schema";
import { calculateHashForBuffer } from "../hash";
import { clipboardEventListener } from "./clipboard-event-listener";

export function startListenClipboard() {
	clipboardEventListener.startListening();
	clipboardEventListener.on("change", clipboardChangeHandler);
}

async function clipboardChangeHandler() {
	if (is.dev) console.log("Clipboard changed");
	const formats = clipboard.availableFormats();
	if (formats.length === 0) {
		return;
	}
	if (is.dev) console.log(formats);

	const history = await clipboardToHistory(formats);
	if (is.dev) console.log(history.plainText);
	const existColumn = await isHistoryExist(history);

	if (existColumn && history[existColumn]) {
		const [err] = await to(
			db
				.update(historyTable)
				.set({
					timestamp: new Date(),
					...history,
				})
				.where(eq(historyTable[existColumn], history[existColumn])),
		);
		if (is.dev) {
			console.error(err);
		}
		return;
	}

	const [err] = await to(db.insert(historyTable).values(history));
	if (is.dev) {
		console.error(err);
	}
}

async function clipboardToHistory(formats: string[]) {
	const history: NewHistory = {
		availableFormats: formats,
	};

	for (const format of formats) {
		switch (format) {
			case "text/plain": {
				history.plainText = clipboard.readText();
				if (urlRegex.test(history.plainText)) {
					history.isUrl = true;
					break;
				}
				const bookmark = clipboard.readBookmark();
				if (bookmark.url && isUrl(bookmark.url)) {
					history.plainText = bookmark.url;
					history.isUrl = true;
				}
				break;
			}
			case "text/html":
				history.html = clipboard.readHTML();
				break;
			case "text/rtf":
				history.rtf = clipboard.readRTF();
				break;
			case "image/png":
				history.image = clipboard.readImage().toPNG();
				history.imageSha256 = await calculateHashForBuffer(history.image);
				break;
			case "text/uri-list":
				history.filePaths = clipboardEx.readFilePaths();
				break;
			default:
				break;
		}
	}
	return history;
}

async function isHistoryExist(history: NewHistory): Promise<keyof NewHistory | false> {
	if (history.imageSha256) {
		const exist = await db.query.historyTable.findFirst({
			with: {
				imageSha256: history.imageSha256,
			},
		});
		return exist ? "imageSha256" : false;
	}
	if (history.filePaths) {
		const exist = await db.query.historyTable.findFirst({
			with: {
				filePaths: history.filePaths,
			},
		});
		return exist ? "filePaths" : false;
	}
	if (history.plainText) {
		const exist = await db.query.historyTable.findFirst({
			with: {
				plainText: history.plainText,
			},
		});
		return exist ? "plainText" : false;
	}
	return false;
}

const urlRegex =
	/^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/;

function isUrl(url: string) {
	return urlRegex.test(url);
}
