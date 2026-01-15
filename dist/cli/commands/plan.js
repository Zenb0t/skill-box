/**
 * Plan command implementation
 */
import { Harness } from '../../core/harness.js';
import { OutputFormatter } from '../output.js';
export async function planCommand(goal, options) {
    const output = new OutputFormatter();
    try {
        output.info(`Planning: ${goal}`);
        const harness = new Harness(options.cwd || process.cwd());
        const result = await harness.invoke('plan', {
            intent: goal,
            params: {},
            contextOverrides: options.context ? options.context.split(',') : undefined,
        });
        if (!result.success) {
            output.error(`Planning failed: ${result.reasoning}`);
            process.exit(1);
        }
        output.skillOutput(result.result);
        if (options.verbose && result.metadata) {
            output.metadata(result.metadata);
        }
    }
    catch (error) {
        output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=plan.js.map