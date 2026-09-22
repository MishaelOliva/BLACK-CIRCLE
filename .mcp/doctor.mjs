import { execFileSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import net from "node:net";
import os from "node:os";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

const workspaceRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const host = process.env.MCP_HOST || "127.0.0.1";
const port = Number.parseInt(process.env.MCP_PORT || "7331", 10);
const endpoint = process.env.MCP_BRIDGE_URL || `http://${host}:${port}/mcp`;
const serverManifestPath = resolve(workspaceRoot, ".mcp", "server.json");
const schemaPath = resolve(workspaceRoot, "mcp-schema.json");
const serverManifest = JSON.parse(readFileSync(serverManifestPath, "utf8"));
const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const manifestUrl = serverManifest.remotes?.[0]?.url || null;
const schemaEndpoint = schema.bridge?.endpoint || null;

function commonBrowserCandidates() {
	return [
		process.env.BROWSER_PATH,
		process.env.CHROME_PATH,
		process.env.EDGE_PATH,
		process.env.BRAVE_PATH,
		"C:\\Program Files\\BraveSoftware\\Brave-Browser\\Application\\brave.exe",
		"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
		"C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
		"C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
		"C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
	].filter(Boolean);
}

function commonToolCandidates() {
	return [
		{
			key: "git",
			names: ["git.exe", "git"],
		},
		{
			key: "rg",
			names: ["rg.exe", "rg"],
		},
		{
			key: "fd",
			names: ["fd.exe", "fdfind.exe", "fd", "fdfind"],
		},
		{
			key: "jq",
			names: ["jq.exe", "jq"],
		},
		{
			key: "yq",
			names: ["yq.exe", "yq"],
		},
		{
			key: "7z",
			names: ["7z.exe", "7za.exe", "7zz.exe", "7z", "7za", "7zz"],
		},
		{
			key: "tesseract",
			names: ["tesseract.exe", "tesseract"],
		},
		{
			key: "magick",
			names: ["magick.exe", "magick"],
		},
		{
			key: "ffmpeg",
			names: ["ffmpeg.exe", "ffmpeg"],
		},
		{
			key: "python",
			names: ["python.exe", "py.exe", "python", "py"],
		},
		{
			key: "gh",
			names: ["gh.exe", "gh"],
		},
		{
			key: "sqlite3",
			names: ["sqlite3.exe", "sqlite3"],
		},
	];
}

function findBrowserExecutable() {
	for (const candidate of commonBrowserCandidates()) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}
	return null;
}

function findExecutableUnder(root, names, maxEntries = 20000) {
	if (!root || !existsSync(root)) {
		return null;
	}

	const wanted = new Set(names.map((name) => name.toLowerCase()));
	const stack = [root];
	let visited = 0;

	while (stack.length && visited < maxEntries) {
		const current = stack.pop();
		let entries;
		try {
			entries = readdirSync(current, { withFileTypes: true });
		} catch {
			continue;
		}

		for (const entry of entries) {
			visited += 1;
			const fullPath = resolve(current, entry.name);
			if (wanted.has(entry.name.toLowerCase()) && existsSync(fullPath)) {
				return fullPath;
			}
			if (entry.isDirectory()) {
				stack.push(fullPath);
			}
			if (visited >= maxEntries) {
				break;
			}
		}
	}

	return null;
}

function findExecutable(names) {
	for (const name of names) {
		const envKey = `${name.replace(/\.(exe|cmd|bat)$/i, "").toUpperCase()}_PATH`;
		const candidate = process.env[envKey];
		if (candidate && existsSync(candidate)) {
			return candidate;
		}

		try {
			const command = execFileSync("where", [name], {
				encoding: "utf8",
				windowsHide: true,
				stdio: ["ignore", "pipe", "ignore"],
			})
				.trim()
				.split(/\r?\n/)
				.find(Boolean);
			if (command && existsSync(command.trim())) {
				return command.trim();
			}
		} catch {}

		try {
			const command = execFileSync(
				"powershell",
				[
					"-NoProfile",
					"-Command",
					`$c = Get-Command ${JSON.stringify(name)} -ErrorAction SilentlyContinue; if ($c) { $c.Source }`,
				],
				{
					encoding: "utf8",
					windowsHide: true,
					stdio: ["ignore", "pipe", "ignore"],
				},
			)
				.trim()
				.split(/\r?\n/)
				.find(Boolean);
			if (command) {
				return command.trim();
			}
		} catch {}
	}

	const fallbackRoots = [
		process.env.LOCALAPPDATA
			? resolve(process.env.LOCALAPPDATA, "Microsoft", "WinGet", "Packages")
			: null,
		process.env.LOCALAPPDATA
			? resolve(process.env.LOCALAPPDATA, "Microsoft", "WindowsApps")
			: null,
		process.env.ProgramFiles
			? resolve(process.env.ProgramFiles, "Tesseract-OCR")
			: null,
		process.env.ProgramFiles
			? resolve(process.env.ProgramFiles, "ffmpeg")
			: null,
		process.env.ProgramFiles
			? resolve(process.env.ProgramFiles, "Python313")
			: null,
		process.env.ProgramFiles
			? resolve(process.env.ProgramFiles, "SQLite")
			: null,
	].filter(Boolean);

	for (const root of fallbackRoots) {
		const found = findExecutableUnder(root, names);
		if (found) {
			return found;
		}
	}

	return null;
}

function checkPortOpen(hostname, portNumber) {
	return new Promise((resolvePromise) => {
		const socket = new net.Socket();
		let settled = false;

		const finish = (result) => {
			if (!settled) {
				settled = true;
				socket.destroy();
				resolvePromise(result);
			}
		};

		socket.setTimeout(1000);
		socket.once("connect", () => finish(true));
		socket.once("timeout", () => finish(false));
		socket.once("error", () => finish(false));
		socket.connect(portNumber, hostname);
	});
}

