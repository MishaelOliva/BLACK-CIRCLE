import { execFile, execFileSync, spawn } from "node:child_process";
import { randomUUID, timingSafeEqual } from "node:crypto";
import {
	appendFileSync,
	existsSync,
	mkdirSync,
	readFileSync,
	readdirSync,
	writeFileSync,
} from "node:fs";
import http from "node:http";
import { basename, isAbsolute, join, relative, resolve } from "node:path";
import { pathToFileURL } from "node:url";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { isInitializeRequest } from "@modelcontextprotocol/sdk/types.js";
import { chromium } from "playwright-core";
import { z } from "zod";

const execFileAsync = promisify(execFile);

const workspaceRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const mcpDir = join(workspaceRoot, ".mcp");
const logsDir = join(mcpDir, "logs");
const artifactsDir = join(mcpDir, "artifacts");
const profilesDir = join(mcpDir, "profiles");
const shadowMetadataPath = join(mcpDir, "shadow-worktree.json");
const bridgeLogPath = join(logsDir, "bridge.log");
const host = process.env.MCP_HOST || "127.0.0.1";
const port = parsePort(process.env.MCP_PORT, 7331);
const authToken = (process.env.MCP_AUTH_TOKEN || "").trim();
const allowedOrigins = new Set(
	[
		`http://${host}:${port}`,
		host === "127.0.0.1" ? `http://localhost:${port}` : "",
		...(process.env.MCP_ALLOWED_ORIGINS || "").split(","),
	]
		.map((origin) => origin.trim())
		.filter(Boolean),
);
const sessions = new Map();

for (const dir of [mcpDir, logsDir, artifactsDir, profilesDir]) {
	if (!existsSync(dir)) {
		mkdirSync(dir, { recursive: true });
	}
}

function timestamp() {
	return new Date().toISOString();
}

function parsePort(value, fallback) {
	const parsed = Number.parseInt(value || "", 10);
	return Number.isInteger(parsed) && parsed > 0 && parsed < 65536
		? parsed
		: fallback;
}

function singleHeaderValue(value) {
	return Array.isArray(value) ? value[0] || "" : value || "";
}

function isOriginAllowed(req) {
	const origin = singleHeaderValue(req.headers.origin).trim();
	return !origin || allowedOrigins.has(origin);
}

function isAuthorized(req) {
	if (!authToken) return true;
	const authorization = singleHeaderValue(req.headers.authorization);
	const expected = `Bearer ${authToken}`;
	const actualBuffer = Buffer.from(authorization);
	const expectedBuffer = Buffer.from(expected);
	return (
		actualBuffer.length === expectedBuffer.length &&
		timingSafeEqual(actualBuffer, expectedBuffer)
	);
}

function setCorsHeaders(req, res) {
	const origin = singleHeaderValue(req.headers.origin).trim();
	if (origin && allowedOrigins.has(origin)) {
		res.setHeader("Access-Control-Allow-Origin", origin);
		res.setHeader("Vary", "Origin");
	}
	res.setHeader("Access-Control-Allow-Methods", "GET,POST,DELETE,OPTIONS");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Content-Type, Mcp-Session-Id, Last-Event-ID, Authorization",
	);
	res.setHeader("Access-Control-Expose-Headers", "Mcp-Session-Id");
}

function log(message, details) {
	const suffix = details ? ` ${JSON.stringify(details)}` : "";
	const line = `${timestamp()} ${message}${suffix}`;
	appendFileSync(bridgeLogPath, `${line}\n`, "utf8");
	process.stdout.write(`${line}\n`);
}

function logError(message, error) {
	const details =
		error instanceof Error
			? { name: error.name, message: error.message, stack: error.stack }
			: { error };
	log(message, details);
}

function readTail(path, tailLines) {
	if (!existsSync(path)) {
		return "";
	}
	const raw = readFileSync(path, "utf8").replace(/\r\n/g, "\n");
	const lines = raw.split("\n");
	return lines
		.slice(Math.max(0, lines.length - tailLines))
		.join("\n")
		.trimEnd();
}

function normalizeSearchText(value) {
	return String(value || "").replace(/\r\n/g, "\n");
}

