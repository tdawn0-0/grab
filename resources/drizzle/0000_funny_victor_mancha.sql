CREATE TABLE `history` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`timestamp` integer NOT NULL,
	`availableFormats` text NOT NULL,
	`plainText` text,
	`isUrl` integer NOT NULL,
	`html` text,
	`rtf` text,
	`blob` blob,
	`imageSha256` text,
	`filePaths` text
);
--> statement-breakpoint
CREATE INDEX `timestampIdx` ON `history` (`timestamp`);--> statement-breakpoint
CREATE INDEX `plainTextIdx` ON `history` (`plainText`);--> statement-breakpoint
CREATE INDEX `filePathsIdx` ON `history` (`filePaths`);--> statement-breakpoint
CREATE INDEX `imageSha256Idx` ON `history` (`imageSha256`);