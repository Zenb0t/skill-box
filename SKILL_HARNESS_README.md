# Skill Harness

A portable, tool-agnostic harness that encapsulates development methodology as callable skills. Any LLM interface can invoke these skills to apply consistent reasoning patterns, access project context, and execute structured workflows.

## Vision

The Skill Harness transforms development methodologies into reusable, executable skills. Instead of re-explaining planning approaches or debugging strategies to each LLM tool, you define the methodology once and invoke it anywhere.

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  Outer LLM (Claude Code, Cursor, etc.)                      │
│  - User interacts here                                      │
│  - Invokes skills via CLI or MCP                            │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  Skill Harness                                              │
│  - Loads methodology from markdown files                    │
│  - Gathers context from project (docs, guides, codebase)    │
│  - Calls LLM API with methodology + context                 │
│  - Returns structured output                                │
└─────────────────────────┬───────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────────┐
│  LLM API (Claude)                                           │
│  - Performs reasoning using provided methodology            │
│  - Has access to tools via harness                          │
└─────────────────────────────────────────────────────────────┘
```

## Quick Start

### Installation

```bash
# Install dependencies
bun install

# Build the project
bun run build

# Make CLI executable
chmod +x bin/skill

# (Optional) Link for global use
npm link
```

### Setup

1. Set your Anthropic API key:
```bash
export ANTHROPIC_API_KEY="your-api-key"
```

2. Verify installation:
```bash
./bin/skill list
```

### Your First Skill Invocation

```bash
./bin/skill plan "implement user authentication"
```

This will:
1. Load the `plan` skill methodology
2. Gather project context (README, docs, code structure)
3. Send methodology + context to Claude
4. Return a structured plan with tasks and first step

## Available Commands

```bash
# Invoke a skill
skill plan "your goal here"
skill plan "add dark mode" --context "src/,docs/" --verbose

# List available skills
skill list

# Show skill details
skill show plan

# Validate skill definitions
skill validate           # Validate all skills
skill validate plan      # Validate specific skill

# View context loading
skill context            # Show what context would load
skill context --verbose  # Show detailed file list

# View/modify config
skill config get
skill config get llm.model
skill config set llm.temperature 0.9
```

## Creating Skills

Skills are markdown files with YAML frontmatter:

```markdown
---
name: plan
description: Break down goals into tasks and iterative steps
inputs:
  - name: goal
    type: string
    required: true
    description: What we're trying to achieve
outputs:
  format: structured
  schema:
    goal: string
    tasks: array
    currentStep: object
tools:
  - read_file
  - list_directory
  - find_files
---

# Plan Methodology

## Purpose
Break down work into iterative, self-contained steps...

## Approach

### 1. Clarify the Goal
- What is the desired outcome?
- What does "done" look like?
...
```

Place skill files in `methodology/` directory.

## Configuration

Configuration is in `config/default.yaml`:

```yaml
llm:
  provider: anthropic
  model: claude-sonnet-4-20250514
  api_key_env: ANTHROPIC_API_KEY
  max_tokens: 8192
  temperature: 0.7

context:
  default_paths:
    - README.md
    - /docs
    - /guides
  max_file_size: 102400  # 100KB
  max_total_context: 51200  # 50KB

tools:
  shell:
    enabled: true
    allowed_commands:
      - git
      - npm
      - pnpm
    timeout: 30000

output:
  format: markdown  # markdown | json | plain
  color: true
  verbose: false