function detectHardware() {
	const fallback = {
		cpu: {
			name: os.cpus()[0]?.model || null,
			logicalThreads: os.cpus().length,
		},
		gpu: {
			name: null,
			vramGB: null,
		},
		memoryGB: {
			total: Math.round((os.totalmem() / 1024 ** 3) * 100) / 100,
		},
	};

	try {
		const raw = execFileSync(
			"powershell.exe",
			[
				"-NoProfile",
				"-NonInteractive",
				"-Command",
				[
					"$cpu = Get-CimInstance Win32_Processor | Select-Object -First 1 Name, NumberOfLogicalProcessors",
					"$gpu = Get-CimInstance Win32_VideoController | Sort-Object AdapterRAM -Descending | Select-Object -First 1 Name, AdapterRAM",
					"$memory = Get-CimInstance Win32_ComputerSystem | Select-Object -First 1 TotalPhysicalMemory",
					"[PSCustomObject]@{",
					"  cpu = [PSCustomObject]@{",
					"    name = $cpu.Name",
					"    logicalThreads = $cpu.NumberOfLogicalProcessors",
					"  }",
					"  gpu = [PSCustomObject]@{",
					"    name = $gpu.Name",
					"    vramGB = if ($gpu.AdapterRAM) { [math]::Round($gpu.AdapterRAM / 1GB, 2) } else { $null }",
					"  }",
					"  memoryGB = [PSCustomObject]@{",
					"    total = if ($memory.TotalPhysicalMemory) { [math]::Round($memory.TotalPhysicalMemory / 1GB, 2) } else { $null }",
					"  }",
					"} | ConvertTo-Json -Compress",
				].join("\n"),
			],
			{
				encoding: "utf8",
				windowsHide: true,
			},
		).trim();

		const parsed = JSON.parse(raw);
		return {
			cpu: {
				name: parsed.cpu?.name || fallback.cpu.name,
				logicalThreads:
					parsed.cpu?.logicalThreads || fallback.cpu.logicalThreads,
			},
			gpu: {
				name: parsed.gpu?.name || null,
				vramGB: parsed.gpu?.vramGB ?? null,
			},
			memoryGB: {
				total: parsed.memoryGB?.total ?? fallback.memoryGB.total,
			},
		};
	} catch {
		return fallback;
	}
}

const browser = findBrowserExecutable();
const helperTools = Object.fromEntries(
	commonToolCandidates().map((tool) => [tool.key, findExecutable(tool.names)]),
);
const missingHelperTools = Object.entries(helperTools)
	.filter(([, path]) => !path)
	.map(([key]) => key);
const portInUse = await checkPortOpen(host, port);
const hardware = detectHardware();
const reservedForOSAndIDE = Math.max(
	2,
	Math.min(8, Math.ceil(hardware.cpu.logicalThreads / 4)),
);
const hardwareProfile = {
	cpu: hardware.cpu.name,
	logicalThreads: hardware.cpu.logicalThreads,
	reservedForOSAndIDE,
	gpu: hardware.gpu.name,
	vramGB: hardware.gpu.vramGB,
	systemRamGB: hardware.memoryGB.total,
	embeddingPolicy:
		"4-bit quantized local embeddings; move to CPU above 85% VRAM",
};
const result = {
	endpoint,
	host,
	port,
	hardware,
	hardwareProfile,
	checks: {
		bridgeSyntax: "ok",
		browserAvailable: Boolean(browser),
		portInUse,
		serverManifestAligned: manifestUrl === endpoint,
		schemaAligned: schemaEndpoint === endpoint,
		helperToolsInstalled: missingHelperTools.length === 0,
		hardwareDetected: Boolean(hardware.cpu.name || hardware.gpu.name),
		cpuReadable: Boolean(hardware.cpu.name),
		gpuReadable: Boolean(hardware.gpu.name),
		logicalThreadsReadable: Number.isInteger(hardware.cpu.logicalThreads),
		vramReadable:
			hardware.gpu.vramGB === null || Number.isFinite(hardware.gpu.vramGB),
		systemRamReadable:
			hardware.memoryGB.total === null ||
			Number.isFinite(hardware.memoryGB.total),
	},
};

if (browser) {
	result.browserPath = browser;
}

if (manifestUrl) {
	result.serverManifestUrl = manifestUrl;
}

if (schemaEndpoint) {
	result.schemaEndpoint = schemaEndpoint;
}

if (Object.values(helperTools).some(Boolean)) {
	result.helperTools = helperTools;
}

if (missingHelperTools.length) {
	result.missingHelperTools = missingHelperTools;
}

if (!result.checks.serverManifestAligned || !result.checks.schemaAligned) {
	result.warning =
		"Manifest endpoint mismatch detected. Run `npm run sync-server`.";
}

if (missingHelperTools.length) {
	result.helperToolsRecommendation = `Bootstrap will install missing helper tools: ${missingHelperTools.join(", ")}.`;
}

result.embeddingRecommendation =
	hardwareProfile.vramGB === null
		? "Use 4-bit local embeddings for code indexing and move inference to CPU above 85% VRAM usage."
		: hardwareProfile.vramGB <= 4
			? "Keep embeddings 4-bit quantized and prefer CPU inference when VRAM pressure rises."
			: "Use 4-bit local embeddings, but watch GPU memory pressure and shift inference to CPU above 85% VRAM usage.";

console.log(JSON.stringify(result, null, 2));
