/**
 * Show command - display skill definition
 */
import { Harness } from '../../core/harness.js';
import { OutputFormatter } from '../output.js';
export async function showCommand(skillName) {
    const output = new OutputFormatter();
    try {
        const harness = new Harness();
        const skill = await harness.getSkillDefinition(skillName);
        output.header(`Skill: ${skill.name}`);
        console.log(`**Description:** ${skill.description}\n`);
        if (skill.version) {
            console.log(`**Version:** ${skill.version}`);
        }
        if (skill.author) {
            console.log(`**Author:** ${skill.author}`);
        }
        console.log();
        output.subheader('Inputs');
        skill.inputs.forEach(input => {
            console.log(`- **${input.name}** (${input.type})${input.required ? ' *required*' : ''}`);
            console.log(`  ${input.description}`);
        });
        console.log();
        output.subheader('Output Format');
        console.log(skill.outputs.format);
        if (skill.outputs.schema) {
            console.log('\nSchema:');
            console.log(JSON.stringify(skill.outputs.schema, null, 2));
        }
        console.log();
        output.subheader('Available Tools');
        skill.tools.forEach(tool => console.log(`- ${tool}`));
        console.log();
        if (skill.examples && skill.examples.length > 0) {
            output.subheader('Examples');
            skill.examples.forEach(example => {
                console.log(`\`${example.input}\``);
                console.log(`  ${example.description}\n`);
            });
        }
        output.subheader('Methodology');
        console.log(skill.methodology);
    }
    catch (error) {
        output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
        process.exit(1);
    }
}
//# sourceMappingURL=show.js.map