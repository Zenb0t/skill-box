# Skillbox

A curated collection of reusable skills for LLM agents, following the [Claude Code Skill protocol](https://docs.claudecode.com/features/skills).

## Overview

Skillbox is a repository designed to document, organize, and share skills across projects. All skills are MIT licensed, making them freely usable in any project.

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

### 🛠️ Skill Creator
**File:** `skills/skill-creator.skill`

Meta-skill for creating new skills:
- Complete skill creation workflow and best practices
- Progressive disclosure design principles
- Bundled scripts for initialization, validation, and packaging
- Reference guides for workflows and output patterns
- Helper scripts to streamline skill development process

## Installation

### Installing Skills in Claude Code

To use these skills with Claude Code, you can install them using the skill installation feature:

```bash
# Install a specific skill
claude skill install /path/to/skillbox/skills/github-workflow.skill

# Or install all skills
claude skill install /path/to/skillbox/skills/*.skill
```

Alternatively, you can copy the `.skill` files to your Claude Code skills directory:

```bash
# On Windows
cp skills/*.skill %USERPROFILE%\.claude\skills\

# On macOS/Linux
cp skills/*.skill ~/.claude/skills/
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
├── skills/              # All skill files (.skill format)
│   ├── github-workflow.skill
│   ├── shadcn-ui-skill.skill
│   ├── skill-creator.skill
│   └── supabase-cli.skill
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
