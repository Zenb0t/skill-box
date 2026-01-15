/**
 * Tool setup - Register all available tools
 */
/**
 * Initialize and register all tools
 */
export declare function setupTools(): void;
/**
 * Get tools allowed for a skill by name
 */
export declare function getToolsForSkill(toolNames: string[]): import("../index.js").Tool[];
/**
 * Validate that all tool names in a skill definition exist
 */
export declare function validateToolNames(toolNames: string[]): {
    valid: boolean;
    missing: string[];
};
//# sourceMappingURL=setup.d.ts.map