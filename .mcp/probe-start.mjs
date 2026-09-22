import { spawn } from "node:child_process";
import { setTimeout as wait } from "node:timers/promises";
import { pathToFileURL } from "node:url";

const endpoint = new URL(
	process.env.MCP_BRIDGE_URL ||
		`http://${process.env.MCP_HOST || "127.0.0.1"}:${process.env.MCP_PORT || 7331}/mcp`,
);
const authToken = (process.env.MCP_AUTH_TOKEN || "").trim();

async function isBridgeAlive() {
	try {
		const response = await fetch(endpoint, {
			method: "POST",
			headers: {
				Accept: "application/json, text/event-stream",
				...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				jsonrpc: "2.0",
				id: "probe-start",
				method: "initialize",
				params: {
					protocolVersion: "2025-06-18",
					capabilities: {},
					clientInfo: {
						name: "probe-start",
						version: "0.1.0",
					},
				},
			}),
		});
		return response.ok;
	} catch {
		return false;
	}
}

if (!(await isBridgeAlive())) {
	const child = spawn(process.execPath, [".mcp/bridge.mjs"], {
		cwd: process.cwd(),
		detached: true,
		stdio: "ignore",
		windowsHide: true,
	});
	child.unref();

	for (let attempt = 0; attempt < 20; attempt += 1) {
		await wait(250);
		if (await isBridgeAlive()) {
			break;
		}
	}
}

await import(pathToFileURL(`${process.cwd()}/.mcp/probe.mjs`).href);
