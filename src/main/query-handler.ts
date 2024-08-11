import { desc, like } from "drizzle-orm";
import type { IpcMainInvokeEvent } from "electron";
import { type History, historyTable } from "../db/schema";
import { db } from "./db";

function getHistories(
	_: IpcMainInvokeEvent,
	{ limit = 100, offset = 0, keyword }: { limit?: number; offset?: number; keyword?: string } = {},
): Promise<History[]> {
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

function ping() {
	return "pong";
}

export const mainHandlers = {
	getHistories,
	ping,
};

export type MainHandlers = typeof mainHandlers;