function escapeRegExp(value) {
	return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function isIgnorablePath(fullPath) {
	const normalized = fullPath.replace(/\\/g, "/").toLowerCase();
	return (
		normalized.includes("/node_modules/") ||
		normalized.includes("/.git/") ||
		normalized.includes("/.mcp/artifacts/") ||
		normalized.includes("/.mcp/logs/") ||
		normalized.includes("/.mcp/profiles/")
	);
}

function collectFiles(rootDir, maxFiles) {
	const files = [];
	const stack = [rootDir];

	while (stack.length && files.length < maxFiles) {
		const current = stack.pop();
		let entries;
		try {
			entries = readdirSync(current, { withFileTypes: true });
		} catch {
			continue;
		}

		entries.sort((left, right) => {
			if (left.isDirectory() !== right.isDirectory()) {
				return left.isDirectory() ? -1 : 1;
			}
			return left.name.localeCompare(right.name);
		});

		for (
			let index = entries.length - 1;
			index >= 0 && files.length < maxFiles;
			index -= 1
		) {
			const entry = entries[index];
			const fullPath = join(current, entry.name);
			if (isIgnorablePath(fullPath)) {
				continue;
			}
			if (entry.isDirectory()) {
				stack.push(fullPath);
			} else {
				files.push(fullPath);
			}
		}
	}

	return files;
}

function numberedLines(lines, startLine) {
	const width = String(startLine + lines.length - 1).length;
	return lines
		.map(
			(line, index) =>
				`${String(startLine + index).padStart(width, " ")}: ${line}`,
		)
		.join("\n");
}

function readWorkspaceFile(
	path,
	startLine = 1,
	endLine = null,
	maxLines = 200,
) {
	const raw = normalizeSearchText(readFileSync(path, "utf8"));
	const lines = raw.split("\n");
	const normalizedStart = Math.max(
		1,
		Number.isFinite(startLine) ? startLine : 1,
	);
	const requestedEnd =
		endLine === null || !Number.isFinite(endLine)
			? normalizedStart + maxLines - 1
			: endLine;
	const normalizedEnd = Math.min(
		lines.length,
		Math.max(
			normalizedStart,
			Math.min(requestedEnd, normalizedStart + maxLines - 1),
		),
	);
	const slice = lines.slice(normalizedStart - 1, normalizedEnd);
	return {
		path,
		startLine: normalizedStart,
		endLine: normalizedEnd,
		totalLines: lines.length,
		truncated: normalizedEnd < lines.length,
		text: numberedLines(slice, normalizedStart),
	};
}

function searchWorkspaceFile(path, query, options) {
	const {
		useRegex = false,
		caseSensitive = false,
		maxMatches = 20,
		maxSnippetLength = 180,
	} = options;

	const raw = normalizeSearchText(readFileSync(path, "utf8"));
	const lines = raw.split("\n");
	const matches = [];
	const flags = caseSensitive ? "g" : "gi";
	const pattern = useRegex
		? new RegExp(query, flags)
		: new RegExp(escapeRegExp(query), flags);

	for (
		let lineIndex = 0;
		lineIndex < lines.length && matches.length < maxMatches;
		lineIndex += 1
	) {
		const line = lines[lineIndex];
		pattern.lastIndex = 0;
		const match = pattern.exec(line);
		if (!match) {
			continue;
		}

		const start = match.index;
		const end = Math.min(line.length, start + maxSnippetLength);
		const leftTrim = start > Math.floor(maxSnippetLength / 2);
		const rightTrim = end < line.length;
		const snippetStart = leftTrim
			? Math.max(0, start - Math.floor(maxSnippetLength / 2))
			: 0;
		const snippet = `${leftTrim ? "..." : ""}${line.slice(snippetStart, end)}${rightTrim ? "..." : ""}`;

		matches.push({
			lineNumber: lineIndex + 1,
			column: start + 1,
			snippet,
		});
	}

	return {
		path,
		matchCount: matches.length,
		truncated: matches.length >= maxMatches,
		matches,
	};
}

function getFileExtension(fullPath) {
	const name = basename(fullPath).toLowerCase();
	const index = name.lastIndexOf(".");
	return index >= 0 ? name.slice(index) : "";
}

function inferFileRole(fullPath) {
	const name = basename(fullPath).toLowerCase();
	const ext = getFileExtension(fullPath);
	const sourceExtensions = new Set([
		".js",
		".mjs",
		".cjs",
		".ts",
		".tsx",
		".jsx",
		".py",
		".go",
		".rs",
		".java",
		".kt",
		".cs",
		".rb",
		".php",
		".ps1",
		".sh",
		".zsh",
		".fish",
	]);
	const configExtensions = new Set([
		".json",
		".jsonc",
		".toml",
		".yaml",
		".yml",
		".ini",
		".env",
		".xml",
	]);
	const docsExtensions = new Set([".md", ".mdx", ".txt"]);

	if (name === "package.json") {
		return "manifest";
	}
	if (name === "mcp-schema.json") {
		return "protocol-schema";
	}
	if (name === "agents.md" || name === "readme.md") {
		return "docs";
	}
	if (/(\.test|\.spec)\./.test(name)) {
		return "test";
	}
	if (sourceExtensions.has(ext)) {
		return "source";
	}
	if (configExtensions.has(ext)) {
		return "config";
	}
	if (docsExtensions.has(ext)) {
		return "docs";
	}

	return "other";
}

function isOutlineRelevantFile(fullPath) {
	return inferFileRole(fullPath) !== "other";
}

function extractPackageJsonOutline(path) {
	const data = JSON.parse(readFileSync(path, "utf8"));
	const scripts = Object.keys(data.scripts || {});
	const dependencies = Object.keys({
		...data.dependencies,
		...data.devDependencies,
	});

	return {
		kind: "manifest",
		summary: [
			data.name ? `name=${data.name}` : null,
			data.version ? `version=${data.version}` : null,
			scripts.length
				? `scripts=${scripts.slice(0, 12).join(", ")}`
				: "scripts=none",
			dependencies.length
				? `deps=${dependencies.slice(0, 12).join(", ")}`
				: "deps=none",
		].filter(Boolean),
	};
}

function extractJsonOutline(path) {
	const data = JSON.parse(readFileSync(path, "utf8"));
	const keys = Object.keys(data).slice(0, 12);
	return {
		kind: "config",
		summary: keys.length ? [`keys=${keys.join(", ")}`] : ["keys=none"],
	};
}

function extractMarkdownOutline(path) {
	const lines = normalizeSearchText(readFileSync(path, "utf8")).split("\n");
	const headings = [];

	for (const line of lines) {
		const match = /^\s*#{1,3}\s+(.+)$/.exec(line);
		if (match) {
			headings.push(match[1].trim());
		}
		if (headings.length >= 8) {
			break;
		}
	}

	return {
		kind: "docs",
		summary: headings.length
			? headings.map((heading) => `# ${heading}`)
			: ["headings=none"],
	};
}

function extractSourceOutline(path) {
	const lines = normalizeSearchText(readFileSync(path, "utf8")).split("\n");
	const signatures = [];
	const seen = new Set();
	const matchers = [
		/^\s*server\.registerTool\(\s*["'`]([^"'`]+)["'`]/,
		/^\s*export\s+(?:default\s+)?(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/,
		/^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/,
		/^\s*(?:export\s+)?class\s+([A-Za-z_$][\w$]*)/,
		/^\s*(?:export\s+)?const\s+([A-Za-z_$][\w$]*)\s*=/,
		/^\s*(?:async\s+)?def\s+([A-Za-z_][\w]*)\s*\(/,
		/^\s*(?:public\s+)?(?:static\s+)?(?:async\s+)?([A-Za-z_$][\w$]*)\s*\(/,
	];

	for (const line of lines) {
		for (const matcher of matchers) {
			const match = matcher.exec(line);
			if (!match) {
				continue;
			}
			const label = match[1] ? `${match[1]}` : line.trim();
			if (!seen.has(label)) {
				seen.add(label);
				signatures.push(line.trim());
			}
			break;
		}

		if (signatures.length >= 8) {
			break;
		}
	}

	return {
		kind: "source",
		summary: signatures.length ? signatures : ["signatures=none"],
	};
}

function outlineWorkspaceFile(path) {
	const role = inferFileRole(path);
	const name = basename(path).toLowerCase();

	if (name === "package.json") {
		return extractPackageJsonOutline(path);
	}
	if (name.endsWith(".json")) {
		return extractJsonOutline(path);
	}
	if (name.endsWith(".md") || name.endsWith(".mdx") || name.endsWith(".txt")) {
		return extractMarkdownOutline(path);
	}
	if (role === "source" || role === "test") {
		return extractSourceOutline(path);
	}

	return {
		kind: role,
		summary: [`file=${basename(path)}`],
	};
}

function formatOutlineEntry(path, outline) {
	return [
		`${path} [${outline.kind}]`,
		...outline.summary.map((item) => `  - ${item}`),
	].join("\n");
}

function buildWorkspaceOutline(projectDir, maxFiles, maxEntriesPerFile) {
	const candidates = collectFiles(projectDir, maxFiles * 4)
		.filter(isOutlineRelevantFile)
		.sort((left, right) => {
			const leftRelative = relative(projectDir, left);
			const rightRelative = relative(projectDir, right);
			const leftTopLevel = leftRelative.split(/[/\\]/).length === 1;
			const rightTopLevel = rightRelative.split(/[/\\]/).length === 1;
			if (leftTopLevel !== rightTopLevel) {
				return leftTopLevel ? -1 : 1;
			}
			return leftRelative.localeCompare(rightRelative);
		})
		.slice(0, maxFiles);

	const items = [];
	for (const file of candidates) {
		try {
			const outline = outlineWorkspaceFile(file);
			items.push({
				path: relative(workspaceRoot, file),
				kind: outline.kind,
				summary: outline.summary.slice(0, maxEntriesPerFile),
			});
		} catch {}
	}

	return items;
}

function parseGitStatusLine(line) {
	const status = line.slice(0, 2);
	const rawPath = line.slice(3);
	if (rawPath.includes(" -> ")) {
		const [oldPath, newPath] = rawPath.split(" -> ");
		return {
			status,
			path: newPath,
			oldPath,
		};
	}

	return {
		status,
		path: rawPath,
		oldPath: null,
	};
}

async function buildWorkspaceDiff(
	projectDir,
	{ includeUntracked, maxFiles, maxLinesPerFile },
) {
	const gitRoot = findGitRoot(projectDir);
	if (!gitRoot) {
		return {
			supported: false,
			reason: "Not a git workspace.",
		};
	}

	const statusResult = await gitExec(["status", "--porcelain=v1"], gitRoot);
	const entries = statusResult.stdout
		.replace(/\r\n/g, "\n")
		.split("\n")
		.filter(Boolean)
		.map(parseGitStatusLine)
		.filter((entry) => includeUntracked || entry.status !== "??")
		.slice(0, maxFiles);

	const files = [];
	for (const entry of entries) {
		const resolvedPath = resolve(gitRoot, entry.path);
		let diffLines = [];
		let numstat = null;

		if (entry.status !== "??") {
			const diffResult = await gitExec(
				["diff", "--no-color", "--unified=0", "--", entry.path],
				gitRoot,
			);
			diffLines = diffResult.stdout
				.replace(/\r\n/g, "\n")
				.split("\n")
				.filter(Boolean)
				.slice(0, maxLinesPerFile);

			const numstatResult = await gitExec(
				["diff", "--no-color", "--numstat", "--", entry.path],
				gitRoot,
			);
			const numstatLine = numstatResult.stdout
				.replace(/\r\n/g, "\n")
				.split("\n")
				.find(Boolean);

			if (numstatLine) {
				const [added, removed] = numstatLine.split(/\s+/);
				numstat = {
					added: added === "-" ? null : Number.parseInt(added, 10),
					removed: removed === "-" ? null : Number.parseInt(removed, 10),
				};
			}
		}

		files.push({
			path: relative(workspaceRoot, resolvedPath),
			status: entry.status,
			oldPath: entry.oldPath
				? relative(workspaceRoot, resolve(gitRoot, entry.oldPath))
				: null,
			numstat,
			diffLines,
		});
	}

	return {
		supported: true,
		gitRoot,
		truncated:
			statusResult.stdout.replace(/\r\n/g, "\n").split("\n").filter(Boolean)
				.length > entries.length,
		files,
	};
}

function sanitizeOutputName(name) {
	const safe = basename(name || "").replace(/[^A-Za-z0-9._-]+/g, "_");
	return safe || `capture-${timestamp().replace(/[:.]/g, "-")}.png`;
}

function compactDiagnostics({
	captureError,
	consoleMessages = [],
	pageErrors = [],
	failedRequests = [],
}) {
	const diagnostics = {};

	if (captureError) {
		diagnostics.captureError = captureError;
	}
	if (consoleMessages.length) {
		diagnostics.console = consoleMessages.slice(0, 8);
	}
	if (pageErrors.length) {
		diagnostics.pageErrors = pageErrors.slice(0, 8);
	}
	if (failedRequests.length) {
		diagnostics.failedRequests = failedRequests.slice(0, 8);
	}

	return diagnostics;
}

function readJson(path, fallback = null) {
	if (!existsSync(path)) {
		return fallback;
	}
	return JSON.parse(readFileSync(path, "utf8"));
}

function writeJson(path, value) {
	writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

function sanitizeSlug(value, fallback = "task") {
	const slug = String(value || "")
		.toLowerCase()
		.replace(/[^a-z0-9._-]+/g, "-")
		.replace(/^-+|-+$/g, "")
		.slice(0, 40);
	return slug || fallback;
}

function timestampId() {
	return new Date()
		.toISOString()
		.replace(/[-:TZ.]/g, "")
		.slice(0, 14);
}

function resolveWorkspacePath(target = ".") {
	const resolved = resolve(workspaceRoot, target);
	const relativePath = relative(workspaceRoot, resolved);
	if (relativePath.startsWith("..") || isAbsolute(relativePath)) {
		throw new Error("Path must stay within the workspace root.");
	}
	return resolved;
}

function fileContains(path, pattern) {
	if (!existsSync(path)) {
		return false;
	}
	return pattern.test(readFileSync(path, "utf8"));
}

function detectPackageManager(projectDir) {
	if (existsSync(join(projectDir, "pnpm-lock.yaml"))) {
		return "pnpm";
	}
	if (existsSync(join(projectDir, "yarn.lock"))) {
		return "yarn";
	}
	if (
		existsSync(join(projectDir, "bun.lockb")) ||
		existsSync(join(projectDir, "bun.lock"))
	) {
		return "bun";
	}
	return "npm";
}

function detectWorkspaceProfile(projectDir) {
	const markers = [];
	const packageJsonPath = join(projectDir, "package.json");
	if (existsSync(packageJsonPath)) {
		markers.push("node");
		const packageJson = readJson(packageJsonPath, {});
		const dependencies = {
			...packageJson.dependencies,
			...packageJson.devDependencies,
		};
		const names = new Set(Object.keys(dependencies || {}));
		if (existsSync(join(projectDir, "tsconfig.json"))) {
			markers.push("typescript");
		}
		if (names.has("react")) {
			markers.push("react");
		}
		if (names.has("next")) {
			markers.push("nextjs");
		}
		if (names.has("vue")) {
			markers.push("vue");
		}
		if (names.has("svelte")) {
			markers.push("svelte");
		}
		if (names.has("astro")) {
			markers.push("astro");
		}
		if (names.has("@angular/core")) {
			markers.push("angular");
		}
		if (names.has("vite")) {
			markers.push("vite");
		}
		if (names.has("express")) {
			markers.push("express");
		}
		if (names.has("@nestjs/core")) {
			markers.push("nestjs");
		}
	}

	if (existsSync(join(projectDir, "Cargo.toml"))) {
		markers.push("rust");
	}
	if (existsSync(join(projectDir, "go.mod"))) {
		markers.push("go");
	}
	if (
		existsSync(join(projectDir, "pyproject.toml")) ||
		existsSync(join(projectDir, "requirements.txt"))
	) {
		markers.push("python");
	}
	if (
		existsSync(join(projectDir, "pom.xml")) ||
		existsSync(join(projectDir, "build.gradle")) ||
		existsSync(join(projectDir, "build.gradle.kts"))
	) {
		markers.push("jvm");
	}
	if (
		readdirSync(projectDir, { withFileTypes: true }).some(
			(entry) => entry.name.endsWith(".sln") || entry.name.endsWith(".csproj"),
		)
	) {
		markers.push(".net");
	}

	return [...new Set(markers)].sort();
}

function detectTestCommand(projectDir) {
	const packageJsonPath = join(projectDir, "package.json");
	if (existsSync(packageJsonPath)) {
		const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
		const testScript = packageJson.scripts?.test;
		if (testScript && !/no test specified/i.test(testScript)) {
			const packageManager = detectPackageManager(projectDir);
			if (packageManager === "pnpm") {
				return "pnpm test";
			}
			if (packageManager === "yarn") {
				return "yarn test";
			}
			if (packageManager === "bun") {
				return "bun test";
			}
			return "npm test";
		}
	}

	if (existsSync(join(projectDir, "Cargo.toml"))) {
		return "cargo test --quiet";
	}

	if (existsSync(join(projectDir, "go.mod"))) {
		return "go test ./...";
	}

	const pyprojectPath = join(projectDir, "pyproject.toml");
	if (
		fileContains(pyprojectPath, /\bpytest\b/i) ||
		fileContains(join(projectDir, "requirements.txt"), /\bpytest\b/i) ||
		existsSync(join(projectDir, "pytest.ini")) ||
		existsSync(join(projectDir, "tox.ini"))
	) {
		return "python -m pytest -q";
	}

	if (existsSync(join(projectDir, "pom.xml"))) {
		return "mvn -q test";
	}

	if (existsSync(join(projectDir, "gradlew.bat"))) {
		return ".\\gradlew.bat test --console=plain";
	}

	if (existsSync(join(projectDir, "gradlew"))) {
		return "./gradlew test --console=plain";
	}

	const entries = readdirSync(projectDir, { withFileTypes: true }).map(
		(entry) => entry.name,
	);
	if (
		entries.some((name) => name.endsWith(".sln") || name.endsWith(".csproj"))
	) {
		return "dotnet test --nologo --verbosity minimal";
	}

	return null;
}

function createTailCollector(maxLines, maxChars) {
	const lines = [];
	let trailing = "";
	let truncated = false;

	function totalChars() {
		return lines.reduce((sum, line) => sum + line.length + 1, 0);
	}

	function trim() {
		while (lines.length > maxLines) {
			lines.shift();
			truncated = true;
		}
		while (lines.length > 1 && totalChars() > maxChars) {
			lines.shift();
			truncated = true;
		}
	}

	function push(line) {
		lines.push(line);
		trim();
	}

	return {
		write(chunk) {
			const normalized = `${trailing}${chunk}`.replace(/\r/g, "");
			const parts = normalized.split("\n");
			trailing = parts.pop() || "";
			for (const part of parts) {
				push(part);
			}
		},
		finish() {
			if (trailing) {
				push(trailing);
				trailing = "";
			}
			return {
				text: lines.join("\n").trim(),
				truncated,
			};
		},
	};
}

function listTopLevelEntries(projectDir, maxEntries) {
	return readdirSync(projectDir, { withFileTypes: true })
		.filter((entry) => !["node_modules"].includes(entry.name))
		.sort((left, right) => {
			if (left.isDirectory() !== right.isDirectory()) {
				return left.isDirectory() ? -1 : 1;
			}
			return left.name.localeCompare(right.name);
		})
		.slice(0, maxEntries)
		.map((entry) => ({
			name: entry.name,
			kind: entry.isDirectory() ? "dir" : "file",
		}));
}

function findGitRoot(projectDir) {
	try {
		return execFileSync("git", ["rev-parse", "--show-toplevel"], {
			cwd: projectDir,
			encoding: "utf8",
			windowsHide: true,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return null;
	}
}

function currentBranch(projectDir) {
	try {
		return execFileSync("git", ["rev-parse", "--abbrev-ref", "HEAD"], {
			cwd: projectDir,
			encoding: "utf8",
			windowsHide: true,
			stdio: ["ignore", "pipe", "ignore"],
		}).trim();
	} catch {
		return null;
	}
}

function parseGitWorktrees(raw) {
	const items = [];
	let current = {};

	for (const line of raw.replace(/\r\n/g, "\n").split("\n")) {
		if (!line.trim()) {
			if (current.path) {
				items.push(current);
			}
			current = {};
			continue;
		}

		const [key, ...rest] = line.split(" ");
		const value = rest.join(" ");
		if (key === "worktree") {
			current.path = value;
		} else if (key === "branch") {
			current.branch = value.replace(/^refs\/heads\//, "");
		} else if (key === "HEAD") {
			current.head = value;
		} else if (key === "detached") {
			current.detached = true;
		} else if (key === "locked") {
			current.locked = value || true;
		} else if (key === "prunable") {
			current.prunable = value || true;
		}
	}

	if (current.path) {
		items.push(current);
	}

	return items;
}

async function gitExec(args, cwd) {
	const { stdout, stderr } = await execFileAsync("git", args, {
		cwd,
		windowsHide: true,
	});

	return {
		stdout: String(stdout || "").trim(),
		stderr: String(stderr || "").trim(),
	};
}

async function getShadowWorktreeStatus(projectDir) {
	const gitRoot = findGitRoot(projectDir);
	if (!gitRoot) {
		return {
			supported: false,
			reason: "Not a git workspace.",
		};
	}

	const worktreesRaw = await gitExec(
		["worktree", "list", "--porcelain"],
		gitRoot,
	);
	const worktrees = parseGitWorktrees(worktreesRaw.stdout);
	const metadata = readJson(shadowMetadataPath, null);
	const secondary = worktrees.filter(
		(item) => resolve(item.path) !== resolve(gitRoot),
	);

	return {
		supported: true,
		gitRoot,
		currentBranch: currentBranch(projectDir),
		worktrees,
		secondaryWorktrees: secondary,
		metadata,
		hasShadow: secondary.length > 0,
	};
}

function defaultShadowPath(gitRoot) {
	return resolve(gitRoot, "..", `${basename(gitRoot)}-shadow`);
}

function renderWorkspaceContext(context) {
	const lines = [
		`Path: ${context.cwd}`,
		`Profile: ${context.profile.length ? context.profile.join(", ") : "unknown"}`,
		`Package manager: ${context.packageManager || "n/a"}`,
		`Test command: ${context.testCommand || "not detected"}`,
		`Git: ${context.git.supported ? `repo (${context.git.worktreeCount} worktree${context.git.worktreeCount === 1 ? "" : "s"})` : "not detected"}`,
	];

	if (context.shadowWorktreePath) {
		lines.push(`Shadow worktree: ${context.shadowWorktreePath}`);
	}

	if (context.topLevelEntries.length) {
		lines.push(
			`Top level: ${context.topLevelEntries.map((entry) => `${entry.kind}:${entry.name}`).join(", ")}`,
		);
	}

	return lines.join("\n");
}

async function runShellCommand(command, options) {
	const { cwd, timeoutMs = 120000, maxLines = 80, maxChars = 12000 } = options;

	return await new Promise((resolvePromise, rejectPromise) => {
		const stdout = createTailCollector(maxLines, maxChars);
		const stderr = createTailCollector(maxLines, maxChars);
		const startedAt = Date.now();
		let timedOut = false;
		let settled = false;

		const child = spawn(command, {
			cwd,
			env: process.env,
			shell: true,
			windowsHide: true,
		});

		const timeout = setTimeout(() => {
			timedOut = true;
			if (child.pid) {
				execFile(
					"taskkill",
					["/pid", String(child.pid), "/t", "/f"],
					{ windowsHide: true },
					() => {},
				);
			} else {
				child.kill();
			}
		}, timeoutMs);

		function settle(result) {
			if (!settled) {
				settled = true;
				clearTimeout(timeout);
				resolvePromise(result);
			}
		}

		child.stdout.on("data", (chunk) => {
			stdout.write(String(chunk));
		});

		child.stderr.on("data", (chunk) => {
			stderr.write(String(chunk));
		});

		child.on("error", (error) => {
			clearTimeout(timeout);
			rejectPromise(error);
		});

		child.on("close", (exitCode, signal) => {
			const stdoutResult = stdout.finish();
			const stderrResult = stderr.finish();
			settle({
				command,
				cwd,
				exitCode,
				signal,
				timedOut,
				durationMs: Date.now() - startedAt,
				stdoutTail: stdoutResult.text,
				stderrTail: stderrResult.text,
				truncated: stdoutResult.truncated || stderrResult.truncated,
			});
		});
	});
}

function renderTestSummary(result) {
	const parts = [
		`Command: ${result.command}`,
		`Status: ${result.status}`,
		`Exit: ${result.exitCode === null ? "null" : result.exitCode}`,
		`DurationMs: ${result.durationMs}`,
	];

	if (result.stderrTail) {
		parts.push(`stderr:\n${result.stderrTail}`);
	}

	if (result.status !== "passed" && result.stdoutTail) {
		parts.push(`stdout:\n${result.stdoutTail}`);
	}

	if (result.truncated) {
		parts.push("Output truncated to the configured tail window.");
	}

	return parts.join("\n\n");
}

function buildServer() {
	const server = new McpServer(
		{
			name: "protocols-mcp-bridge",
			version: "0.1.0",
		},
		{
			capabilities: {
				logging: {},
			},
		},
	);

	server.registerTool(
		"terminal_stream",
		{
			title: "Terminal Stream",
			description:
				"Return the tail of the bridge log so clients can inspect the current session stream.",
			inputSchema: {
				tailLines: z.number().int().min(1).max(1000).default(200),
			},
		},
		async ({ tailLines }) => {
			const content = readTail(bridgeLogPath, tailLines);
			const text = content || "(bridge log is empty)";
			return {
				content: [{ type: "text", text }],
				structuredContent: {
					path: bridgeLogPath,
					tailLines,
					mode: "bridge-log",
				},
			};
		},
	);

	server.registerTool(
		"screenshot",
		{
			title: "Screenshot",
			description:
				"Capture the current desktop or a URL/file target to a local PNG artifact.",
			inputSchema: {
				target: z
					.string()
					.optional()
					.describe("Optional URL or local file path to capture."),
				width: z.number().int().min(320).max(3840).default(1600),
				height: z.number().int().min(240).max(3840).default(1200),
				waitMs: z.number().int().min(0).max(15000).default(3500),
				outputName: z
					.string()
					.optional()
					.describe("Optional output file name."),
			},
		},
		async ({ target, width, height, waitMs, outputName }) => {
			const capture = await captureTarget({
				target,
				width,
				height,
				waitMs,
				outputName,
			});
			log("Screenshot captured", capture);
			return {
				content: [
					{
						type: "text",
						text: `Screenshot saved to ${capture.path} (${capture.mode}).`,
					},
				],
				structuredContent: capture,
			};
		},
	);

	server.registerTool(
		"test_run",
		{
			title: "Test Run",
			description:
				"Run project tests with a detected or explicit command and return bounded output for debugging.",
			inputSchema: {
				command: z
					.string()
					.optional()
					.describe(
						"Optional explicit test command. If omitted, the bridge will detect one.",
					),
				cwd: z
					.string()
					.optional()
					.describe(
						"Optional workspace-relative directory to run the test command in.",
					),
				timeoutMs: z.number().int().min(1000).max(900000).default(120000),
				maxLines: z.number().int().min(10).max(400).default(80),
				maxChars: z.number().int().min(500).max(40000).default(12000),
			},
		},
		async ({ command, cwd, timeoutMs, maxLines, maxChars }) => {
			const resolvedCwd = resolveWorkspacePath(cwd || ".");
			const detectedCommand = command || detectTestCommand(resolvedCwd);
			if (!detectedCommand) {
				throw new Error(
					"No test command detected. Provide `command` explicitly for this project.",
				);
			}

			const result = await runShellCommand(detectedCommand, {
				cwd: resolvedCwd,
				timeoutMs,
				maxLines,
				maxChars,
			});

			const status = result.timedOut
				? "timed_out"
				: result.exitCode === 0
					? "passed"
					: "failed";
			const structuredContent = {
				...result,
				status,
			};

			log("Test command finished", {
				command: structuredContent.command,
				cwd: structuredContent.cwd,
				status: structuredContent.status,
				exitCode: structuredContent.exitCode,
				timedOut: structuredContent.timedOut,
				durationMs: structuredContent.durationMs,
			});

			return {
				content: [{ type: "text", text: renderTestSummary(structuredContent) }],
				structuredContent,
			};
		},
	);

	server.registerTool(
		"workspace_context",
		{
			title: "Workspace Context",
			description:
				"Return a compact, token-efficient summary of the current workspace for startup auditing.",
			inputSchema: {
				cwd: z
					.string()
					.optional()
					.describe("Optional workspace-relative directory to inspect."),
				maxEntries: z.number().int().min(5).max(60).default(20),
			},
		},
		async ({ cwd, maxEntries }) => {
			const resolvedCwd = resolveWorkspacePath(cwd || ".");
			const shadow = await getShadowWorktreeStatus(resolvedCwd);
			const structuredContent = {
				cwd: resolvedCwd,
				profile: detectWorkspaceProfile(resolvedCwd),
				packageManager: existsSync(join(resolvedCwd, "package.json"))
					? detectPackageManager(resolvedCwd)
					: null,
				testCommand: detectTestCommand(resolvedCwd),
				hasAgents: existsSync(join(resolvedCwd, "AGENTS.md")),
				hasMcpDir: existsSync(join(resolvedCwd, ".mcp")),
				topLevelEntries: listTopLevelEntries(resolvedCwd, maxEntries),
				git: {
					supported: shadow.supported,
					root: shadow.gitRoot || null,
					currentBranch: shadow.currentBranch || null,
					worktreeCount: shadow.worktrees?.length || 0,
				},
				shadowWorktreePath:
					shadow.secondaryWorktrees?.[0]?.path || shadow.metadata?.path || null,
			};

			return {
				content: [
					{ type: "text", text: renderWorkspaceContext(structuredContent) },
				],
				structuredContent,
			};
		},
	);

	server.registerTool(
		"workspace_search",
		{
			title: "Workspace Search",
			description:
				"Search workspace files and return compact, line-numbered hits for token-efficient inspection.",
			inputSchema: {
				cwd: z
					.string()
					.optional()
					.describe("Optional workspace-relative directory to search within."),
				query: z.string().min(1),
				useRegex: z.boolean().default(false),
				caseSensitive: z.boolean().default(false),
				maxFiles: z.number().int().min(1).max(200).default(40),
				maxMatches: z.number().int().min(1).max(100).default(20),
				maxSnippetLength: z.number().int().min(40).max(400).default(180),
			},
		},
		async ({
			cwd,
			query,
			useRegex,
			caseSensitive,
			maxFiles,
			maxMatches,
			maxSnippetLength,
		}) => {
			const resolvedCwd = resolveWorkspacePath(cwd || ".");
			const files = collectFiles(resolvedCwd, maxFiles);
			const results = [];
			let searchedFiles = 0;

			for (const file of files) {
				searchedFiles += 1;
				try {
					const result = searchWorkspaceFile(file, query, {
						useRegex,
						caseSensitive,
						maxMatches: Math.max(1, maxMatches - results.length),
						maxSnippetLength,
					});
					if (result.matches.length) {
						results.push({
							path: relative(workspaceRoot, file),
							matches: result.matches,
						});
					}
				} catch {
					continue;
				}

				if (
					results.reduce((sum, item) => sum + item.matches.length, 0) >=
					maxMatches
				) {
					break;
				}
			}

			const flattenedCount = results.reduce(
				(sum, item) => sum + item.matches.length,
				0,
			);
			return {
				content: [
					{
						type: "text",
						text: results.length
							? results
									.map((item) =>
										[
											item.path,
											...item.matches.map(
												(match) =>
													`  ${match.lineNumber}:${match.column} ${match.snippet}`,
											),
										].join("\n"),
									)
									.join("\n\n")
							: "(no matches)",
					},
				],
				structuredContent: {
					cwd: resolvedCwd,
					query,
					useRegex,
					caseSensitive,
					searchedFiles,
					matchCount: flattenedCount,
					truncated: flattenedCount >= maxMatches,
					results,
				},
			};
		},
	);

	server.registerTool(
		"workspace_read",
		{
			title: "Workspace Read",
			description:
				"Read a bounded line range from a file with compact numbering for focused review.",
			inputSchema: {
				path: z.string().min(1),
				startLine: z.number().int().min(1).default(1),
				endLine: z.number().int().min(1).optional(),
				maxLines: z.number().int().min(1).max(500).default(120),
			},
		},
		async ({ path, startLine, endLine, maxLines }) => {
			const resolvedPath = resolveWorkspacePath(path);
			const file = readWorkspaceFile(
				resolvedPath,
				startLine,
				endLine ?? null,
				maxLines,
			);
			return {
				content: [{ type: "text", text: file.text || "(empty file)" }],
				structuredContent: {
					path: relative(workspaceRoot, file.path),
					startLine: file.startLine,
					endLine: file.endLine,
					totalLines: file.totalLines,
					truncated: file.truncated,
				},
			};
		},
	);

	server.registerTool(
		"workspace_outline",
		{
			title: "Workspace Outline",
			description:
				"Return a compact structure summary of key workspace files, symbols, and document headings.",
			inputSchema: {
				cwd: z
					.string()
					.optional()
					.describe("Optional workspace-relative directory to inspect."),
				maxFiles: z.number().int().min(1).max(80).default(24),
				maxEntriesPerFile: z.number().int().min(1).max(12).default(6),
			},
		},
		async ({ cwd, maxFiles, maxEntriesPerFile }) => {
			const resolvedCwd = resolveWorkspacePath(cwd || ".");
			const outline = buildWorkspaceOutline(
				resolvedCwd,
				maxFiles,
				maxEntriesPerFile,
			);
			const text = outline.length
				? outline
						.map((item) =>
							formatOutlineEntry(item.path, {
								kind: item.kind,
								summary: item.summary,
							}),
						)
						.join("\n\n")
				: "(no outline entries)";

			return {
				content: [{ type: "text", text }],
				structuredContent: {
					cwd: resolvedCwd,
					filesScanned: outline.length,
					maxFiles,
					maxEntriesPerFile,
					items: outline,
				},
			};
		},
	);

	server.registerTool(
		"workspace_diff",
		{
			title: "Workspace Diff",
			description:
				"Return a compact summary of git workspace changes with bounded diff hunks.",
			inputSchema: {
				cwd: z
					.string()
					.optional()
					.describe("Optional workspace-relative directory to inspect."),
				includeUntracked: z.boolean().default(true),
				maxFiles: z.number().int().min(1).max(40).default(12),
				maxLinesPerFile: z.number().int().min(1).max(80).default(24),
			},
		},
		async ({ cwd, includeUntracked, maxFiles, maxLinesPerFile }) => {
			const resolvedCwd = resolveWorkspacePath(cwd || ".");
			const diff = await buildWorkspaceDiff(resolvedCwd, {
				includeUntracked,
				maxFiles,
				maxLinesPerFile,
			});

			if (!diff.supported) {
				return {
					content: [{ type: "text", text: diff.reason }],
					structuredContent: diff,
				};
			}

			const text = diff.files.length
				? diff.files
						.map((item) => {
							const header = `${item.status} ${item.path}${item.numstat ? ` (+${item.numstat.added ?? 0}/-${item.numstat.removed ?? 0})` : ""}`;
							const rename = item.oldPath ? `  from ${item.oldPath}` : "";
							const hunks = item.diffLines.length
								? item.diffLines.map((line) => `  ${line}`).join("\n")
								: "  (no diff lines)";
							return `${header}${rename}\n${hunks}`;
						})
						.join("\n\n")
				: "(no changed files)";

			return {
				content: [{ type: "text", text }],
				structuredContent: {
					...diff,
					cwd: resolvedCwd,
					includeUntracked,
					maxFiles,
					maxLinesPerFile,
				},
			};
		},
	);

	server.registerTool(
		"shadow_worktree",
		{
			title: "Shadow Worktree",
			description:
				"Inspect or create a single shadow worktree for isolated experimental changes.",
			inputSchema: {
				action: z.enum(["status", "create"]).default("status"),
				label: z
					.string()
					.optional()
					.describe(
						"Optional short label used when creating the shadow branch.",
					),
			},
		},
		async ({ action, label }) => {
			const status = await getShadowWorktreeStatus(workspaceRoot);
			if (!status.supported) {
				return {
					content: [{ type: "text", text: status.reason }],
					structuredContent: status,
				};
			}

			if (action === "status") {
				const structuredContent = {
					...status,
					recommendedPath: defaultShadowPath(status.gitRoot),
				};

				return {
					content: [
						{
							type: "text",
							text: structuredContent.hasShadow
								? `Shadow worktree already exists at ${structuredContent.secondaryWorktrees[0].path}.`
								: "No shadow worktree exists yet.",
						},
					],
					structuredContent,
				};
			}

			if (status.secondaryWorktrees.length >= 1) {
				const existing = status.secondaryWorktrees[0];
				return {
					content: [
						{
							type: "text",
							text: `Shadow worktree already exists at ${existing.path}.`,
						},
					],
					structuredContent: {
						...status,
						action: "create",
						created: false,
						path: existing.path,
						branch: existing.branch || null,
					},
				};
			}

			const baseBranch =
				status.currentBranch && status.currentBranch !== "HEAD"
					? status.currentBranch
					: "head";
			const branchName = `shadow/${sanitizeSlug(label || baseBranch)}-${timestampId()}`;
			const targetPath = defaultShadowPath(status.gitRoot);

			await gitExec(
				["worktree", "add", "-b", branchName, targetPath, "HEAD"],
				status.gitRoot,
			);
			const metadata = {
				gitRoot: status.gitRoot,
				path: targetPath,
				branch: branchName,
				createdAt: new Date().toISOString(),
			};
			writeJson(shadowMetadataPath, metadata);

			return {
				content: [
					{ type: "text", text: `Shadow worktree created at ${targetPath}.` },
				],
				structuredContent: {
					action: "create",
					created: true,
					gitRoot: status.gitRoot,
					path: targetPath,
					branch: branchName,
					metadata,
				},
			};
		},
	);

	return server;
}

function createSessionTransport() {
	const server = buildServer();
	const transport = new StreamableHTTPServerTransport({
		sessionIdGenerator: () => randomUUID(),
		onsessioninitialized: (sessionId) => {
			sessions.set(sessionId, {
				server,
				transport,
			});
			log("Session initialized", { sessionId });
		},
	});

	transport.onclose = () => {
		const sessionId = transport.sessionId;
		if (sessionId && sessions.get(sessionId)?.transport === transport) {
			sessions.delete(sessionId);
		}
		log("Transport closed", { sessionId: sessionId || null });
	};

	transport.onerror = (error) => {
		logError("Transport error", error);
	};

	return { server, transport };
}

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

function findBrowserExecutable() {
	for (const candidate of commonBrowserCandidates()) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}
	return null;
}

function commonOcrCandidates() {
	return [
		process.env.TESSERACT_PATH,
		"C:\\Program Files\\Tesseract-OCR\\tesseract.exe",
		"C:\\Program Files (x86)\\Tesseract-OCR\\tesseract.exe",
	].filter(Boolean);
}

function findTesseractExecutable() {
	for (const candidate of commonOcrCandidates()) {
		if (existsSync(candidate)) {
			return candidate;
		}
	}

	try {
		const discovered = execFileSync("where", ["tesseract"], {
			encoding: "utf8",
			windowsHide: true,
			stdio: ["ignore", "pipe", "ignore"],
		})
			.trim()
			.split(/\r?\n/)
			.find(Boolean);
		if (discovered && existsSync(discovered.trim())) {
			return discovered.trim();
		}
	} catch {
		return null;
	}

	return null;
}

async function runTesseractOcr(imagePath) {
	const tesseract = findTesseractExecutable();
	if (!tesseract) {
		return null;
	}

	try {
		const { stdout } = await execFileAsync(
			tesseract,
			[imagePath, "stdout", "--psm", "6"],
			{
				encoding: "utf8",
				windowsHide: true,
				maxBuffer: 8 * 1024 * 1024,
			},
		);

		const text = String(stdout || "").trim();
		return text || null;
	} catch (error) {
		logError("OCR failed", error);
		return null;
	}
}

async function captureDesktop(outputPath) {
	const script = `
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Windows.Forms
Add-Type -AssemblyName System.Drawing
$out = $env:SCREENSHOT_OUT
$bounds = [System.Windows.Forms.Screen]::PrimaryScreen.Bounds
$bmp = New-Object System.Drawing.Bitmap $bounds.Width, $bounds.Height
$graphics = [System.Drawing.Graphics]::FromImage($bmp)
$graphics.CopyFromScreen($bounds.Location, [System.Drawing.Point]::Empty, $bounds.Size)
$bmp.Save($out, [System.Drawing.Imaging.ImageFormat]::Png)
$graphics.Dispose()
$bmp.Dispose()
`;

	await execFileAsync(
		"powershell.exe",
		["-NoProfile", "-NonInteractive", "-Command", script],
		{
			env: { ...process.env, SCREENSHOT_OUT: outputPath },
			windowsHide: true,
		},
	);
}

async function captureUrl(url, outputPath, width, height, waitMs) {
	const browser = findBrowserExecutable();
	if (!browser) {
		throw new Error(
			"No Chromium browser executable was found for URL screenshot capture.",
		);
	}

	const consoleMessages = [];
	const pageErrors = [];
	const failedRequests = [];
	const browserInstance = await chromium.launch({
		executablePath: browser,
		headless: true,
		args: ["--allow-file-access-from-files", "--disable-gpu"],
	});

	let context;
	try {
		context = await browserInstance.newContext({
			viewport: { width, height },
		});
		const page = await context.newPage();
		page.on("console", (message) => {
			if (message.type() === "error" || message.type() === "warning") {
				consoleMessages.push(`${message.type()}: ${message.text()}`);
			}
		});
		page.on("pageerror", (error) => {
			pageErrors.push(
				error instanceof Error
					? `${error.name}: ${error.message}`
					: String(error),
			);
		});
		page.on("requestfailed", (request) => {
			const failure = request.failure()?.errorText || "request failed";
			failedRequests.push(`${request.method()} ${request.url()} -> ${failure}`);
		});
		await page.goto(url, {
			waitUntil: "domcontentloaded",
			timeout: Math.max(waitMs + 10000, 15000),
		});
		if (waitMs > 0) {
			await page.waitForTimeout(waitMs);
		}
		await page.screenshot({ path: outputPath, fullPage: true });
		return {
			mode: "url",
			path: outputPath,
			width,
			height,
			target: url,
			diagnostics: compactDiagnostics({
				consoleMessages,
				pageErrors,
				failedRequests,
			}),
		};
	} finally {
		if (context) {
			await context.close().catch(() => {});
		}
		await browserInstance.close();
	}
}

function toFileUrl(target) {
	if (target.startsWith("file://")) {
		return target;
	}
	return pathToFileURL(resolve(target)).href;
}

async function captureTarget(options) {
	const {
		target,
		width = 1600,
		height = 1200,
		waitMs = 3500,
		outputName,
	} = options;

	const outputPath = join(
		artifactsDir,
		sanitizeOutputName(
			outputName || `capture-${timestamp().replace(/[:.]/g, "-")}.png`,
		),
	);
	if (target && /^(https?:\/\/|file:\/\/)/i.test(target)) {
		try {
			return await addOcrIfPossible(
				await captureUrl(target, outputPath, width, height, waitMs),
			);
		} catch (error) {
			logError("URL capture failed, falling back to desktop", error);
			await captureDesktop(outputPath);
			return await addOcrIfPossible({
				mode: "desktop-fallback",
				path: outputPath,
				width,
				height,
				target,
				diagnostics: compactDiagnostics({
					captureError:
						error instanceof Error
							? `${error.name}: ${error.message}`
							: String(error),
				}),
			});
		}
	}

	const resolvedTarget = target ? resolve(workspaceRoot, target) : null;
	if (resolvedTarget && existsSync(resolvedTarget)) {
		const url = toFileUrl(resolvedTarget);
		try {
			return await addOcrIfPossible(
				await captureUrl(url, outputPath, width, height, waitMs),
			);
		} catch (error) {
			logError("File URL capture failed, falling back to desktop", error);
			await captureDesktop(outputPath);
			return await addOcrIfPossible({
				mode: "desktop-fallback",
				path: outputPath,
				width,
				height,
				target: url,
				diagnostics: compactDiagnostics({
					captureError:
						error instanceof Error
							? `${error.name}: ${error.message}`
							: String(error),
				}),
			});
		}
	}

	await captureDesktop(outputPath);
	const capture = { mode: "desktop", path: outputPath, width, height };
	return await addOcrIfPossible(capture);
}

async function addOcrIfPossible(capture) {
	if (!capture?.path || !/\.png$/i.test(capture.path)) {
		return capture;
	}

	const ocrText = await runTesseractOcr(capture.path);
	if (ocrText) {
		capture.ocr = {
			engine: "tesseract",
			text: ocrText.slice(0, 6000),
			truncated: ocrText.length > 6000,
		};
	}

	return capture;
}

log("MCP server initialized", {
	host,
	port,
	endpoint: `http://${host}:${port}/mcp`,
	authentication: authToken ? "bearer" : "origin-restricted",
	allowedOrigins: [...allowedOrigins],
});

const httpServer = http.createServer(async (req, res) => {
	const requestUrl = new URL(req.url || "/", `http://${host}:${port}`);

	setCorsHeaders(req, res);

	if (!isOriginAllowed(req)) {
		res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Origin not allowed");
		return;
	}

	if (req.method === "OPTIONS") {
		res.writeHead(204);
		res.end();
		return;
	}

	if (!isAuthorized(req)) {
		res.writeHead(401, {
			"Content-Type": "text/plain; charset=utf-8",
			"WWW-Authenticate": 'Bearer realm="local-mcp"',
		});
		res.end("Unauthorized");
		return;
	}

	if (requestUrl.pathname !== "/mcp") {
		res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Not found");
		return;
	}

	try {
		if (req.method === "POST") {
			const chunks = [];
			for await (const chunk of req) {
				chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
			}
			const rawBody = Buffer.concat(chunks).toString("utf8");
			const parsedBody = rawBody.trim() ? JSON.parse(rawBody) : undefined;
			const sessionId = req.headers["mcp-session-id"] || null;
			const initialize = isInitializeRequest(parsedBody);
			log("POST /mcp", { sessionId, initialize });

			const session = sessionId ? sessions.get(String(sessionId)) : undefined;
			let transport = session?.transport;
			if (!transport && initialize) {
				const created = createSessionTransport();
				transport = created.transport;
				await created.server.connect(transport);
				await transport.handleRequest(req, res, parsedBody);
				return;
			}

			if (!transport) {
				res.writeHead(400, {
					"Content-Type": "application/json; charset=utf-8",
				});
				res.end(
					JSON.stringify({
						jsonrpc: "2.0",
						error: {
							code: -32000,
							message: "Bad Request: No valid session ID provided",
						},
						id: null,
					}),
				);
				return;
			}

			await transport.handleRequest(req, res, parsedBody);
			return;
		}

		if (req.method === "GET" || req.method === "DELETE") {
			const sessionId = req.headers["mcp-session-id"]
				? String(req.headers["mcp-session-id"])
				: null;
			log(`${req.method} /mcp`, { sessionId });

			if (!sessionId || !sessions.has(sessionId)) {
				res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
				res.end("Invalid or missing session ID");
				return;
			}

			const transport = sessions.get(sessionId).transport;
			await transport.handleRequest(req, res);
			if (req.method === "DELETE") {
				sessions.delete(sessionId);
			}
			return;
		}

		res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
		res.end("Method not allowed");
	} catch (error) {
		logError("Request failed", error);
		if (!res.headersSent) {
			res.writeHead(500, { "Content-Type": "application/json; charset=utf-8" });
			res.end(JSON.stringify({ error: "Internal server error" }));
		}
	}
});

httpServer.listen(port, host, () => {
	log("Bridge HTTP listener active", {
		endpoint: `http://${host}:${port}/mcp`,
	});
});

process.on("uncaughtException", (error) => {
	logError("Uncaught exception", error);
	process.exit(1);
});

process.on("unhandledRejection", (reason) => {
	logError("Unhandled rejection", reason);
	process.exit(1);
});

process.on("SIGINT", async () => {
	log("SIGINT received, shutting down");
	try {
		for (const { transport } of sessions.values()) {
			try {
				await transport.close();
			} catch (error) {
				logError("Transport close failed during shutdown", error);
			}
		}
	} catch (error) {
		logError("Shutdown transport loop failed", error);
	}
	sessions.clear();
	httpServer.close(() => {
		log("Bridge stopped");
		process.exit(0);
	});
});
