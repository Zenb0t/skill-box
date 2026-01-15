/**
 * Skill Harness - Main exports
 */

// Core
export { Harness } from './core/harness.js';
export { LLMClient } from './core/llm.js';
export { ContextGatherer } from './core/context.js';
export { MethodologyLoader, getMethodologyLoader } from './core/methodology.js';
export { ConfigLoader, getConfig } from './core/config.js';

// Tools
export { ToolRegistry, getToolRegistry } from './tools/index.js';
export { setupTools, getToolsForSkill, validateToolNames } from './tools/setup.js';
export { filesystemTools } from './tools/filesystem.js';
export { gitTools } from './tools/git.js';
export { shellTools } from './tools/shell.js';

// Types
export type {
  Config,
  SkillDefinition,
  SkillInput,
  SkillOutput,
  Tool,
  ToolResult,
  ProjectContext,
  LLMRequest,
  LLMResponse,
  ValidationResult,
} from './core/types.js';
