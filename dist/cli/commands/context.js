/**
 * Context command - show what context would be loaded
 */
import { ContextGatherer } from '../../core/context.js';
import { OutputFormatter } from '../output.js';
export async function contextCommand(options) {
    const output = new OutputFormatter();
    try {
        const gatherer = new ContextGatherer(options.cwd || process.cwd());
        const paths = options.paths ? options.paths.split(',') : undefined;
        const summary = await gatherer.getContextSummary(paths);
        output.header('Context Summary');
        console.log(summary);
        // If verbose, show what files would be loaded
        if (options.verbose) {
            output.subheader('Loading Context...');
            const context = await gatherer.gather(paths);
            console.log(`\nLoaded ${context.files.length} files:\n`);
            context.files.forEach(file => {
                console.log(`  ${file.type.padEnd(15)} ${file.path} (${file.size} bytes)`);
            });
            if (context.metadata.name) {
                output.subheader('Project Metadata');
                console.log(`Name: ${context.metadata.name}`);
                if (context.metadata.version) {
                    console.log(`Version: ${context.metadata.version}`);
                }
                if (context.metadata.description) {
                    console.log(`Description: ${context.metadata.description}`);
                }
                if (context.metadata.gitBranch) {
                    console.log(`Git Branch: ${context.metadata.gitBranch}`);
                }
            }
        }
    }
    catch (error) {
        output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=context.js.map