import { desc, like } from "drizzle-orm";
import type { IpcMainInvokeEvent } from "electron";
import { type History, historyTable } from "../db/schema";
import { db } from "./db";

function getHistories(
	_: IpcMainInvokeEvent,
	options: { limit: number; offset: number; keyword: string },
): Promise<History[]> {
	const { limit = 100, offset = 0, keyword } = options;
	const query = db
		.select()
		.from(historyTable)
		.limit(limit)
		.offset(offset)
		.orderBy(desc(historyTable.timestamp));

	if (keyword) {
		return query.where(like(historyTable.plainText, `%${keyword}%`));
	}
	return query;
}

export const mainHandlers = {
	getHistories,
};

export type MainHandlers = typeof mainHandlers;
