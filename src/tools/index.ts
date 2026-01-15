/**
 * Tool Registry - Central registry for all available tools
 */

import type { Tool, ToolDefinition } from '../core/types.js';

export class ToolRegistry {
  private tools: Map<string, Tool> = new Map();

  /**
   * Register a tool
   */
  register(tool: Tool): void {
    if (this.tools.has(tool.name)) {
      throw new Error(`Tool already registered: ${tool.name}`);
    }
    this.tools.set(tool.name, tool);
  }

  /**
   * Register multiple tools
   */
  registerMany(tools: Tool[]): void {
    for (const tool of tools) {
      this.register(tool);
    }
  }

  /**
   * Get a tool by name
   */
  get(name: string): Tool | undefined {
    return this.tools.get(name);
  }

  /**
   * List all registered tools
   */
  list(): Tool[] {
    return Array.from(this.tools.values());
  }

  /**
   * Get tools allowed for a specific skill
   */
  forSkill(allowedTools: string[]): Tool[] {
    return allowedTools
      .map(name => this.tools.get(name))
      .filter((tool): tool is Tool => tool !== undefined);
  }

  /**
   * Check if a tool exists
   */
  has(name: string): boolean {
    return this.tools.has(name);
  }

  /**
   * Convert tools to LLM tool definitions
   */
  toToolDefinitions(tools: Tool[]): ToolDefinition[] {
    return tools.map(tool => ({
      name: tool.name,
      description: tool.description,
      input_schema: {
        type: 'object' as const,
        properties: tool.parameters.reduce((acc, param) => {
          acc[param.name] = {
            type: param.type,
            description: param.description,
            ...(param.default !== undefined && { default: param.default }),
          };
          return acc;
        }, {} as Record<string, unknown>),
        required: tool.parameters
          .filter(p => p.required)
          .map(p => p.name),
      },
    }));
  }

  /**
   * Clear all tools (useful for testing)
   */
  clear(): void {
    this.tools.clear();
  }
}

// Singleton instance
let registry: ToolRegistry | null = null;

export function getToolRegistry(): ToolRegistry {
  if (!registry) {
    registry = new ToolRegistry();
  }
  return registry;
}