```

## Available Tools

Skills can use these tools to gather information:

### Filesystem
- `read_file` - Read file contents
- `write_file` - Write to files (requires sandbox permission)
- `list_directory` - List directory contents
- `find_files` - Find files matching glob patterns

### Git
- `git_diff` - Show git diff
- `git_log` - Show commit history
- `git_status` - Show working tree status

### Shell
- `run_command` - Execute shell commands (whitelist only)

## Built-in Skills

### plan
Break down goals into tasks and iterative steps.

**Example:**
```bash
skill plan "implement user authentication"
skill plan "refactor database layer"
```

**Output:** Structured plan with tasks, dependencies, and first actionable step.

## Project Structure

```
skill-harness/
├── bin/
│   └── skill                 # CLI executable
├── src/
│   ├── cli/                  # CLI interface
│   ├── core/                 # Core harness logic
│   │   ├── harness.ts        # Main orchestration
│   │   ├── methodology.ts    # Skill loader
│   │   ├── context.ts        # Context gatherer
│   │   ├── llm.ts            # LLM client
│   │   ├── config.ts         # Configuration
│   │   └── types.ts          # Type definitions
│   └── tools/                # Tool implementations
├── methodology/              # Skill definitions
│   ├── plan.md              # Planning skill
│   └── schemas/             # Validation schemas
├── config/                   # Configuration files
└── tests/                    # Tests
```

## How It Works

1. **Skill Definition**: Methodology stored as markdown with YAML frontmatter
2. **Context Gathering**: Automatically reads relevant project files
3. **LLM Invocation**: Sends methodology + context to Claude
4. **Tool Execution**: Claude can request tools (read files, run git, etc.)
5. **Structured Output**: Returns formatted results

## Advanced Usage

### Custom Context Paths

```bash
skill plan "goal" --context "src/auth,docs/auth.md"
```

### Working Directory

```bash
skill plan "goal" --cwd /path/to/project
```

### Verbose Output

```bash
skill plan "goal" --verbose
```

Shows token usage, duration, and tool call count.

### JSON Output

```bash
skill config set output.format json
skill plan "goal"
```

## Extending the Harness

### Adding New Tools

1. Create tool in `src/tools/`:
```typescript
export const myTool: Tool = {
  name: 'my_tool',
  description: 'Does something useful',
  parameters: [
    {
      name: 'input',
      type: 'string',
      description: 'Input parameter',
      required: true,
    },
  ],
  async execute(params, context) {
    // Implementation
    return {
      success: true,
      output: result,
      metadata: { duration: Date.now() - start },
    };
  },
};
```

2. Register in `src/tools/setup.ts`

### Adding New Skills

1. Create `methodology/my-skill.md`
2. Define frontmatter and methodology
3. Test: `skill validate my-skill`
4. Use: `skill my-skill "input"`

## Environment Variables

- `ANTHROPIC_API_KEY` - Required for LLM API calls

## Development

```bash
# Install dependencies
bun install

# Build
bun run build

# Watch mode
bun run dev

# Run tests
bun test

# Validate all skills
bun run validate
```

## Troubleshooting

### "API key not found"
Ensure `ANTHROPIC_API_KEY` is set in your environment.

### "Skill definition not found"
Check that the skill file exists in `methodology/` and has `.md` extension.

### "Invalid skill definition"
Run `skill validate <name>` to see specific errors.

### Build errors
Ensure all dependencies are installed: `bun install`

## Architecture Decisions

### Why Markdown + YAML?
- Human-readable and editable
- Version controllable
- Natural for documentation-heavy content
- Easy to review and iterate

### Why Inner LLM?
- Separates user interaction from reasoning
- Allows consistent methodology across tools
- Enables tool access in controlled manner

### Why Bun?
- Fast TypeScript execution
- Single binary distribution possible
- Modern JavaScript runtime

## Future Enhancements

- [ ] Skill composition (skills calling skills)
- [ ] Streaming output for long-running skills
- [ ] Skill marketplace/sharing
- [ ] Multi-model support
- [ ] MCP server implementation
- [ ] Session persistence
- [ ] Skill debugging mode

## License

MIT

## Contributing

Contributions welcome! Please:
1. Follow existing code style
2. Add tests for new features
3. Update documentation
4. Validate skills before committing

## Credits

Built with:
- [Anthropic Claude API](https://www.anthropic.com/)
- [Commander.js](https://github.com/tj/commander.js/)
- [Bun](https://bun.sh/)
