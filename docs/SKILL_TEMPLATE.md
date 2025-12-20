# Skill Template

Use this template as a starting point for creating new skills. Replace the placeholder text with your skill's specific information.

## File: SKILL.md

```markdown
# [Skill Name]

> Brief one-line description of what this skill does

## Overview

A comprehensive description of the skill's purpose and capabilities. Explain:
- What problem does this skill solve?
- Who is the target user?
- When should this skill be used?

## Capabilities

List the main capabilities this skill provides:

### [Capability Category 1]
- Specific capability 1
- Specific capability 2
- Specific capability 3

### [Capability Category 2]
- Specific capability 1
- Specific capability 2

## Prerequisites

List any requirements or dependencies:

- **Required Tools**: [e.g., Node.js 18+, Python 3.9+]
- **Required Packages**: [e.g., npm, pip]
- **Environment**: [e.g., Git installed, API keys configured]
- **Knowledge**: [e.g., Basic understanding of React, Familiarity with SQL]

## Installation

Provide installation instructions if needed:

\`\`\`bash
# Example installation commands
npm install package-name
# or
pip install package-name
\`\`\`

## Usage Examples

### Example 1: [Common Use Case]

**Task**: [Describe what the user wants to accomplish]

**Input**:
\`\`\`
[Example user input or command]
\`\`\`

**Output**:
\`\`\`
[Expected output or result]
\`\`\`

**Explanation**: [Explain what happened and why]

### Example 2: [Another Use Case]

[Repeat the format above for each example]

### Example 3: [Advanced Use Case]

[Include at least one advanced or complex example]

## Reference Documentation

Link to relevant reference materials included with the skill:

- [Command Reference](references/commands.md) - Complete command reference
- [Templates](references/templates.md) - Code and file templates
- [Best Practices](references/best-practices.md) - Recommended patterns

## Limitations

Be honest about what the skill cannot do:

- Cannot handle [specific limitation]
- Not suitable for [specific scenario]
- Requires manual intervention for [specific case]

## Troubleshooting

Common issues and solutions:

### Issue: [Common Problem]
**Symptoms**: [How users will recognize this issue]
**Solution**: [Steps to resolve]

### Issue: [Another Problem]
**Symptoms**: [Description]
**Solution**: [Resolution steps]

## Related Skills

List skills that complement or extend this one:

- **[skill-name]** - [How it relates]
- **[another-skill]** - [How it relates]

## Version History

- **1.0.0** (YYYY-MM-DD) - Initial release
  - [List of initial capabilities]

## Contributing

Contributions welcome! See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

## License

This skill is licensed under the MIT License - see [LICENSE.txt](LICENSE.txt) for details.

## Resources

External resources and documentation:

- [Official Documentation](https://example.com/docs)
- [API Reference](https://example.com/api)
- [Community Forums](https://example.com/community)
```

## File: LICENSE.txt

```
MIT License

Copyright (c) [YEAR] [Your Name]

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## Directory Structure Example

```
my-skill/
├── SKILL.md                    # Main skill definition (use template above)
├── LICENSE.txt                 # MIT License
├── references/                 # Reference documentation
│   ├── commands.md            # Command reference
│   ├── examples.md            # Extended examples
│   ├── templates.md           # Code templates
│   └── best-practices.md      # Best practices guide
├── assets/                     # Optional assets
│   ├── templates/             # File templates
│   │   ├── config.json
│   │   └── setup.sh
│   └── images/                # Screenshots or diagrams
│       └── workflow.png
└── scripts/                    # Optional automation scripts
    ├── init.sh                # Initialization script
    └── validate.py            # Validation script
```

## Reference Documentation Templates

### references/commands.md

```markdown
# Command Reference

## [Command Category 1]

### \`command-name\`

**Description**: What this command does

**Syntax**:
\`\`\`
command-name [options] <required-arg> [optional-arg]
\`\`\`

**Options**:
- \`-f, --flag\` - Description of flag
- \`-o, --option <value>\` - Description of option

**Examples**:
\`\`\`bash
command-name --flag argument
\`\`\`

## [Command Category 2]

[Repeat for each command]
```

### references/templates.md

```markdown
# Templates

## [Template Category]

### Template Name

**Description**: What this template is for

**Template**:
\`\`\`language
// Template code here
\`\`\`

**Placeholders**:
- \`{{PLACEHOLDER1}}\` - Description
- \`{{PLACEHOLDER2}}\` - Description

**Example Usage**:
\`\`\`language
// Filled-in example
\`\`\`
```

### references/best-practices.md

```markdown
# Best Practices

## [Practice Category]

### Practice 1: [Name]

**Why**: Explanation of why this is important

**How**: Step-by-step guidance

**Example**:
\`\`\`
[Code example demonstrating the practice]
\`\`\`

### Practice 2: [Name]

[Repeat format]

## Anti-Patterns

### Anti-Pattern 1: [Name]

**Problem**: What's wrong with this approach

**Instead**: What to do instead

**Example**:
\`\`\`
// Bad
[Anti-pattern example]

// Good
[Correct approach]
\`\`\`
```

## Tips for Creating Effective Skills

1. **Be Specific**: Focus on a clear, well-defined problem space
2. **Provide Context**: Help users understand when and why to use the skill
3. **Include Examples**: Real-world examples are more valuable than abstract descriptions
4. **Test Thoroughly**: All examples should be tested and working
5. **Document Edge Cases**: Explain limitations and special scenarios
6. **Keep It Updated**: Plan to maintain the skill as tools evolve
7. **Use Clear Language**: Write for your target audience's skill level
8. **Organize Logically**: Structure information from simple to complex
9. **Link Resources**: Point to official docs and related skills
10. **Version Carefully**: Track changes and breaking updates

## Validation Checklist

Before submitting your skill, verify:

- [ ] SKILL.md follows the template structure
- [ ] All examples are tested and working
- [ ] Prerequisites are clearly documented
- [ ] Limitations are honestly described
- [ ] LICENSE.txt is included
- [ ] Reference documentation is complete
- [ ] No secrets or API keys are included
- [ ] Formatting is consistent
- [ ] Links are valid
- [ ] Skill is packaged as a .skill file

## Next Steps

1. Create your skill directory: `mkdir -p skills/CATEGORY/your-skill`
2. Copy this template to your skill's SKILL.md
3. Fill in all sections with your skill's information
4. Add reference documentation in `references/`
5. Test thoroughly in Claude Code
6. Package as a .skill file
7. Submit a pull request

---

Need help? Check out the [skill-creator](../skills/meta-tools/skill-creator.skill) meta-tool or open an issue!
