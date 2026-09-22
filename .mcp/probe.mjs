import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StreamableHTTPClientTransport } from "@modelcontextprotocol/sdk/client/streamableHttp.js";

const endpoint = new URL(
	process.env.MCP_BRIDGE_URL ||
		`http://${process.env.MCP_HOST || "127.0.0.1"}:${process.env.MCP_PORT || 7331}/mcp`,
);
const authToken = (process.env.MCP_AUTH_TOKEN || "").trim();
const client = new Client({ name: "protocols-probe", version: "0.1.0" });
const transport = new StreamableHTTPClientTransport(endpoint, {
	requestInit: authToken
		? { headers: { Authorization: `Bearer ${authToken}` } }
		: undefined,
});

try {
	await client.connect(transport);
	const tools = await client.listTools();
	console.log(
		JSON.stringify(
			{
				endpoint: endpoint.href,
				sessionId: transport.sessionId || null,
				tools: tools.tools.map((tool) => ({
					name: tool.name,
					title: tool.title || null,
					description: tool.description || null,
				})),
			},
			null,
			2,
		),
	);
} finally {
	await transport.close();
}
