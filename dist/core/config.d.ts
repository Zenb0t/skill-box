/**
 * Configuration loader and validator
 */
import type { Config } from './types.js';
export declare class ConfigLoader {
    private config;
    private configPath;
    private schemaPath;
    constructor(configPath?: string, schemaPath?: string);
    /**
     * Load and validate configuration
     */
    load(): Config;
    /**
     * Get a configuration value by path
     */
    get<T = unknown>(path: string): T | undefined;
    /**
     * Set a configuration value by path (in-memory only)
     */
    set(path: string, value: unknown): void;
    /**
     * Get the full configuration object
     */
    getAll(): Config;
    /**
     * Reload configuration from disk
     */
    reload(): Config;
    /**
     * Get API key from environment
     */
    getApiKey(): string;
}
export declare function getConfig(): ConfigLoader;
//# sourceMappingURL=config.d.ts.map