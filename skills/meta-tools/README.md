# Meta Tools

Skills for creating, managing, and validating other skills. These are tools that help you build and maintain the skill ecosystem.

## Available Skills

### skill-creator

A comprehensive tool for creating new skills following best practices and the Agente Skill protocol.

**Capabilities:**
- Skill scaffolding and directory structure generation
- Template creation for SKILL.md files
- Reference documentation organization
- Validation of skill structure and format
- Packaging skills into .skill archives
- Best practices enforcement

**Use Cases:**
- Creating a new skill from scratch
- Validating existing skill structure
- Packaging skills for distribution
- Following skill protocol standards

**Installation:**
```bash
# Upload skill-creator.skill to Claude Code via Settings → Skills
```

**Usage Examples:**
- "Create a new skill for TypeScript project setup"
- "Validate my custom skill structure"
- "Package my skill for distribution"
- "Generate a skill template with best practices"

## Skill Creation Workflow

1. **Initialize**: Use skill-creator to scaffold basic structure
2. **Define**: Write the SKILL.md with capabilities and examples
3. **Document**: Add reference materials and guides
4. **Validate**: Check structure and format compliance
5. **Package**: Create .skill archive for distribution
6. **Test**: Verify skill works in Claude Code

## Skill Structure

A well-formed skill includes:
```
skill-name/
├── SKILL.md              # Main skill definition
├── LICENSE.txt           # License information
├── references/           # Reference documentation
│   ├── guides.md
│   └── examples.md
├── assets/              # Optional assets
│   └── templates/
└── scripts/             # Optional automation scripts
```

## Future Skills

Planned additions to this category:
- **skill-validator** - Automated skill validation and testing
- **skill-docs** - Documentation generator for skills
- **skill-marketplace** - Skill discovery and sharing platform
- **skill-updater** - Automatic skill version management

## Contributing

Have a meta-tool skill to add? See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.
