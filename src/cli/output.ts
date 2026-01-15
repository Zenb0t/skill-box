/**
 * CLI Output formatting utilities
 */

import chalk from 'chalk';
import { getConfig } from '../core/config.js';

export class OutputFormatter {
  private useColor: boolean;
  private format: 'markdown' | 'json' | 'plain';

  constructor() {
    const config = getConfig().get<any>('output') || {};
    this.useColor = config.color ?? true;
    this.format = config.format ?? 'markdown';
  }

  /**
   * Format success message
   */
  success(message: string): void {
    if (this.useColor) {
      console.log(chalk.green('✓'), message);
    } else {
      console.log('✓', message);
    }
  }

  /**
   * Format error message
   */
  error(message: string): void {
    if (this.useColor) {
      console.error(chalk.red('✗'), message);
    } else {
      console.error('✗', message);
    }
  }

  /**
   * Format warning message
   */
  warning(message: string): void {
    if (this.useColor) {
      console.log(chalk.yellow('⚠'), message);
    } else {
      console.log('⚠', message);
    }
  }

  /**
   * Format info message
   */
  info(message: string): void {
    if (this.useColor) {
      console.log(chalk.blue('ℹ'), message);
    } else {
      console.log('ℹ', message);
    }
  }

  /**
   * Format section header
   */
  header(text: string): void {
    if (this.useColor) {
      console.log(chalk.bold.cyan(`\n${text}\n${'='.repeat(text.length)}`));
    } else {
      console.log(`\n${text}\n${'='.repeat(text.length)}`);
    }
  }

  /**
   * Format subsection header
   */
  subheader(text: string): void {
    if (this.useColor) {
      console.log(chalk.bold(`\n${text}`));
    } else {
      console.log(`\n${text}`);
    }
  }

  /**
   * Format skill output based on configuration
   */
  skillOutput(output: any): void {
    if (this.format === 'json') {
      console.log(JSON.stringify(output, null, 2));
    } else if (this.format === 'markdown') {
      this.formatMarkdown(output);
    } else {
      this.formatPlain(output);
    }
  }

  /**
   * Format as markdown
   */
  private formatMarkdown(output: any): void {
    if (typeof output === 'string') {
      console.log(output);
      return;
    }

    if (output.goal) {
      this.header('Plan');
      console.log(`**Goal:** ${output.goal}\n`);
    }

    if (output.understanding) {
      this.subheader('Understanding');
      console.log(output.understanding + '\n');
    }

    if (output.constraints && output.constraints.length > 0) {
      this.subheader('Constraints');
      output.constraints.forEach((c: string) => console.log(`- ${c}`));
      console.log();
    }

    if (output.tasks && output.tasks.length > 0) {
      this.subheader('Tasks');
      output.tasks.forEach((task: any, i: number) => {
        console.log(`${i + 1}. **${task.title}** (${task.estimatedComplexity})`);
        console.log(`   ${task.description}`);
        if (task.dependencies && task.dependencies.length > 0) {
          console.log(`   Dependencies: ${task.dependencies.join(', ')}`);
        }
        console.log();
      });
    }

    if (output.currentStep) {
      this.header('Current Step: ' + output.currentStep.title);
      console.log(output.currentStep.description + '\n');

      if (output.currentStep.actions && output.currentStep.actions.length > 0) {
        this.subheader('Actions');
        output.currentStep.actions.forEach((action: string) => {
          console.log(`- ${action}`);
        });
        console.log();
      }

      if (output.currentStep.successCriteria && output.currentStep.successCriteria.length > 0) {
        this.subheader('Success Criteria');
        output.currentStep.successCriteria.forEach((criteria: string) => {
          console.log(`- ${criteria}`);
        });
        console.log();
      }
    }

    if (output.nextSteps && output.nextSteps.length > 0) {
      this.subheader('Next Steps');
      output.nextSteps.forEach((step: string, i: number) => {
        console.log(`${i + 1}. ${step}`);
      });
      console.log();
    }
  }

  /**
   * Format as plain text
   */
  private formatPlain(output: any): void {
    if (typeof output === 'string') {
      console.log(output);
      return;
    }

    console.log(JSON.stringify(output, null, 2));
  }

  /**
   * Format metadata
   */
  metadata(data: any): void {
    if (!data) return;

    console.log();
    if (data.duration !== undefined) {
      this.info(`Duration: ${data.duration}ms`);
    }
    if (data.tokensUsed !== undefined) {
      this.info(`Tokens used: ${data.tokensUsed}`);
    }
    if (data.toolCallsCount !== undefined) {
      this.info(`Tool calls: ${data.toolCallsCount}`);
    }
  }
}
