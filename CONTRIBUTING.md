# Contributing to Skill Box

Thank you for your interest in contributing to Skill Box! This guide will help you create and submit new skills to the repository.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
- [Skill Development Guidelines](#skill-development-guidelines)
- [Submission Process](#submission-process)
- [Skill Quality Standards](#skill-quality-standards)

## Code of Conduct

By participating in this project, you agree to maintain a respectful and collaborative environment for all contributors.

## How Can I Contribute?

### Adding a New Skill

1. **Check existing skills** - Make sure your skill doesn't duplicate existing functionality
2. **Choose the right category** - Place your skill in the appropriate directory:
   - `skills/development/` - Development tools and workflows
   - `skills/infrastructure/` - Backend and infrastructure tools
   - `skills/ui-components/` - Frontend and UI libraries
   - `skills/meta-tools/` - Skill creation and management tools
3. **Follow the template** - Use [docs/SKILL_TEMPLATE.md](docs/SKILL_TEMPLATE.md) as a starting point
4. **Test thoroughly** - Ensure your skill works in Claude Code
5. **Submit a PR** - Follow the submission process below

### Improving Existing Skills

- Fix bugs or outdated information
- Add new capabilities or examples
- Improve documentation
- Update dependencies or references

### Suggesting New Categories

If you have an idea for a new skill category:
1. Open an issue describing the category
2. Provide examples of skills that would fit
3. Explain why it deserves its own category

## Skill Development Guidelines

### Directory Structure

Each skill should follow this structure:

```
skill-name/
├── SKILL.md              # Main skill definition (REQUIRED)
├── LICENSE.txt           # License (REQUIRED - use MIT)
├── references/           # Reference documentation (RECOMMENDED)
│   ├── commands.md       # Command reference
│   ├── examples.md       # Usage examples
│   └── templates.md      # Code templates
├── assets/              # Optional assets
│   └── templates/       # File templates
└── scripts/             # Optional automation scripts
```

### SKILL.md Format

Your `SKILL.md` file must include:

1. **Title and Description**
   - Clear, concise title
   - Brief description of capabilities

2. **Capabilities Section**
   - List what the skill can do
   - Be specific and actionable

3. **Usage Examples**
   - Provide real-world scenarios
   - Include expected inputs and outputs

4. **Prerequisites**
   - List any required tools or dependencies
   - Include installation instructions

5. **Limitations**
   - Document what the skill cannot do
   - Set clear expectations

### Best Practices

#### DO:
- ✅ Use clear, descriptive skill names
- ✅ Provide comprehensive examples
- ✅ Include error handling guidance
- ✅ Document prerequisites and dependencies
- ✅ Test all examples before submitting
- ✅ Follow the Agente Skill protocol
- ✅ Include reference documentation
- ✅ Use consistent formatting

#### DON'T:
- ❌ Duplicate existing skill functionality
- ❌ Include proprietary or copyrighted content
- ❌ Make claims about capabilities that don't work
- ❌ Skip testing your skill
- ❌ Use offensive or inappropriate language
- ❌ Include secrets or API keys
- ❌ Create overly broad or unfocused skills

## Submission Process

### 1. Fork and Clone

```bash
# Fork the repository on GitHub
# Then clone your fork
git clone https://github.com/YOUR-USERNAME/skill-box.git
cd skill-box
```

### 2. Create a Branch

```bash
# Create a descriptive branch name
git checkout -b add-skill-name
```

### 3. Develop Your Skill

```bash
# Create your skill directory
mkdir -p skills/CATEGORY/skill-name

# Add your files
# - SKILL.md
# - LICENSE.txt
# - references/ (if applicable)
# - assets/ (if applicable)
```

### 4. Package Your Skill

```bash
# Navigate to your skill directory
cd skills/CATEGORY/skill-name

# Create a .skill archive (ZIP file)
zip -r ../skill-name.skill . -x "*.git*" -x "*.DS_Store"

# Return to repo root
cd ../../..
```

### 5. Update Documentation

- Add your skill to the main [README.md](README.md)
- Update the category README in `skills/CATEGORY/README.md`
- Include usage examples and descriptions

### 6. Test Your Skill

1. Upload the `.skill` file to Claude Code
2. Test all documented capabilities
3. Verify examples work as described
4. Check for edge cases and errors

### 7. Commit and Push

```bash
# Stage your changes
git add .

# Commit with a descriptive message
git commit -m "Add skill-name skill for [purpose]"

# Push to your fork
git push origin add-skill-name
```

### 8. Create Pull Request

1. Go to the original repository on GitHub
2. Click "New Pull Request"
3. Select your branch
4. Fill out the PR template:
   - Describe the skill and its purpose
   - List testing steps you performed
   - Mention any dependencies or prerequisites
   - Include screenshots or examples if helpful

## Skill Quality Standards

### Required Elements

- [ ] Skill follows the directory structure
- [ ] SKILL.md is complete and well-formatted
- [ ] LICENSE.txt is included (MIT)
- [ ] Skill is packaged as a .skill file
- [ ] Category README is updated
- [ ] Main README is updated
- [ ] All examples are tested and working
- [ ] Documentation is clear and comprehensive

### Review Criteria

Your skill will be reviewed for:

1. **Functionality** - Does it work as described?
2. **Documentation** - Is it clear and complete?
3. **Uniqueness** - Does it add value without duplicating existing skills?
4. **Quality** - Is the code/content well-organized and maintainable?
5. **Testing** - Have all capabilities been tested?
6. **Protocol Compliance** - Does it follow the Agente Skill protocol?

## Getting Help

- **Questions?** Open an issue with the `question` label
- **Bug Reports** Open an issue with the `bug` label
- **Feature Requests** Open an issue with the `enhancement` label
- **Discussions** Use GitHub Discussions for general topics

## Recognition

Contributors will be recognized in:
- The repository's contributors list
- Release notes when skills are published
- The project README (for significant contributions)

## License

By contributing to Skill Box, you agree that your contributions will be licensed under the MIT License.

---

Thank you for helping make Skill Box better! 🚀
