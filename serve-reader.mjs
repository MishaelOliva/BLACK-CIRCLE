import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const host = "127.0.0.1";
const port = Number(process.env.BLACK_CIRCLE_READER_PORT || 4174);

const contentTypes = {
	".css": "text/css; charset=utf-8",
	".gif": "image/gif",
	".html": "text/html; charset=utf-8",
	".jpg": "image/jpeg",
	".jpeg": "image/jpeg",
	".js": "text/javascript; charset=utf-8",
	".json": "application/json; charset=utf-8",
	".mjs": "text/javascript; charset=utf-8",
	".png": "image/png",
	".svg": "image/svg+xml; charset=utf-8",
	".txt": "text/plain; charset=utf-8",
	".webp": "image/webp",
	".woff": "font/woff",
	".woff2": "font/woff2",
	".ttf": "font/ttf",
};

const securityHeaders = {
	"Content-Security-Policy":
		"default-src 'self'; base-uri 'none'; connect-src 'self'; font-src 'self' data: https://fonts.gstatic.com; frame-ancestors 'none'; img-src 'self' data: blob:; object-src 'none'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
	"Cross-Origin-Resource-Policy": "same-origin",
	"Permissions-Policy": "camera=(), geolocation=(), microphone=()",
	"Referrer-Policy": "no-referrer",
	"X-Content-Type-Options": "nosniff",
	"X-Frame-Options": "DENY",
};

function resolveRequestPath(urlPath) {
	let decoded;
	try {
		decoded = decodeURIComponent(urlPath.split("?")[0] || "/");
	} catch {
		return { filePath: "", status: 400 };
	}
	if (decoded.includes("\0")) {
		return { filePath: "", status: 400 };
	}
	const requested = decoded === "/" ? "/index.html" : decoded;
	const absolute = path.resolve(root, `.${requested}`);
	const relative = path.relative(root, absolute);
	if (
		relative !== "" &&
		(relative.startsWith("..") || path.isAbsolute(relative))
	) {
		return { filePath: "", status: 403 };
	}

	const publicPath = relative.replaceAll("\\", "/");
	if (publicPath !== "index.html" && !publicPath.startsWith("assets/")) {
		return { filePath: "", status: 404 };
	}

	return { filePath: absolute, status: 200 };
}

const server = http.createServer((request, response) => {
	if (!["GET", "HEAD"].includes(request.method || "")) {
		response.writeHead(405, {
			...securityHeaders,
			Allow: "GET, HEAD",
			"Content-Type": "text/plain; charset=utf-8",
		});
		response.end("Method not allowed");
		return;
	}

	const resolved = resolveRequestPath(request.url || "/");
	if (!resolved.filePath) {
		const messages = { 400: "Bad request", 403: "Forbidden", 404: "Not found" };
		response.writeHead(resolved.status, {
			...securityHeaders,
			"Content-Type": "text/plain; charset=utf-8",
		});
		response.end(messages[resolved.status] || "Request failed");
		return;
	}

	fs.readFile(resolved.filePath, (error, content) => {
		if (error) {
			response.writeHead(error.code === "ENOENT" ? 404 : 500, {
				...securityHeaders,
				"Content-Type": "text/plain; charset=utf-8",
			});
			response.end(error.code === "ENOENT" ? "Not found" : "Server error");
			return;
		}

		const type =
			contentTypes[path.extname(resolved.filePath).toLowerCase()] ||
			"application/octet-stream";
		response.writeHead(200, {
			...securityHeaders,
			"Cache-Control": "no-cache",
			"Content-Length": content.byteLength,
			"Content-Type": type,
		});
		response.end(request.method === "HEAD" ? undefined : content);
	});
});

server.on("error", (error) => {
	if (error.code === "EADDRINUSE") {
		console.log(
			`Black Circle reader is already running at http://${host}:${port}/index.html`,
		);
		return;
	}
	throw error;
});

server.listen(port, host, () => {
	console.log(
		`Black Circle reader running at http://${host}:${port}/index.html`,
	);
});
