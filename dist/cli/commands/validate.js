/**
 * Validate command - validate skill definitions
 */
import { Harness } from '../../core/harness.js';
import { OutputFormatter } from '../output.js';
export async function validateCommand(skillName) {
    const output = new OutputFormatter();
    try {
        const harness = new Harness();
        // If skill name provided, validate that one
        if (skillName) {
            await validateSingleSkill(skillName, harness, output);
            return;
        }
        // Otherwise validate all skills
        const skills = await harness.listSkills();
        if (skills.length === 0) {
            output.warning('No skills found to validate');
            return;
        }
        output.header('Validating Skills');
        let allValid = true;
        for (const name of skills) {
            const valid = await validateSingleSkill(name, harness, output);
            if (!valid) {
                allValid = false;
            }
        }
        console.log();
        if (allValid) {
            output.success('All skills are valid');
        }
        else {
            output.error('Some skills have validation errors');
            process.exit(1);
        }
    }
    catch (error) {
        output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
async function validateSingleSkill(skillName, harness, output) {
    try {
        const result = await harness.validateSkill(skillName);
        if (result.valid) {
            output.success(`${skillName}: Valid`);
            if (result.warnings.length > 0) {
                result.warnings.forEach(warning => {
                    output.warning(`  ${warning.path}: ${warning.message}`);
                    if (warning.suggestion) {
                        console.log(`    Suggestion: ${warning.suggestion}`);
                    }
                });
            }
            return true;
        }
        else {
            output.error(`${skillName}: Invalid`);
            result.errors.forEach(error => {
                console.log(`  ✗ ${error.path}: ${error.message}`);
            });
            if (result.warnings.length > 0) {
                result.warnings.forEach(warning => {
                    output.warning(`  ${warning.path}: ${warning.message}`);
                });
            }
            return false;
        }
    }
    catch (error) {
        output.error(`${skillName}: ${error instanceof Error ? error.message : 'Unknown error'}`);
        return false;
    }
}
//# sourceMappingURL=validate.js.map