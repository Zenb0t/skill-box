/**
 * Methodology Loader - Load and parse skill definitions from markdown files
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve, extname } from 'path';
import { parse as parseYaml } from 'yaml';
import Ajv from 'ajv';
import type { SkillDefinition, ValidationResult, ValidationError, ValidationWarning } from './types.js';

const ajv = new Ajv({ allErrors: true });

export class MethodologyLoader {
  private methodologyDir: string;
  private schemaPath: string;
  private cache: Map<string, SkillDefinition> = new Map();

  constructor(
    methodologyDir: string = join(process.cwd(), 'methodology'),
    schemaPath: string = join(process.cwd(), 'methodology', 'schemas', 'skill-definition.schema.json')
  ) {
    this.methodologyDir = resolve(methodologyDir);
    this.schemaPath = resolve(schemaPath);
  }

  /**
   * Load a skill definition by name
   */
  async load(skillName: string): Promise<SkillDefinition> {
    // Check cache
    if (this.cache.has(skillName)) {
      return this.cache.get(skillName)!;
    }

    const filePath = join(this.methodologyDir, `${skillName}.md`);

    if (!existsSync(filePath)) {
      throw new Error(`Skill definition not found: ${skillName}`);
    }

    try {
      const content = readFileSync(filePath, 'utf-8');
      const skill = this.parseSkillFile(content, skillName);

      // Validate
      const validation = await this.validate(skill);
      if (!validation.valid) {
        const errors = validation.errors.map(e => `${e.path}: ${e.message}`).join(', ');
        throw new Error(`Invalid skill definition for ${skillName}: ${errors}`);
      }

      // Cache and return
      this.cache.set(skillName, skill);
      return skill;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Failed to load skill ${skillName}: ${error.message}`);
      }
      throw error;
    }
  }

  /**
   * Parse a skill markdown file with YAML frontmatter
   */
  private parseSkillFile(content: string, skillName: string): SkillDefinition {
    // Extract frontmatter
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);

    if (!frontmatterMatch) {
      throw new Error('Invalid skill file format: missing YAML frontmatter');
    }

    const [, frontmatter, methodology] = frontmatterMatch;

    // Parse YAML
    const metadata = parseYaml(frontmatter) as Partial<SkillDefinition>;

    // Construct skill definition
    const skill: SkillDefinition = {
      name: metadata.name || skillName,
      description: metadata.description || '',
      inputs: metadata.inputs || [],
      outputs: metadata.outputs || { format: 'text' },
      tools: metadata.tools || [],
      methodology: methodology.trim(),
      version: metadata.version,
      author: metadata.author,
      examples: metadata.examples,
    };

    return skill;
  }

  /**
   * List all available skills
   */
  async list(): Promise<string[]> {
    if (!existsSync(this.methodologyDir)) {
      return [];
    }

    const files = readdirSync(this.methodologyDir);

    return files
      .filter(file => extname(file) === '.md')
      .map(file => file.replace('.md', ''))
      .filter(name => name !== 'README'); // Skip README files
  }

  /**
   * Validate a skill definition
   */
  async validate(skill: SkillDefinition | string): Promise<ValidationResult> {
    const errors: ValidationError[] = [];
    const warnings: ValidationWarning[] = [];

    // If string, load the skill first
    let skillDef: SkillDefinition;
    if (typeof skill === 'string') {
      try {
        skillDef = await this.load(skill);
      } catch (error) {
        return {
          valid: false,
          errors: [{
            path: 'skill',
            message: error instanceof Error ? error.message : 'Failed to load skill',
          }],
          warnings: [],
        };
      }
    } else {
      skillDef = skill;
    }

    // Validate against JSON schema if available
    if (existsSync(this.schemaPath)) {
      const schema = JSON.parse(readFileSync(this.schemaPath, 'utf-8'));
      const validate = ajv.compile(schema);
      const valid = validate(skillDef);

      if (!valid && validate.errors) {
        for (const error of validate.errors) {
          errors.push({
            path: error.instancePath || 'root',
            message: error.message || 'Validation error',
            value: error.data,
          });
        }
      }
    }

    // Additional custom validations
    // Check that required inputs are marked as required
    const requiredInputs = skillDef.inputs.filter(i => i.required);
    if (requiredInputs.length === 0) {
      warnings.push({
        path: 'inputs',
        message: 'No required inputs defined',
        suggestion: 'Consider marking at least one input as required',
      });
    }

    // Check that methodology is not empty
    if (!skillDef.methodology || skillDef.methodology.trim().length === 0) {
      errors.push({
        path: 'methodology',
        message: 'Methodology content is empty',
      });
    }

    // Check that tools are valid
    const validTools = [
      'read_file', 'write_file', 'list_directory', 'find_files',
      'git_diff', 'git_log', 'git_status', 'run_command'
    ];

    const invalidTools = skillDef.tools.filter(t => !validTools.includes(t));
    if (invalidTools.length > 0) {
      errors.push({
        path: 'tools',
        message: `Invalid tool names: ${invalidTools.join(', ')}`,
      });
    }

    // Check methodology length
    if (skillDef.methodology.length > 50000) {
      warnings.push({
        path: 'methodology',
        message: 'Methodology is very long',
        suggestion: 'Consider splitting into multiple skills or using references',
      });
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  /**
   * Get the full skill definition including metadata
   */
  async getDefinition(skillName: string): Promise<SkillDefinition> {
    return this.load(skillName);
  }

  /**
   * Clear cache (useful for development/testing)
   */
  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Check if a skill exists
   */
  async exists(skillName: string): Promise<boolean> {
    const skills = await this.list();
    return skills.includes(skillName);
  }

  /**
   * Reload a skill from disk (bypass cache)
   */
  async reload(skillName: string): Promise<SkillDefinition> {
    this.cache.delete(skillName);
    return this.load(skillName);
  }
}

// Singleton instance
let loader: MethodologyLoader | null = null;

export function getMethodologyLoader(): MethodologyLoader {
  if (!loader) {
    loader = new MethodologyLoader();
  }
  return loader;
}
