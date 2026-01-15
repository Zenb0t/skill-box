#!/usr/bin/env node
/**
 * CLI Entry Point
 */

import { Command } from 'commander';
import { planCommand } from './commands/plan.js';
import { listCommand } from './commands/list.js';
import { showCommand } from './commands/show.js';
import { validateCommand } from './commands/validate.js';
import { contextCommand } from './commands/context.js';
import { configCommand } from './commands/config.js';

const program = new Command();

program
  .name('skill')
  .description('Skill Harness - Portable, tool-agnostic development methodology framework')
  .version('0.1.0');

// Plan command
program
  .command('plan <goal>')
  .description('Break down a goal into tasks and iterative steps')
  .option('--context <paths>', 'Comma-separated list of context paths to load')
  .option('--cwd <directory>', 'Working directory', process.cwd())
  .option('-v, --verbose', 'Show detailed output including metadata')
  .action(planCommand);

// List command
program
  .command('list')
  .description('List all available skills')
  .action(listCommand);

// Show command
program
  .command('show <skill>')
  .description('Show detailed information about a skill')
  .action(showCommand);

// Validate command
program
  .command('validate [skill]')
  .description('Validate skill definition(s). If no skill specified, validates all.')
  .action(validateCommand);

// Context command
program
  .command('context')
  .description('Show what context would be loaded for skills')
  .option('--paths <paths>', 'Comma-separated list of paths to check')
  .option('--cwd <directory>', 'Working directory', process.cwd())
  .option('-v, --verbose', 'Show detailed file list')
  .action(contextCommand);

// Config command
program
  .command('config <action> [key] [value]')
  .description('View or modify configuration (get/set)')
  .action(configCommand);

// Parse arguments
program.parse(process.argv);

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
}
