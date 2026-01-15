/**
 * Context Gatherer - Collect project context from files and metadata
 */
import { readFileSync, statSync, existsSync } from 'fs';
import { join, resolve, relative, extname } from 'path';
import { glob } from 'glob';
import { getConfig } from './config.js';
export class ContextGatherer {
    config;
    workingDirectory;
    constructor(workingDirectory = process.cwd()) {
        this.workingDirectory = workingDirectory;
        this.config = getConfig().get('context');
    }
    /**
     * Gather full project context
     */
    async gather(pathOverrides) {
        const paths = pathOverrides || this.config.default_paths;
        const files = await this.gatherFiles(paths);
        const structure = await this.gatherStructure();
        const metadata = await this.gatherMetadata();
        return {
            files,
            structure,
            metadata,
        };
    }
    /**
     * Gather files from specified paths
     */
    async gatherFiles(paths) {
        const files = [];
        let totalSize = 0;
        for (const path of paths) {
            const fullPath = resolve(this.workingDirectory, path);
            if (!existsSync(fullPath)) {
                continue;
            }
            const stats = statSync(fullPath);
            if (stats.isFile()) {
                const file = await this.readContextFile(fullPath);
                if (file && totalSize + file.size <= this.config.max_total_context) {
                    files.push(file);
                    totalSize += file.size;
                }
            }
            else if (stats.isDirectory()) {
                // Find all relevant files in directory
                const pattern = join(fullPath, '**/*');
                const foundFiles = await glob(pattern, {
                    nodir: true,
                    ignore: ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'],
                });
                for (const filePath of foundFiles) {
                    if (totalSize >= this.config.max_total_context) {
                        break;
                    }
                    const file = await this.readContextFile(filePath);
                    if (file && totalSize + file.size <= this.config.max_total_context) {
                        files.push(file);
                        totalSize += file.size;
                    }
                }
            }
        }
        // Sort by priority if configured
        if (this.config.prioritization) {
            files.sort((a, b) => {
                const weightA = this.getTypeWeight(a.type);
                const weightB = this.getTypeWeight(b.type);
                return weightB - weightA;
            });
        }
        return files;
    }
    /**
     * Read a single file as context
     */
    async readContextFile(fullPath) {
        try {
            const stats = statSync(fullPath);
            // Skip files that are too large
            if (stats.size > this.config.max_file_size) {
                return null;
            }
            // Skip binary files
            if (this.isBinaryFile(fullPath)) {
                return null;
            }
            const content = readFileSync(fullPath, 'utf-8');
            const relativePath = relative(this.workingDirectory, fullPath);
            const type = this.detectFileType(relativePath, content);
            return {
                path: relativePath,
                content,
                type,
                size: stats.size,
            };
        }
        catch (error) {
            // Skip files that can't be read
            return null;
        }
    }
    /**
     * Detect file type based on path and content
     */
    detectFileType(path, _content) {
        const lowerPath = path.toLowerCase();
        // Documentation
        if (lowerPath.endsWith('.md') ||
            lowerPath.includes('readme') ||
            lowerPath.includes('/docs/')) {
            return 'documentation';
        }
        // Guides
        if (lowerPath.includes('/guides/') || lowerPath.includes('guide')) {
            return 'guide';
        }
        // Config files
        if (lowerPath.endsWith('.json') ||
            lowerPath.endsWith('.yaml') ||
            lowerPath.endsWith('.yml') ||
            lowerPath.endsWith('.toml') ||
            lowerPath.includes('config')) {
            return 'config';
        }
        // Code by default
        return 'code';
    }
    /**
     * Check if file is binary
     */
    isBinaryFile(path) {
        const binaryExtensions = [
            '.png', '.jpg', '.jpeg', '.gif', '.ico', '.pdf',
            '.zip', '.tar', '.gz', '.exe', '.dll', '.so',
            '.dylib', '.bin', '.dat', '.db', '.sqlite',
        ];
        const ext = extname(path).toLowerCase();
        return binaryExtensions.includes(ext);
    }
    /**
     * Get weight for file type based on prioritization config
     */
    getTypeWeight(type) {
        if (!this.config.prioritization) {
            return 1.0;
        }
        const priority = this.config.prioritization.find(p => p.type === type);
        return priority?.weight ?? 0.5;
    }
    /**
     * Gather directory structure
     */
    async gatherStructure() {
        const buildTree = (path, depth = 0) => {
            // Limit depth to avoid huge trees
            if (depth > 3) {
                return null;
            }
            try {
                const stats = statSync(path);
                const name = relative(this.workingDirectory, path) || '.';
                if (stats.isFile()) {
                    return {
                        name,
                        type: 'file',
                        path,
                    };
                }
                if (stats.isDirectory()) {
                    // Skip common directories
                    const skipDirs = ['node_modules', '.git', 'dist', 'build', '.next', 'coverage'];
                    if (skipDirs.some(dir => path.includes(dir))) {
                        return null;
                    }
                    const { readdirSync } = require('fs');
                    const entries = readdirSync(path);
                    const children = [];
                    for (const entry of entries) {
                        const fullPath = join(path, entry);
                        const child = buildTree(fullPath, depth + 1);
                        if (child) {
                            children.push(child);
                        }
                    }
                    return {
                        name,
                        type: 'directory',
                        path,
                        children,
                    };
                }
            }
            catch (error) {
                // Skip inaccessible paths
            }
            return null;
        };
        const tree = buildTree(this.workingDirectory);
        return tree || {
            name: '.',
            type: 'directory',
            path: this.workingDirectory,
            children: [],
        };
    }
    /**
     * Gather project metadata
     */
    async gatherMetadata() {
        const metadata = {};
        // Try to read package.json
        const packageJsonPath = join(this.workingDirectory, 'package.json');
        if (existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
                metadata.name = packageJson.name;
                metadata.version = packageJson.version;
                metadata.description = packageJson.description;
                metadata.repository = packageJson.repository?.url || packageJson.repository;
                metadata.dependencies = packageJson.dependencies;
            }
            catch (error) {
                // Skip if package.json is invalid
            }
        }
        // Try to get git information
        try {
            const { execSync } = require('child_process');
            const branch = execSync('git rev-parse --abbrev-ref HEAD', {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
            }).trim();
            const remote = execSync('git config --get remote.origin.url', {
                cwd: this.workingDirectory,
                encoding: 'utf-8',
            }).trim();
            metadata.gitBranch = branch;
            metadata.gitRemote = remote;
        }
        catch (error) {
            // Skip if not a git repository
        }
        return metadata;
    }
    /**
     * Format context for LLM consumption
     */
    formatForLLM(context) {
        let output = '# Project Context\n\n';
        // Metadata
        if (context.metadata.name) {
            output += `## Project: ${context.metadata.name}\n`;
            if (context.metadata.description) {
                output += `${context.metadata.description}\n`;
            }
            output += '\n';
        }
        // Files
        output += '## Relevant Files\n\n';
        for (const file of context.files) {
            output += `### ${file.path}\n`;
            output += '```\n';
            output += file.content;
            output += '\n```\n\n';
        }
        return output;
    }
    /**
     * Get a summary of what context would be loaded
     */
    async getContextSummary(pathOverrides) {
        const paths = pathOverrides || this.config.default_paths;
        let summary = 'Context paths to be loaded:\n\n';
        for (const path of paths) {
            const fullPath = resolve(this.workingDirectory, path);
            const exists = existsSync(fullPath);
            summary += `  ${exists ? '✓' : '✗'} ${path}\n`;
        }
        summary += `\nLimits:\n`;
        summary += `  Max file size: ${this.config.max_file_size} bytes\n`;
        summary += `  Max total context: ${this.config.max_total_context} bytes\n`;
        return summary;
    }
}
//# sourceMappingURL=context.js.map