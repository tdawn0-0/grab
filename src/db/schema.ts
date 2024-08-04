import { blob, index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const historyTable = sqliteTable(
	"history",
	{
		id: integer("id").primaryKey({ autoIncrement: true }),
		timestamp: integer("timestamp", { mode: "timestamp" })
			.notNull()
			.$default(() => new Date())
			.$onUpdate(() => new Date()),
		availableFormats: text("availableFormats", { mode: "json" }).notNull().$type<string[]>(),
		plainText: text("plainText"),
		isUrl: integer("isUrl", { mode: "boolean" })
			.notNull()
			.$default(() => false),
		html: text("html"),
		rtf: text("rtf"),
		image: blob("blob", { mode: "buffer" }),
		imageSha256: text("imageSha256"),
		filePaths: text("filePaths", { mode: "json" }).$type<string[]>(),
	},
	(table) => {
		return {
			timestampIdx: index("timestampIdx").on(table.timestamp),
			plainTextIdx: index("plainTextIdx").on(table.plainText),
			filePathsIdx: index("filePathsIdx").on(table.filePaths),
			imageSha256Idx: index("imageSha256Idx").on(table.imageSha256),
		};
	},
);

export type NewHistory = typeof historyTable.$inferInsert;
