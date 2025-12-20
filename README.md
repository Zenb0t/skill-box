# Skill Box

> A curated collection of AI agent skills for Claude Code and other LLMs, following the Agente Skill protocol.

## Overview

Skill Box is an organized repository of custom skills that enhance AI agents with specialized capabilities. These skills enable AI assistants to perform complex tasks across development, infrastructure, UI design, and more.

## Available Skills

### 🛠️ Development Tools
Located in `skills/development/`

- **github-workflow** - GitHub workflow automation and CI/CD management
  - Create and manage GitHub Actions workflows
  - Handle pull requests and issues
  - Follow conventional commit standards

### 🏗️ Infrastructure
Located in `skills/infrastructure/`

- **supabase-cli** - Supabase database and backend management
  - Database migrations and management
  - Authentication setup
  - Real-time subscriptions
  - Edge functions

### 🎨 UI Components
Located in `skills/ui-components/`

- **shadcn-ui** - Modern UI component library integration
  - Component installation and configuration
  - Form building with validation
  - Data tables and complex UI patterns
  - Tailwind CSS integration

### 🧪 Testing
Located in `skills/testing/`

- **tdd-workflow** - Test-Driven Development workflow and test generation
  - Read plans and generate test cases
  - Support for multiple languages and frameworks
  - TDD Red-Green-Refactor cycle
  - Test scaffolding and best practices
  - Edge case identification

- **vitest-tdd** - Specialized TDD for Vitest framework
  - Vitest-specific test generation
  - React, Vue, Svelte component testing
  - Advanced mocking with vi utilities
  - Snapshot testing patterns
  - Vite integration and optimization

### 🔧 Meta Tools
Located in `skills/meta-tools/`

- **skill-creator** - Create new skills following best practices
  - Skill scaffolding and structure
  - Template generation
  - Validation and packaging

## Installation

### For Claude Code (Web)

1. Navigate to Settings → Skills
2. Click "Add Skill"
3. Upload the `.skill` file from this repository
4. The skill will be available immediately

### For Claude Code CLI

```bash
# Install a specific skill
claude skill install /path/to/skill-box/skills/development/github-workflow.skill

# Or install multiple skills
claude skill install /path/to/skill-box/skills/**/*.skill
```

### Manual Installation

```bash
# Copy to Claude Code skills directory
# On Windows
cp skills/**/*.skill %USERPROFILE%\.claude\skills\

# On macOS/Linux
cp skills/**/*.skill ~/.claude/skills/
```

### For Local Development

```bash
# Clone the repository
git clone https://github.com/Zenb0t/skill-box.git
cd skill-box

# Skills are packaged as .skill files (ZIP archives)
# Extract a skill to examine its contents:
unzip skills/development/github-workflow.skill -d extracted/
```

## Repository Structure

```
skill-box/
├── README.md                          # This file
├── CONTRIBUTING.md                    # How to contribute new skills
├── docs/
│   └── SKILL_TEMPLATE.md             # Template for creating new skills
├── skills/
│   ├── development/                   # Development tools and workflows
│   │   ├── README.md
│   │   └── github-workflow.skill
│   ├── infrastructure/                # Backend and infrastructure tools
│   │   ├── README.md
│   │   └── supabase-cli.skill
│   ├── ui-components/                 # Frontend and UI libraries
│   │   ├── README.md
│   │   └── shadcn-ui-skill.skill
│   ├── testing/                       # Testing and TDD tools
│   │   ├── README.md
│   │   ├── tdd-workflow.skill
│   │   └── vitest-tdd.skill
│   └── meta-tools/                    # Tools for creating and managing skills
│       ├── README.md
│       └── skill-creator.skill
└── LICENSE
```

## Usage

Once a skill is installed, you can invoke it by using the skill name in your conversation with Claude:

```
/skill github-workflow
```

Or simply mention the task related to the skill, and Claude will automatically use the appropriate skill when needed.

## Creating New Skills

Want to add your own skill to the collection? Check out:

1. **[CONTRIBUTING.md](CONTRIBUTING.md)** - Guidelines for contributing
2. **[docs/SKILL_TEMPLATE.md](docs/SKILL_TEMPLATE.md)** - Skill template and structure
3. **skill-creator skill** - Use the meta-tool to scaffold new skills

### Quick Start

```bash
# Use the skill-creator skill to generate a new skill
# This will create the proper directory structure and files
```

## Skill Categories

Skills are organized into categories for easy discovery and management:

- **development/** - Git, CI/CD, code quality tools
- **infrastructure/** - Databases, cloud services, DevOps tools
- **ui-components/** - UI libraries, design systems, component frameworks
- **testing/** - Test-Driven Development, testing frameworks, quality assurance
- **meta-tools/** - Tools for managing and creating skills

## Contributing

We welcome contributions! Whether you want to:

- Add a new skill
- Improve existing skills
- Fix bugs or documentation
- Suggest new categories

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

All skills in this repository are MIT licensed, making them freely usable in any project.

## Resources

- [Agente Skill Protocol](https://github.com/anthropics/claude-code) - Official skill specification
- [Claude Code Documentation](https://docs.anthropic.com/claude/docs) - Claude Code guides
- [Claude Code Skill Development](https://docs.claudecode.com/features/skills) - Skill development guide

## Roadmap

Future skill categories we're planning to add:

- **data-science/** - Data analysis, ML, visualization tools
- **security/** - Security scanning, auditing, best practices
- **documentation/** - API docs, code documentation tools
- **deployment/** - Deployment automation, container management
- **api-development/** - API design, documentation, testing tools

---

**Made with ❤️ for the AI agent community**
