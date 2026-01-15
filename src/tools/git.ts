/**
 * Git tools - git diff, git log, git status
 */

import { execSync } from 'child_process';
import type { Tool, ToolExecutionContext, ToolResult } from '../core/types.js';

/**
 * Execute a git command safely
 */
function executeGit(
  args: string[],
  context: ToolExecutionContext
): { stdout: string; stderr: string } {
  try {
    const stdout = execSync(`git ${args.join(' ')}`, {
      cwd: context.workingDirectory,
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'pipe'],
    });

    return { stdout, stderr: '' };
  } catch (error: any) {
    return {
      stdout: error.stdout || '',
      stderr: error.stderr || error.message || 'Unknown git error',
    };
  }
}

/**
 * Git diff tool
 */
export const gitDiffTool: Tool = {
  name: 'git_diff',
  description: 'Show git diff for files',
  parameters: [
    {
      name: 'path',
      type: 'string',
      description: 'Path or file to diff (optional, defaults to all files)',
      required: false,
    },
    {
      name: 'staged',
      type: 'boolean',
      description: 'Show staged changes only',
      required: false,
      default: false,
    },
    {
      name: 'commit',
      type: 'string',
      description: 'Compare with specific commit',
      required: false,
    },
  ],
  async execute(params: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
    const startTime = Date.now();
    const path = params.path as string | undefined;
    const staged = params.staged as boolean;
    const commit = params.commit as string | undefined;

    try {
      const args = ['diff'];

      if (staged) {
        args.push('--staged');
      }

      if (commit) {
        args.push(commit);
      }

      if (path) {
        args.push('--', path);
      }

      const { stdout, stderr } = executeGit(args, context);

      if (stderr) {
        return {
          success: false,
          output: null,
          metadata: { duration: Date.now() - startTime },
          error: new Error(stderr),
        };
      }

      return {
        success: true,
        output: stdout || 'No changes',
        metadata: { duration: Date.now() - startTime },
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        metadata: { duration: Date.now() - startTime },
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};

/**
 * Git log tool
 */
export const gitLogTool: Tool = {
  name: 'git_log',
  description: 'Show git commit history',
  parameters: [
    {
      name: 'limit',
      type: 'number',
      description: 'Maximum number of commits to show',
      required: false,
      default: 10,
    },
    {
      name: 'path',
      type: 'string',
      description: 'Show log for specific file or directory',
      required: false,
    },
    {
      name: 'oneline',
      type: 'boolean',
      description: 'Show one line per commit',
      required: false,
      default: false,
    },
  ],
  async execute(params: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
    const startTime = Date.now();
    const limit = params.limit as number || 10;
    const path = params.path as string | undefined;
    const oneline = params.oneline as boolean;

    try {
      const args = ['log', `-n${limit}`];

      if (oneline) {
        args.push('--oneline');
      } else {
        args.push('--pretty=format:%H%n%an <%ae>%n%cd%n%s%n%b%n---');
      }

      if (path) {
        args.push('--', path);
      }

      const { stdout, stderr } = executeGit(args, context);

      if (stderr) {
        return {
          success: false,
          output: null,
          metadata: { duration: Date.now() - startTime },
          error: new Error(stderr),
        };
      }

      return {
        success: true,
        output: stdout || 'No commits found',
        metadata: { duration: Date.now() - startTime },
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        metadata: { duration: Date.now() - startTime },
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};

/**
 * Git status tool
 */
export const gitStatusTool: Tool = {
  name: 'git_status',
  description: 'Show git working tree status',
  parameters: [
    {
      name: 'short',
      type: 'boolean',
      description: 'Show short format',
      required: false,
      default: true,
    },
  ],
  async execute(params: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult> {
    const startTime = Date.now();
    const short = params.short as boolean;

    try {
      const args = ['status'];

      if (short) {
        args.push('--short');
      }

      const { stdout, stderr } = executeGit(args, context);

      if (stderr) {
        return {
          success: false,
          output: null,
          metadata: { duration: Date.now() - startTime },
          error: new Error(stderr),
        };
      }

      return {
        success: true,
        output: stdout || 'Working tree clean',
        metadata: { duration: Date.now() - startTime },
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        metadata: { duration: Date.now() - startTime },
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  },
};

// Export all git tools
export const gitTools: Tool[] = [
  gitDiffTool,
  gitLogTool,
  gitStatusTool,
];
