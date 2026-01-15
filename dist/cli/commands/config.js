/**
 * Config command - view and modify configuration
 */
import { getConfig } from '../../core/config.js';
import { OutputFormatter } from '../output.js';
export async function configCommand(action, key, value) {
    const output = new OutputFormatter();
    try {
        const config = getConfig();
        if (action === 'get') {
            if (key) {
                const val = config.get(key);
                if (val === undefined) {
                    output.warning(`Configuration key not found: ${key}`);
                }
                else {
                    console.log(JSON.stringify(val, null, 2));
                }
            }
            else {
                // Show all config
                const allConfig = config.getAll();
                console.log(JSON.stringify(allConfig, null, 2));
            }
        }
        else if (action === 'set') {
            if (!key || value === undefined) {
                output.error('Usage: skill config set <key> <value>');
                process.exit(1);
            }
            // Try to parse value as JSON, otherwise treat as string
            let parsedValue = value;
            try {
                parsedValue = JSON.parse(value);
            }
            catch {
                // Keep as string
            }
            config.set(key, parsedValue);
            output.success(`Set ${key} = ${JSON.stringify(parsedValue)}`);
            output.warning('Note: Configuration changes are in-memory only and will not persist');
        }
        else {
            output.error(`Unknown action: ${action}. Use 'get' or 'set'`);
            process.exit(1);
        }
    }
    catch (error) {
        output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=config.js.map