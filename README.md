# Skillbox

A curated collection of reusable skills for LLM agents, following the [Claude Code Skill protocol](https://docs.claudecode.com/features/skills).

## Overview

Skillbox is a repository designed to document, organize, and share skills across projects. All skills are MIT licensed, making them freely usable in any project.

## Quick Download

| Skill | Claude (.skill) | ZIP |
|-------|-----------------|-----|
| GitHub Workflow | [github-workflow.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/github-workflow.skill) | — |
| shadcn/ui | [shadcn-ui-skill.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/shadcn-ui-skill.skill) | — |
| Supabase CLI | [supabase-cli.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/supabase-cli.skill) | — |
| Codebase Onboarding | [onboard.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/onboard.skill) | [onboard.zip](https://github.com/Zenb0t/skill-box/releases/latest/download/onboard.zip) |
| Verification Workflow | [verify.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/verify.skill) | [verify.zip](https://github.com/Zenb0t/skill-box/releases/latest/download/verify.zip) |
| Skill Creator | [skill-creator.skill](https://github.com/Zenb0t/skill-box/releases/latest/download/skill-creator.skill) | — |
| **All Skills** | [all-skills.zip](https://github.com/Zenb0t/skill-box/releases/latest/download/all-skills.zip) | — |

## Available Skills

### 🔄 GitHub Workflow
**File:** `skills/github-workflow.skill`

Provides comprehensive GitHub workflow support including:
- Conventional commits standards
- Pull request templates and best practices
- GitHub Actions workflow patterns
- Code review guidelines

### 🎨 shadcn/ui
**File:** `skills/shadcn-ui-skill.skill`

Complete shadcn/ui component library integration:
- Component catalog and usage patterns
- Form building with React Hook Form + Zod
- Data table implementations
- Project structure templates
- Styling and theming guidance

### 🗄️ Supabase CLI
**File:** `skills/supabase-cli.skill`

Supabase command-line interface expertise:
- Database management commands
- Migration workflows
- Authentication setup
- Edge functions deployment
- Local development setup

### 🔍 Codebase Onboarding (onboard)
**Directory:** `skills/onboard/`

Automated codebase onboarding that generates or augments AGENTS.md files:
- Detects existing AGENTS.md/CLAUDE.md and selects operating mode (create/augment/migrate/reconcile)
- Identifies project ecosystem, frameworks, and tooling
- Discovers and validates build/test/lint commands with tiered safety
- Creates `./bin/verify` scripts for quick and full verification
- Handles monorepo structures with nested documentation
- Surfaces unknowns as checkboxes for human input

### ✅ Verification Workflow (verify)
**Directory:** `skills/verify/`

Structured verification before commits and PRs:
- Classifies change types (refactor, feature, bug fix, security, etc.)
- Selects appropriate verification ladder based on risk level
- Generates evidence bundles with pass/fail/gap reporting
- Detects and integrates with existing PR templates
- Handles stop conditions (test failures, missing coverage)
- Outputs PR-ready verification summaries

### 🛠️ Skill Creator
**File:** `skills/skill-creator.skill`

Meta-skill for creating new skills:
- Complete skill creation workflow and best practices
- Progressive disclosure design principles
- Bundled scripts for initialization, validation, and packaging
- Reference guides for workflows and output patterns
- Helper scripts to streamline skill development process

## Installation

### Download and Install

1. Download a `.skill` file from the [Quick Download](#quick-download) table above or the [latest release](https://github.com/Zenb0t/skill-box/releases/latest).

2. Install the downloaded skill:

```bash
claude skill install ./github-workflow.skill
```

### Installing from a Local Clone

If you've cloned this repo, you can install skills directly:

```bash
# Install a specific skill
claude skill install /path/to/skillbox/skills/github-workflow.skill

# Or install all skills
claude skill install /path/to/skillbox/skills/*.skill
```

### Manual Installation

Copy `.skill` files to your Claude Code skills directory:

```bash
# On macOS/Linux
cp skills/*.skill ~/.claude/skills/

# On Windows
cp skills/*.skill %USERPROFILE%\.claude\skills\
```

### Using Skills

Once installed, you can invoke skills in your conversations with Claude Code:

```
/github-workflow - Access GitHub workflow patterns
/shadcn-ui - Get shadcn/ui component help
/supabase-cli - Use Supabase CLI commands
/skill-creator - Create new skills with best practices
```

## Repository Structure

```
skillbox/
├── skills/              # All skill files
│   ├── github-workflow.skill
│   ├── onboard/             # Unpacked skill (SKILL.md + references/)
│   ├── shadcn-ui-skill.skill
│   ├── skill-creator.skill
│   ├── supabase-cli.skill
│   └── verify/              # Unpacked skill (SKILL.md + references/)
├── LICENSE             # MIT License
└── README.md           # This file
```

## Skill Format

Skills follow the Claude Code skill protocol, packaged as `.skill` files (ZIP archives) containing:
- `SKILL.md` - Main skill documentation and instructions (required)
- `scripts/` - Executable code for deterministic tasks (optional)
- `references/` - Reference materials and examples (optional)
- `assets/` - Templates, code snippets, and other resources (optional)

## Contributing

Contributions are welcome! To add a new skill:

1. Fork this repository
2. Create your skill following the skill protocol format
3. Place it in the `skills/` directory
4. Update this README with skill details
5. Submit a pull request

### Skill Guidelines

- Follow the Claude Code skill protocol structure
- Include comprehensive documentation
- Provide practical examples and templates
- Use clear, concise language
- Test the skill before submitting

## License

All skills in this repository are licensed under the MIT License. See [LICENSE](LICENSE) for details.

## Resources

- [Claude Code Documentation](https://docs.claudecode.com)
- [Skill Development Guide](https://docs.claudecode.com/features/skills)
- [Agente SDK](https://github.com/anthropics/agente)

## About

Created and maintained by [@Zenb0t](https://github.com/Zenb0t)

---

**Note:** These skills are designed for use with Claude Code and compatible LLM agent frameworks that support the skill protocol.
