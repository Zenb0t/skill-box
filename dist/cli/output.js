/**
 * CLI Output formatting utilities
 */
import chalk from 'chalk';
import { getConfig } from '../core/config.js';
export class OutputFormatter {
    useColor;
    format;
    constructor() {
        const config = getConfig().get('output') || {};
        this.useColor = config.color ?? true;
        this.format = config.format ?? 'markdown';
    }
    /**
     * Format success message
     */
    success(message) {
        if (this.useColor) {
            console.log(chalk.green('✓'), message);
        }
        else {
            console.log('✓', message);
        }
    }
    /**
     * Format error message
     */
    error(message) {
        if (this.useColor) {
            console.error(chalk.red('✗'), message);
        }
        else {
            console.error('✗', message);
        }
    }
    /**
     * Format warning message
     */
    warning(message) {
        if (this.useColor) {
            console.log(chalk.yellow('⚠'), message);
        }
        else {
            console.log('⚠', message);
        }
    }
    /**
     * Format info message
     */
    info(message) {
        if (this.useColor) {
            console.log(chalk.blue('ℹ'), message);
        }
        else {
            console.log('ℹ', message);
        }
    }
    /**
     * Format section header
     */
    header(text) {
        if (this.useColor) {
            console.log(chalk.bold.cyan(`\n${text}\n${'='.repeat(text.length)}`));
        }
        else {
            console.log(`\n${text}\n${'='.repeat(text.length)}`);
        }
    }
    /**
     * Format subsection header
     */
    subheader(text) {
        if (this.useColor) {
            console.log(chalk.bold(`\n${text}`));
        }
        else {
            console.log(`\n${text}`);
        }
    }
    /**
     * Format skill output based on configuration
     */
    skillOutput(output) {
        if (this.format === 'json') {
            console.log(JSON.stringify(output, null, 2));
        }
        else if (this.format === 'markdown') {
            this.formatMarkdown(output);
        }
        else {
            this.formatPlain(output);
        }
    }
    /**
     * Format as markdown
     */
    formatMarkdown(output) {
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
            output.constraints.forEach((c) => console.log(`- ${c}`));
            console.log();
        }
        if (output.tasks && output.tasks.length > 0) {
            this.subheader('Tasks');
            output.tasks.forEach((task, i) => {
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
                output.currentStep.actions.forEach((action) => {
                    console.log(`- ${action}`);
                });
                console.log();
            }
            if (output.currentStep.successCriteria && output.currentStep.successCriteria.length > 0) {
                this.subheader('Success Criteria');
                output.currentStep.successCriteria.forEach((criteria) => {
                    console.log(`- ${criteria}`);
                });
                console.log();
            }
        }
        if (output.nextSteps && output.nextSteps.length > 0) {
            this.subheader('Next Steps');
            output.nextSteps.forEach((step, i) => {
                console.log(`${i + 1}. ${step}`);
            });
            console.log();
        }
    }
    /**
     * Format as plain text
     */
    formatPlain(output) {
        if (typeof output === 'string') {
            console.log(output);
            return;
        }
        console.log(JSON.stringify(output, null, 2));
    }
    /**
     * Format metadata
     */
    metadata(data) {
        if (!data)
            return;
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
//# sourceMappingURL=output.js.map