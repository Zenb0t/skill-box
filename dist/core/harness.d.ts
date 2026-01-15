/**
 * Skill Harness - Main orchestration logic
 */
import type { SkillInput, SkillOutput } from './types.js';
export declare class Harness {
    private methodologyLoader;
    private workingDirectory;
    constructor(workingDirectory?: string);
    /**
     * Invoke a skill
     */
    invoke(skillName: string, input: SkillInput): Promise<SkillOutput>;
    /**
     * Build system prompt from skill definition and context
     */
    private buildSystemPrompt;
    /**
     * Build user message from input
     */
    private buildUserMessage;
    /**
     * Execute a tool call
     */
    private executeToolCall;
    /**
     * Parse LLM output based on skill output format
     */
    private parseOutput;
    /**
     * List available skills
     */
    listSkills(): Promise<string[]>;
    /**
     * Get skill definition
     */
    getSkillDefinition(skillName: string): Promise<import("./types.js").SkillDefinition>;
    /**
     * Validate a skill
     */
    validateSkill(skillName: string): Promise<import("./types.js").ValidationResult>;
}
//# sourceMappingURL=harness.d.ts.map