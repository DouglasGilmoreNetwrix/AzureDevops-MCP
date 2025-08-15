#!/usr/bin/env node
import { MCPServer } from "@modelcontextprotocol/sdk";
import fetch from "node-fetch";

// Load config from env
const org = "NetwrixCorporation"; //process.env.AZURE_DEVOPS_ORG;
const pat = ""; //process.env.AZURE_DEVOPS_PAT;
const baseUrl = `https://dev.azure.com/${org}`;
const authHeader = "Basic " + Buffer.from(`:${pat}`).toString("base64");

// MCP server instance
const server = new MCPServer({
  name: "azure-devops-mcp",
  version: "0.0.1"
});

// Example MCP tool: list projects
server.tool("list_projects", {
  description: "List all Azure DevOps projects",
  async handler() {
    const res = await fetch(`${baseUrl}/_apis/projects?api-version=7.1-preview.4`, {
      headers: { Authorization: authHeader }
    });

    if (!res.ok) {
      throw new Error(`Azure DevOps API error: ${res.statusText}`);
    }

    const data = await res.json();
    return data.value.map(p => ({ id: p.id, name: p.name }));
  }
});

// Start the server
server.listen();
