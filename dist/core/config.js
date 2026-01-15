/**
 * Configuration loader and validator
 */
import { readFileSync, existsSync } from 'fs';
import { parse } from 'yaml';
import Ajv from 'ajv';
import { join, resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ajv = new Ajv({ allErrors: true });
export class ConfigLoader {
    config = null;
    configPath;
    schemaPath;
    constructor(configPath = join(process.cwd(), 'config', 'default.yaml'), schemaPath = join(process.cwd(), 'config', 'schemas', 'config.schema.json')) {
        this.configPath = resolve(configPath);
        this.schemaPath = resolve(schemaPath);
    }
    /**
     * Load and validate configuration
     */
    load() {
        if (this.config) {
            return this.config;
        }
        // Check if config file exists
        if (!existsSync(this.configPath)) {
            throw new Error(`Configuration file not found: ${this.configPath}`);
        }
        // Read and parse YAML
        const configContent = readFileSync(this.configPath, 'utf-8');
        const config = parse(configContent);
        // Validate against schema
        if (existsSync(this.schemaPath)) {
            const schema = JSON.parse(readFileSync(this.schemaPath, 'utf-8'));
            const validate = ajv.compile(schema);
            const valid = validate(config);
            if (!valid) {
                const errors = validate.errors?.map(err => `${err.instancePath} ${err.message}`).join(', ');
                throw new Error(`Invalid configuration: ${errors}`);
            }
        }
        // Note: We don't validate API key here, only when actually needed
        // This allows commands like 'list' and 'validate' to work without API key
        this.config = config;
        return config;
    }
    /**
     * Get a configuration value by path
     */
    get(path) {
        const config = this.load();
        const parts = path.split('.');
        let current = config;
        for (const part of parts) {
            if (current && typeof current === 'object' && part in current) {
                current = current[part];
            }
            else {
                return undefined;
            }
        }
        return current;
    }
    /**
     * Set a configuration value by path (in-memory only)
     */
    set(path, value) {
        const config = this.load();
        const parts = path.split('.');
        const lastPart = parts.pop();
        if (!lastPart) {
            throw new Error('Invalid path');
        }
        let current = config;
        for (const part of parts) {
            if (!(part in current)) {
                current[part] = {};
            }
            current = current[part];
        }
        current[lastPart] = value;
    }
    /**
     * Get the full configuration object
     */
    getAll() {
        return this.load();
    }
    /**
     * Reload configuration from disk
     */
    reload() {
        this.config = null;
        return this.load();
    }
    /**
     * Get API key from environment
     */
    getApiKey() {
        const config = this.load();
        const apiKey = process.env[config.llm.api_key_env];
        if (!apiKey) {
            throw new Error(`API key not found in environment variable: ${config.llm.api_key_env}`);
        }
        return apiKey;
    }
}
// Singleton instance
let configLoader = null;
export function getConfig() {
    if (!configLoader) {
        // Try to find config in current directory or parent directories
        const possiblePaths = [
            join(process.cwd(), 'config', 'default.yaml'),
            join(__dirname, '../../config/default.yaml'),
            join(__dirname, '../../../config/default.yaml'),
        ];
        let configPath = possiblePaths[0];
        for (const path of possiblePaths) {
            if (existsSync(path)) {
                configPath = path;
                break;
            }
        }
        configLoader = new ConfigLoader(configPath);
    }
    return configLoader;
}
//# sourceMappingURL=config.js.map