/**
 * Tool Registry - Central registry for all available tools
 */
import type { Tool, ToolDefinition } from '../core/types.js';
export declare class ToolRegistry {
    private tools;
    /**
     * Register a tool
     */
    register(tool: Tool): void;
    /**
     * Register multiple tools
     */
    registerMany(tools: Tool[]): void;
    /**
     * Get a tool by name
     */
    get(name: string): Tool | undefined;
    /**
     * List all registered tools
     */
    list(): Tool[];
    /**
     * Get tools allowed for a specific skill
     */
    forSkill(allowedTools: string[]): Tool[];
    /**
     * Check if a tool exists
     */
    has(name: string): boolean;
    /**
     * Convert tools to LLM tool definitions
     */
    toToolDefinitions(tools: Tool[]): ToolDefinition[];
    /**
     * Clear all tools (useful for testing)
     */
    clear(): void;
}
export declare function getToolRegistry(): ToolRegistry;
//# sourceMappingURL=index.d.ts.map