/**
 * Context Gatherer - Collect project context from files and metadata
 */
import type { ProjectContext } from './types.js';
export declare class ContextGatherer {
    private config;
    private workingDirectory;
    constructor(workingDirectory?: string);
    /**
     * Gather full project context
     */
    gather(pathOverrides?: string[]): Promise<ProjectContext>;
    /**
     * Gather files from specified paths
     */
    private gatherFiles;
    /**
     * Read a single file as context
     */
    private readContextFile;
    /**
     * Detect file type based on path and content
     */
    private detectFileType;
    /**
     * Check if file is binary
     */
    private isBinaryFile;
    /**
     * Get weight for file type based on prioritization config
     */
    private getTypeWeight;
    /**
     * Gather directory structure
     */
    private gatherStructure;
    /**
     * Gather project metadata
     */
    private gatherMetadata;
    /**
     * Format context for LLM consumption
     */
    formatForLLM(context: ProjectContext): string;
    /**
     * Get a summary of what context would be loaded
     */
    getContextSummary(pathOverrides?: string[]): Promise<string>;
}
//# sourceMappingURL=context.d.ts.map