import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFileSync, unlinkSync } from 'fs';
import { join } from 'path';
import { tmpdir } from 'os';
import { randomBytes } from 'crypto';

const execAsync = promisify(exec);

const server = new Server(
  {
    name: 'badugi-cli-mcp',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'run_badugi_simulation',
        description: 'Runs the Badugi simulation CLI with the given strategy configuration.',
        inputSchema: {
          type: 'object',
          properties: {
            strategyJson: {
              type: 'string',
              description: 'The JSON string of the strategy configuration to run.',
            },
            iterations: {
              type: 'number',
              description: 'The number of iterations to run (optional, defaults to 10000).',
            },
          },
          required: ['strategyJson'],
        },
      },
    ],
  };
});

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name !== 'run_badugi_simulation') {
    throw new McpError(
      ErrorCode.MethodNotFound,
      `Unknown tool: ${request.params.name}`
    );
  }

  const { strategyJson, iterations } = request.params.arguments as any;

  if (typeof strategyJson !== 'string') {
    throw new McpError(ErrorCode.InvalidParams, 'strategyJson must be a string');
  }

  const tmpFile = join(tmpdir(), `badugi-strategy-${randomBytes(4).toString('hex')}.json`);
  writeFileSync(tmpFile, strategyJson, 'utf8');

  try {
    const cmdArgs = [tmpFile];
    if (iterations !== undefined) {
      cmdArgs.push(iterations.toString());
    }

    const { stdout, stderr } = await execAsync(`npx tsx src/cli/index.ts ${cmdArgs.join(' ')}`);

    return {
      content: [
        {
          type: 'text',
          text: `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`,
        },
      ],
    };
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: `Error executing simulation: ${error.message}\n\nSTDOUT:\n${error.stdout}\n\nSTDERR:\n${error.stderr}`,
        },
      ],
      isError: true,
    };
  } finally {
    try {
      unlinkSync(tmpFile);
    } catch (e) {
      // ignore unlink errors
    }
  }
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('Badugi CLI MCP server running on stdio');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
