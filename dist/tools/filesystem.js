/**
 * Filesystem tools - read files, list directories, find files
 */
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, relative, resolve } from 'path';
import { glob } from 'glob';
/**
 * Read file contents
 */
export const readFileTool = {
    name: 'read_file',
    description: 'Read the contents of a file',
    parameters: [
        {
            name: 'path',
            type: 'string',
            description: 'Path to the file to read',
            required: true,
        },
        {
            name: 'encoding',
            type: 'string',
            description: 'File encoding (default: utf-8)',
            required: false,
            default: 'utf-8',
        },
    ],
    async execute(params, context) {
        const startTime = Date.now();
        const path = params.path;
        const encoding = params.encoding || 'utf-8';
        try {
            // Resolve path relative to working directory
            const fullPath = resolve(context.workingDirectory, path);
            // Check if file exists
            if (!existsSync(fullPath)) {
                return {
                    success: false,
                    output: null,
                    metadata: { duration: Date.now() - startTime },
                    error: new Error(`File not found: ${path}`),
                };
            }
            // Check if it's a file (not directory)
            const stats = statSync(fullPath);
            if (!stats.isFile()) {
                return {
                    success: false,
                    output: null,
                    metadata: { duration: Date.now() - startTime },
                    error: new Error(`Path is not a file: ${path}`),
                };
            }
            // Read file
            const content = readFileSync(fullPath, encoding);
            return {
                success: true,
                output: content,
                metadata: { duration: Date.now() - startTime },
            };
        }
        catch (error) {
            return {
                success: false,
                output: null,
                metadata: { duration: Date.now() - startTime },
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },
};
/**
 * List directory contents
 */
export const listDirectoryTool = {
    name: 'list_directory',
    description: 'List files and directories in a path',
    parameters: [
        {
            name: 'path',
            type: 'string',
            description: 'Path to the directory',
            required: true,
        },
        {
            name: 'recursive',
            type: 'boolean',
            description: 'List recursively',
            required: false,
            default: false,
        },
    ],
    async execute(params, context) {
        const startTime = Date.now();
        const path = params.path;
        const recursive = params.recursive;
        try {
            const fullPath = resolve(context.workingDirectory, path);
            if (!existsSync(fullPath)) {
                return {
                    success: false,
                    output: null,
                    metadata: { duration: Date.now() - startTime },
                    error: new Error(`Directory not found: ${path}`),
                };
            }
            const stats = statSync(fullPath);
            if (!stats.isDirectory()) {
                return {
                    success: false,
                    output: null,
                    metadata: { duration: Date.now() - startTime },
                    error: new Error(`Path is not a directory: ${path}`),
                };
            }
            const listRecursive = (dir, baseDir = dir) => {
                const entries = readdirSync(dir);
                const files = [];
                for (const entry of entries) {
                    const fullEntryPath = join(dir, entry);
                    const relativePath = relative(baseDir, fullEntryPath);
                    const stat = statSync(fullEntryPath);
                    if (stat.isDirectory()) {
                        files.push(`${relativePath}/`);
                        if (recursive) {
                            files.push(...listRecursive(fullEntryPath, baseDir));
                        }
                    }
                    else {
                        files.push(relativePath);
                    }
                }
                return files;
            };
            const entries = listRecursive(fullPath);
            return {
                success: true,
                output: entries,
                metadata: { duration: Date.now() - startTime },
            };
        }
        catch (error) {
            return {
                success: false,
                output: null,
                metadata: { duration: Date.now() - startTime },
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },
};
/**
 * Find files matching a pattern
 */
export const findFilesTool = {
    name: 'find_files',
    description: 'Find files matching a glob pattern',
    parameters: [
        {
            name: 'pattern',
            type: 'string',
            description: 'Glob pattern to match (e.g., "**/*.ts")',
            required: true,
        },
        {
            name: 'cwd',
            type: 'string',
            description: 'Working directory for the search',
            required: false,
        },
        {
            name: 'ignore',
            type: 'array',
            description: 'Patterns to ignore',
            required: false,
            default: ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
        },
    ],
    async execute(params, context) {
        const startTime = Date.now();
        const pattern = params.pattern;
        const cwd = params.cwd;
        const ignore = params.ignore;
        try {
            const searchDir = cwd ? resolve(context.workingDirectory, cwd) : context.workingDirectory;
            const files = await glob(pattern, {
                cwd: searchDir,
                ignore: ignore || ['node_modules/**', '.git/**', 'dist/**', 'build/**'],
                nodir: true,
                dot: false,
            });
            return {
                success: true,
                output: files,
                metadata: { duration: Date.now() - startTime },
            };
        }
        catch (error) {
            return {
                success: false,
                output: null,
                metadata: { duration: Date.now() - startTime },
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },
};
/**
 * Write file contents
 */
export const writeFileTool = {
    name: 'write_file',
    description: 'Write content to a file',
    parameters: [
        {
            name: 'path',
            type: 'string',
            description: 'Path to the file to write',
            required: true,
        },
        {
            name: 'content',
            type: 'string',
            description: 'Content to write',
            required: true,
        },
        {
            name: 'encoding',
            type: 'string',
            description: 'File encoding (default: utf-8)',
            required: false,
            default: 'utf-8',
        },
    ],
    async execute(params, context) {
        const startTime = Date.now();
        // Check sandbox permissions
        if (!context.sandbox.filesystem_write) {
            return {
                success: false,
                output: null,
                metadata: { duration: Date.now() - startTime },
                error: new Error('File writing is disabled in sandbox mode'),
            };
        }
        const path = params.path;
        const content = params.content;
        const encoding = params.encoding || 'utf-8';
        try {
            const fullPath = resolve(context.workingDirectory, path);
            const { writeFileSync } = await import('fs');
            writeFileSync(fullPath, content, encoding);
            return {
                success: true,
                output: `File written successfully: ${path}`,
                metadata: { duration: Date.now() - startTime },
            };
        }
        catch (error) {
            return {
                success: false,
                output: null,
                metadata: { duration: Date.now() - startTime },
                error: error instanceof Error ? error : new Error(String(error)),
            };
        }
    },
};
// Export all filesystem tools
export const filesystemTools = [
    readFileTool,
    listDirectoryTool,
    findFilesTool,
    writeFileTool,
];
//# sourceMappingURL=filesystem.js.map