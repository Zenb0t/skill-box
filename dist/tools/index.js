/**
 * Tool Registry - Central registry for all available tools
 */
export class ToolRegistry {
    tools = new Map();
    /**
     * Register a tool
     */
    register(tool) {
        if (this.tools.has(tool.name)) {
            throw new Error(`Tool already registered: ${tool.name}`);
        }
        this.tools.set(tool.name, tool);
    }
    /**
     * Register multiple tools
     */
    registerMany(tools) {
        for (const tool of tools) {
            this.register(tool);
        }
    }
    /**
     * Get a tool by name
     */
    get(name) {
        return this.tools.get(name);
    }
    /**
     * List all registered tools
     */
    list() {
        return Array.from(this.tools.values());
    }
    /**
     * Get tools allowed for a specific skill
     */
    forSkill(allowedTools) {
        return allowedTools
            .map(name => this.tools.get(name))
            .filter((tool) => tool !== undefined);
    }
    /**
     * Check if a tool exists
     */
    has(name) {
        return this.tools.has(name);
    }
    /**
     * Convert tools to LLM tool definitions
     */
    toToolDefinitions(tools) {
        return tools.map(tool => ({
            name: tool.name,
            description: tool.description,
            input_schema: {
                type: 'object',
                properties: tool.parameters.reduce((acc, param) => {
                    acc[param.name] = {
                        type: param.type,
                        description: param.description,
                        ...(param.default !== undefined && { default: param.default }),
                    };
                    return acc;
                }, {}),
                required: tool.parameters
                    .filter(p => p.required)
                    .map(p => p.name),
            },
        }));
    }
    /**
     * Clear all tools (useful for testing)
     */
    clear() {
        this.tools.clear();
    }
}
// Singleton instance
let registry = null;
export function getToolRegistry() {
    if (!registry) {
        registry = new ToolRegistry();
    }
    return registry;
}
//# sourceMappingURL=index.js.map