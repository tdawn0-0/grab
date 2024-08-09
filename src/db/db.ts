import * as fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { is } from "@electron-toolkit/utils";
import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import { app } from "electron";
import * as schema from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const dbPath = is.dev
	? path.join(__dirname, "sqlite.db")
	: path.join(app.getPath("userData"), "data/sqlite.db");

const dbFolder = path.dirname(dbPath);
if (!fs.existsSync(dbFolder)) {
	fs.mkdirSync(dbFolder, { recursive: true });
}

const sqlite = new Database(dbPath);
export const db = drizzle(sqlite, { schema });

export async function initDatabase() {
	return migrate(db, {
		migrationsFolder: is.dev
			? path.join(__dirname, "../../resources/drizzle")
			: path.join(process.resourcesPath, "drizzle"),
	});
}
