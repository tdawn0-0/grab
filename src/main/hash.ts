import * as crypto from "node:crypto";

export async function calculateHashForBuffer(data: Buffer) {
	const hash = crypto.createHash("sha256");
	hash.update(data);
	return hash.digest("hex");
}
