/**
 * LLM Client - Interface with Anthropic Claude API
 */
import Anthropic from '@anthropic-ai/sdk';
import { getConfig } from './config.js';
export class LLMClient {
    client;
    model;
    maxTokens;
    temperature;
    constructor() {
        const config = getConfig();
        const apiKey = config.getApiKey();
        const llmConfig = config.get('llm');
        this.client = new Anthropic({
            apiKey,
        });
        this.model = llmConfig.model;
        this.maxTokens = llmConfig.max_tokens;
        this.temperature = llmConfig.temperature ?? 0.7;
    }
    /**
     * Send a request to the LLM
     */
    async complete(request) {
        const maxTokens = request.maxTokens || this.maxTokens;
        const temperature = request.temperature ?? this.temperature;
        // Convert our message format to Anthropic format
        const messages = this.convertMessages(request.messages);
        // Convert tool definitions to Anthropic format
        const tools = request.tools?.map(this.convertToolDefinition);
        try {
            const response = await this.client.messages.create({
                model: this.model,
                max_tokens: maxTokens,
                temperature,
                system: request.system,
                messages,
                tools,
            });
            return this.convertResponse(response);
        }
        catch (error) {
            if (error instanceof Anthropic.APIError) {
                throw new Error(`Anthropic API error: ${error.message}`);
            }
            throw error;
        }
    }
    /**
     * Execute a request with tool calling loop
     */
    async executeWithTools(request, toolExecutor) {
        const messages = [...request.messages];
        let response;
        let iterations = 0;
        const maxIterations = 20; // Prevent infinite loops
        while (iterations < maxIterations) {
            iterations++;
            // Get LLM response
            response = await this.complete({
                ...request,
                messages,
            });
            // Check if we're done
            if (response.stopReason === 'end_turn' || response.stopReason === 'max_tokens') {
                return { response, messages };
            }
            // Extract tool calls
            const toolCalls = this.extractToolCalls(response.content);
            if (toolCalls.length === 0) {
                return { response, messages };
            }
            // Add assistant message with tool calls
            messages.push({
                role: 'assistant',
                content: response.content,
            });
            // Execute tools and add results
            const toolResults = [];
            for (const toolCall of toolCalls) {
                const result = await toolExecutor(toolCall);
                toolResults.push({
                    type: 'tool_result',
                    tool_use_id: toolCall.id,
                    content: result.success
                        ? JSON.stringify(result.output)
                        : `Error: ${result.error?.message || 'Unknown error'}`,
                    is_error: !result.success,
                });
            }
            // Add tool results as user message
            messages.push({
                role: 'user',
                content: toolResults,
            });
        }
        throw new Error('Max tool calling iterations reached');
    }
    /**
     * Convert our message format to Anthropic format
     */
    convertMessages(messages) {
        return messages.map(msg => {
            if (typeof msg.content === 'string') {
                return {
                    role: msg.role,
                    content: msg.content,
                };
            }
            // Handle content blocks
            const content = msg.content.map(block => {
                if (block.type === 'text') {
                    return {
                        type: 'text',
                        text: block.text || '',
                    };
                }
                if (block.type === 'tool_use') {
                    return {
                        type: 'tool_use',
                        id: block.id || '',
                        name: block.name || '',
                        input: block.input || {},
                    };
                }
                if (block.type === 'tool_result') {
                    return {
                        type: 'tool_result',
                        tool_use_id: block.tool_use_id || '',
                        content: block.content || '',
                        is_error: block.is_error,
                    };
                }
                return { type: 'text', text: '' };
            });
            return {
                role: msg.role,
                content,
            };
        });
    }
    /**
     * Convert tool definition to Anthropic format
     */
    convertToolDefinition(tool) {
        return {
            name: tool.name,
            description: tool.description,
            input_schema: tool.input_schema,
        };
    }
    /**
     * Convert Anthropic response to our format
     */
    convertResponse(response) {
        const content = response.content.map(block => {
            if (block.type === 'text') {
                return {
                    type: 'text',
                    text: block.text,
                };
            }
            if (block.type === 'tool_use') {
                return {
                    type: 'tool_use',
                    id: block.id,
                    name: block.name,
                    input: block.input,
                };
            }
            return { type: 'text', text: '' };
        });
        const usage = {
            inputTokens: response.usage.input_tokens,
            outputTokens: response.usage.output_tokens,
            cacheCreationInputTokens: response.usage.cache_creation_input_tokens,
            cacheReadInputTokens: response.usage.cache_read_input_tokens,
        };
        return {
            content,
            stopReason: response.stop_reason,
            usage,
        };
    }
    /**
     * Extract tool calls from content blocks
     */
    extractToolCalls(content) {
        return content
            .filter((block) => block.type === 'tool_use')
            .map(block => ({
            id: block.id,
            name: block.name,
            input: block.input,
        }));
    }
    /**
     * Get a text-only response (for simple cases without tools)
     */
    async getTextResponse(system, userMessage) {
        const response = await this.complete({
            system,
            messages: [
                {
                    role: 'user',
                    content: userMessage,
                },
            ],
        });
        const textBlocks = response.content.filter(block => block.type === 'text');
        return textBlocks.map(block => block.text).join('\n');
    }
}
//# sourceMappingURL=llm.js.map