import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import http from "node:http";
import test from "node:test";

const port = 4197;

test("reader serves index and rejects traversal", async (t) => {
	const child = spawn(process.execPath, ["serve-reader.mjs"], {
		cwd: process.cwd(),
		env: { ...process.env, BLACK_CIRCLE_READER_PORT: String(port) },
		stdio: ["ignore", "pipe", "pipe"],
	});

	t.after(() => child.kill());

	await new Promise((resolve, reject) => {
		const timeout = setTimeout(
			() => reject(new Error("reader did not start")),
			3000,
		);
		child.stdout.on("data", (chunk) => {
			if (chunk.toString().includes("running")) {
				clearTimeout(timeout);
				resolve();
			}
		});
		child.once("error", reject);
		child.once("exit", (code) => {
			if (code !== null) reject(new Error(`reader exited with ${code}`));
		});
	});

	const index = await fetch(`http://127.0.0.1:${port}/index.html`);
	assert.equal(index.status, 200);

	const traversal = await new Promise((resolve, reject) => {
		const request = http.request(
			{ hostname: "127.0.0.1", port, path: "/%2e%2e/%2e%2e/AGENTS.md" },
			(response) => {
				response.resume();
				response.once("end", () => resolve(response));
			},
		);
		request.once("error", reject);
		request.end();
	});
	assert.equal(traversal.statusCode, 403);
});
