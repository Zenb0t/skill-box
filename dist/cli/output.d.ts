/**
 * CLI Output formatting utilities
 */
export declare class OutputFormatter {
    private useColor;
    private format;
    constructor();
    /**
     * Format success message
     */
    success(message: string): void;
    /**
     * Format error message
     */
    error(message: string): void;
    /**
     * Format warning message
     */
    warning(message: string): void;
    /**
     * Format info message
     */
    info(message: string): void;
    /**
     * Format section header
     */
    header(text: string): void;
    /**
     * Format subsection header
     */
    subheader(text: string): void;
    /**
     * Format skill output based on configuration
     */
    skillOutput(output: any): void;
    /**
     * Format as markdown
     */
    private formatMarkdown;
    /**
     * Format as plain text
     */
    private formatPlain;
    /**
     * Format metadata
     */
    metadata(data: any): void;
}
//# sourceMappingURL=output.d.ts.map