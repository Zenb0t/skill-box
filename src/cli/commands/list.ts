/**
 * List command - show all available skills
 */

import { Harness } from '../../core/harness.js';
import { OutputFormatter } from '../output.js';

export async function listCommand(): Promise<void> {
  const output = new OutputFormatter();

  try {
    const harness = new Harness();
    const skills = await harness.listSkills();

    if (skills.length === 0) {
      output.warning('No skills found');
      return;
    }

    output.header('Available Skills');

    for (const skillName of skills) {
      try {
        const skill = await harness.getSkillDefinition(skillName);
        output.info(`${skill.name}`);
        console.log(`  ${skill.description}`);
        if (skill.version) {
          console.log(`  Version: ${skill.version}`);
        }
        console.log();
      } catch (error) {
        output.warning(`  Failed to load: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }
  } catch (error) {
    output.error(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    process.exit(1);
  }
}
