/**
 * Shell tool - Execute shell commands with safety checks
 */

import { execSync } from 'child_process';
import type { Tool, ToolExecutionContext, ToolResult } from '../core/types.js';
import { getConfig } from '../core/config.js';

/**
 * Check if a command is allowed based on configuration
 */
function isCommandAllowed(command: string): boolean {
  const config = getConfig().getAll();
  const allowedCommands = config.tools.shell.allowed_commands;

  // Extract the base command (first word)
  const baseCommand = command.trim().split(/\s+/)[0];

  return allowedCommands.includes(baseCommand);
}

/**
 * Run shell command tool
 */
export const runCommandTool: Tool = {
  name: 'run_command',
  description: 'Execute a shell command',
  parameters: [
    {
      name: 'command',
      type: 'string',
      description: 'The command to execute',
      required: true,
    },
    {
      name: 'cwd',
      type: 'string',
      description: 'Working directory for the command',
      required: false,
    },
  ],
  async execute(params: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
    const startTime = Date.now();
    const command = params.command as string;
    const cwd = params.cwd as string | undefined;

    try {
      const config = getConfig().getAll();

      // Check if shell tools are enabled
      if (!config.tools.shell.enabled) {
        return {
          success: false,
          output: null,
          metadata: { duration: Date.now() - startTime },
          error: new Error('Shell commands are disabled in configuration'),
        };
      }

      // Check if command is allowed
      if (!isCommandAllowed(command)) {
        const allowedCommands = config.tools.shell.allowed_commands.join(', ');
        return {
          success: false,
          output: null,
          metadata: { duration: Date.now() - startTime },
          error: new Error(
            `Command not allowed. Allowed commands: ${allowedCommands}`
          ),
        };
      }

      // In dry run mode, just return what would be executed
      if (context.dryRun) {
        return {
          success: true,
          output: `[DRY RUN] Would execute: ${command}`,
          metadata: { duration: Date.now() - startTime },
        };
      }

      // Execute the command
      const workingDir = cwd || context.workingDirectory;
      const timeout = config.tools.shell.timeout;

      const output = execSync(command, {
        cwd: workingDir,
        encoding: 'utf-8',
        timeout,
        stdio: ['pipe', 'pipe', 'pipe'],
      });

      return {
        success: true,
        output,
        metadata: { duration: Date.now() - startTime },
      };
    } catch (error: any) {
      return {
        success: false,
        output: error.stdout || null,
        metadata: { duration: Date.now() - startTime },
        error: new Error(error.stderr || error.message || 'Command execution failed'),
      };
    }
  },
};

// Export shell tools
export const shellTools: Tool[] = [
  runCommandTool,
];
