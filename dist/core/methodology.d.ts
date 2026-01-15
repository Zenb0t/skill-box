/**
 * Methodology Loader - Load and parse skill definitions from markdown files
 */
import type { SkillDefinition, ValidationResult } from './types.js';
export declare class MethodologyLoader {
    private methodologyDir;
    private schemaPath;
    private cache;
    constructor(methodologyDir?: string, schemaPath?: string);
    /**
     * Load a skill definition by name
     */
    load(skillName: string): Promise<SkillDefinition>;
    /**
     * Parse a skill markdown file with YAML frontmatter
     */
    private parseSkillFile;
    /**
     * List all available skills
     */
    list(): Promise<string[]>;
    /**
     * Validate a skill definition
     */
    validate(skill: SkillDefinition | string): Promise<ValidationResult>;
    /**
     * Get the full skill definition including metadata
     */
    getDefinition(skillName: string): Promise<SkillDefinition>;
    /**
     * Clear cache (useful for development/testing)
     */
    clearCache(): void;
    /**
     * Check if a skill exists
     */
    exists(skillName: string): Promise<boolean>;
    /**
     * Reload a skill from disk (bypass cache)
     */
    reload(skillName: string): Promise<SkillDefinition>;
}
export declare function getMethodologyLoader(): MethodologyLoader;
//# sourceMappingURL=methodology.d.ts.map