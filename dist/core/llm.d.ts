/**
 * LLM Client - Interface with Anthropic Claude API
 */
import type { LLMRequest, LLMResponse, Message, ToolCall } from './types.js';
export declare class LLMClient {
    private client;
    private model;
    private maxTokens;
    private temperature;
    constructor();
    /**
     * Send a request to the LLM
     */
    complete(request: LLMRequest): Promise<LLMResponse>;
    /**
     * Execute a request with tool calling loop
     */
    executeWithTools(request: LLMRequest, toolExecutor: (toolCall: ToolCall) => Promise<{
        success: boolean;
        output: unknown;
        error?: Error;
    }>): Promise<{
        response: LLMResponse;
        messages: Message[];
    }>;
    /**
     * Convert our message format to Anthropic format
     */
    private convertMessages;
    /**
     * Convert tool definition to Anthropic format
     */
    private convertToolDefinition;
    /**
     * Convert Anthropic response to our format
     */
    private convertResponse;
    /**
     * Extract tool calls from content blocks
     */
    private extractToolCalls;
    /**
     * Get a text-only response (for simple cases without tools)
     */
    getTextResponse(system: string, userMessage: string): Promise<string>;
}
//# sourceMappingURL=llm.d.ts.map