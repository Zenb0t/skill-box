/**
 * Tool setup - Register all available tools
 */

import { getToolRegistry } from './index.js';
import { filesystemTools } from './filesystem.js';
import { gitTools } from './git.js';
import { shellTools } from './shell.js';

/**
 * Initialize and register all tools
 */
export function setupTools(): void {
  const registry = getToolRegistry();

  // Clear any existing tools (useful for testing)
  registry.clear();

  // Register all tool categories
  registry.registerMany([
    ...filesystemTools,
    ...gitTools,
    ...shellTools,
  ]);
}

/**
 * Get tools allowed for a skill by name
 */
export function getToolsForSkill(toolNames: string[]) {
  const registry = getToolRegistry();
  return registry.forSkill(toolNames);
}

/**
 * Validate that all tool names in a skill definition exist
 */
export function validateToolNames(toolNames: string[]): { valid: boolean; missing: string[] } {
  const registry = getToolRegistry();
  const missing: string[] = [];

  for (const name of toolNames) {
    if (!registry.has(name)) {
      missing.push(name);
    }
  }

  return {
    valid: missing.length === 0,
    missing,
  };
}
