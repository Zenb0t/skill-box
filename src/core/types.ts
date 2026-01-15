/**
 * Core type definitions for the Skill Harness
 */

// ============================================================================
// Configuration Types
// ============================================================================

export interface Config {
  llm: LLMConfig;
  context: ContextConfig;
  tools: ToolsConfig;
  output: OutputConfig;
  session: SessionConfig;
}

export interface LLMConfig {
  provider: 'anthropic';
  model: string;
  api_key_env: string;
  max_tokens: number;
  temperature?: number;
}

export interface ContextConfig {
  default_paths: string[];
  max_file_size: number;
  max_total_context: number;
  prioritization?: ContextPrioritization[];
  cache?: CacheConfig;
}

export interface ContextPrioritization {
  type: 'documentation' | 'guide' | 'code' | 'config';
  weight: number;
}

export interface CacheConfig {
  enabled: boolean;
  ttl: number;
  watch: boolean;
}

export interface ToolsConfig {
  shell: ShellToolConfig;
}

export interface ShellToolConfig {
  enabled: boolean;
  require_confirmation: boolean;
  dry_run_default: boolean;
  allowed_commands: string[];
  timeout: number;
  sandbox: SandboxConfig;
}

export interface SandboxConfig {
  network: boolean;
  filesystem_write: boolean;
  root_directory: string;
}

export interface OutputConfig {
  format: 'markdown' | 'json' | 'plain';
  color: boolean;
  verbose: boolean;
  show_reasoning: boolean;
}

export interface SessionConfig {
  enabled: boolean;
  storage: string;
  ttl: number;
}

// ============================================================================
// Skill Definition Types
// ============================================================================

export interface SkillDefinition {
  name: string;
  description: string;
  inputs: InputDefinition[];
  outputs: OutputDefinition;
  tools: string[];
  methodology: string;
  version?: string;
  author?: string;
  examples?: SkillExample[];
}

export interface InputDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'string[]' | 'object';
  required: boolean;
  description: string;
  default?: unknown;
}

export interface OutputDefinition {
  format: 'structured' | 'text' | 'markdown';
  schema?: Record<string, unknown>;
}

export interface SkillExample {
  input: string;
  description: string;
}

// ============================================================================
// Harness Types
// ============================================================================

export interface SkillInput {
  intent: string;
  params: Record<string, unknown>;
  contextOverrides?: string[];
}

export interface SkillOutput {
  success: boolean;
  result: unknown;
  reasoning?: string;
  nextSteps?: string[];
  metadata?: {
    duration: number;
    tokensUsed?: number;
    toolCallsCount?: number;
  };
}

// ============================================================================
// Context Types
// ============================================================================

export interface ProjectContext {
  files: ContextFile[];
  structure: DirectoryNode;
  metadata: ProjectMetadata;
}

export interface ContextFile {
  path: string;
  content: string;
  type: 'documentation' | 'guide' | 'code' | 'config';
  size: number;
}

export interface DirectoryNode {
  name: string;
  type: 'file' | 'directory';
  children?: DirectoryNode[];
  path: string;
}

export interface ProjectMetadata {
  name?: string;
  version?: string;
  description?: string;
  repository?: string;
  dependencies?: Record<string, string>;
  gitBranch?: string;
  gitRemote?: string;
}

// ============================================================================
// Tool Types
// ============================================================================

export interface Tool {
  name: string;
  description: string;
  parameters: ParameterDefinition[];
  execute(params: Record<string, unknown>, context: ToolExecutionContext): Promise<ToolResult>;
}

export interface ParameterDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  description: string;
  required: boolean;
  default?: unknown;
}

export interface ToolExecutionContext {
  dryRun: boolean;
  requireConfirmation: boolean;
  sandbox: SandboxConfig;
  workingDirectory: string;
}

export interface ToolResult {
  success: boolean;
  output: unknown;
  metadata: {
    duration: number;
    cacheHit?: boolean;
  };
  error?: Error;
  warnings?: string[];
}

// ============================================================================
// LLM Types
// ============================================================================

export interface LLMRequest {
  system: string;
  messages: Message[];
  tools?: ToolDefinition[];
  maxTokens?: number;
  temperature?: number;
}

export interface Message {
  role: 'user' | 'assistant';
  content: string | ContentBlock[];
}

export interface ContentBlock {
  type: 'text' | 'tool_use' | 'tool_result';
  text?: string;
  id?: string;
  name?: string;
  input?: Record<string, unknown>;
  content?: string;
  tool_use_id?: string;
  is_error?: boolean;
}

export interface ToolDefinition {
  name: string;
  description: string;
  input_schema: {
    type: 'object';
    properties: Record<string, unknown>;
    required?: string[];
  };
}

export interface LLMResponse {
  content: ContentBlock[];
  stopReason: 'end_turn' | 'tool_use' | 'max_tokens';
  usage: TokenUsage;
}

export interface TokenUsage {
  inputTokens: number;
  outputTokens: number;
  cacheCreationInputTokens?: number;
  cacheReadInputTokens?: number;
}

export interface ToolCall {
  id: string;
  name: string;
  input: Record<string, unknown>;
}

// ============================================================================
// Validation Types
// ============================================================================

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  path: string;
  message: string;
  value?: unknown;
}

export interface ValidationWarning {
  path: string;
  message: string;
  suggestion?: string;
}
