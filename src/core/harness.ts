/**
 * Skill Harness - Main orchestration logic
 */

import type {
  SkillInput,
  SkillOutput,
  ToolExecutionContext,
  ToolCall,
} from './types.js';
import { MethodologyLoader, getMethodologyLoader } from './methodology.js';
import { ContextGatherer } from './context.js';
import { LLMClient } from './llm.js';
import { getToolRegistry } from '../tools/index.js';
import { setupTools } from '../tools/setup.js';
import { getConfig } from './config.js';

export class Harness {
  private methodologyLoader: MethodologyLoader;
  private workingDirectory: string;

  constructor(workingDirectory: string = process.cwd()) {
    this.workingDirectory = workingDirectory;
    this.methodologyLoader = getMethodologyLoader();

    // Initialize tools
    setupTools();
  }

  /**
   * Invoke a skill
   */
  async invoke(skillName: string, input: SkillInput): Promise<SkillOutput> {
    const startTime = Date.now();

    try {
      // 1. Load skill definition
      const skill = await this.methodologyLoader.load(skillName);

      // 2. Gather project context
      const contextGatherer = new ContextGatherer(this.workingDirectory);
      const context = await contextGatherer.gather(input.contextOverrides);
      const contextFormatted = contextGatherer.formatForLLM(context);

      // 3. Prepare tools for this skill
      const toolRegistry = getToolRegistry();
      const allowedTools = toolRegistry.forSkill(skill.tools);
      const toolDefinitions = toolRegistry.toToolDefinitions(allowedTools);

      // 4. Build system prompt
      const systemPrompt = this.buildSystemPrompt(skill, contextFormatted);

      // 5. Build user message
      const userMessage = this.buildUserMessage(input, skill);

      // 6. Execute LLM with tools
      const llmClient = new LLMClient();
      const config = getConfig().getAll();

      const toolExecutionContext: ToolExecutionContext = {
        dryRun: false,
        requireConfirmation: config.tools.shell.require_confirmation,
        sandbox: config.tools.shell.sandbox,
        workingDirectory: this.workingDirectory,
      };

      let totalToolCalls = 0;

      const { response } = await llmClient.executeWithTools(
        {
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userMessage,
            },
          ],
          tools: toolDefinitions.length > 0 ? toolDefinitions : undefined,
        },
        async (toolCall: ToolCall) => {
          totalToolCalls++;
          return await this.executeToolCall(toolCall, allowedTools, toolExecutionContext);
        }
      );

      // 7. Parse output
      const result = this.parseOutput(response, skill);

      // 8. Build final output
      const duration = Date.now() - startTime;

      return {
        success: true,
        result,
        metadata: {
          duration,
          tokensUsed: response.usage.inputTokens + response.usage.outputTokens,
          toolCallsCount: totalToolCalls,
        },
      };
    } catch (error) {
      const duration = Date.now() - startTime;

      return {
        success: false,
        result: null,
        metadata: {
          duration,
        },
        reasoning: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * Build system prompt from skill definition and context
   */
  private buildSystemPrompt(skill: any, context: string): string {
    return `You are a skilled assistant helping with: ${skill.description}

# Methodology

${skill.methodology}

# Project Context

${context}

# Instructions

1. Follow the methodology provided above
2. Use the project context to inform your decisions
3. Use available tools to gather additional information as needed
4. Provide structured output according to the skill's output format
5. Be thorough but concise

${skill.outputs.format === 'structured' && skill.outputs.schema
  ? `\n# Output Format\n\nProvide your response as JSON matching this schema:\n${JSON.stringify(skill.outputs.schema, null, 2)}`
  : ''
}`;
  }

  /**
   * Build user message from input
   */
  private buildUserMessage(input: SkillInput, _skill: any): string {
    let message = `${input.intent}\n\n`;

    // Add parameters if provided
    if (Object.keys(input.params).length > 0) {
      message += '# Parameters\n\n';
      for (const [key, value] of Object.entries(input.params)) {
        message += `- ${key}: ${JSON.stringify(value)}\n`;
      }
    }

    return message.trim();
  }

  /**
   * Execute a tool call
   */
  private async executeToolCall(
    toolCall: ToolCall,
    allowedTools: any[],
    context: ToolExecutionContext
  ): Promise<{ success: boolean; output: unknown; error?: Error }> {
    // Find the tool
    const tool = allowedTools.find(t => t.name === toolCall.name);

    if (!tool) {
      return {
        success: false,
        output: null,
        error: new Error(`Tool not found or not allowed: ${toolCall.name}`),
      };
    }

    // Execute the tool
    try {
      const result = await tool.execute(toolCall.input, context);

      if (!result.success) {
        return {
          success: false,
          output: result.output,
          error: result.error,
        };
      }

      return {
        success: true,
        output: result.output,
      };
    } catch (error) {
      return {
        success: false,
        output: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  /**
   * Parse LLM output based on skill output format
   */
  private parseOutput(response: any, skill: any): unknown {
    const textContent = response.content
      .filter((block: any) => block.type === 'text')
      .map((block: any) => block.text)
      .join('\n');

    if (skill.outputs.format === 'structured') {
      // Try to extract JSON from the response
      const jsonMatch = textContent.match(/```json\n([\s\S]*?)\n```/) ||
                       textContent.match(/\{[\s\S]*\}/);

      if (jsonMatch) {
        try {
          return JSON.parse(jsonMatch[1] || jsonMatch[0]);
        } catch (error) {
          // If JSON parsing fails, return text
          return { error: 'Failed to parse structured output', content: textContent };
        }
      }

      return { content: textContent };
    }

    return textContent;
  }

  /**
   * List available skills
   */
  async listSkills(): Promise<string[]> {
    return this.methodologyLoader.list();
  }

  /**
   * Get skill definition
   */
  async getSkillDefinition(skillName: string) {
    return this.methodologyLoader.getDefinition(skillName);
  }

  /**
   * Validate a skill
   */
  async validateSkill(skillName: string) {
    return this.methodologyLoader.validate(skillName);
  }
}
