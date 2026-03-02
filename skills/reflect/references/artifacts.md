# Artifact Classification Guide

Detailed guidance for choosing the right artifact type for each learning.

## CLAUDE.md Entry

**Best for**: Project conventions, coding patterns, architectural decisions,
tool preferences, build commands, environment setup.

**Examples**:
- "Always use pnpm, not npm" -> CLAUDE.md
- "Tests go in __tests__/ co-located with source" -> CLAUDE.md
- "Use the logger module, not console.log" -> CLAUDE.md
- "API responses always use camelCase" -> CLAUDE.md

**Format**: Add to the appropriate section of CLAUDE.md. If no relevant
section exists, create one. Keep entries to 1-2 lines.

**When to amend**: If CLAUDE.md already has a related entry (e.g., a "Testing"
section), amend it rather than creating a duplicate section.

## Memory File

**Best for**: Cross-session learnings that are specific to the user's personal
workflow or the agent's interaction patterns, not project-wide conventions.

**Examples**:
- "User prefers seeing a plan before implementation" -> memory
- "This codebase has a non-obvious circular dependency between X and Y" -> memory
- "User wants commits grouped by feature, not by file" -> memory

**Location**: `.claude/` memory directory. Use topic-based files (e.g.,
`debugging.md`, `preferences.md`). Check existing files before creating new ones.

## Skill

**Best for**: Multi-step procedures that the agent should follow the same way
every time. Only propose a skill when the learning involves a **workflow**
(3+ steps), not a single rule.

**Examples**:
- "When deploying, always run tests, then build, then deploy to staging first" -> skill
- "When creating a new API endpoint, follow this 5-step process" -> skill

**Do not propose a skill for**: Simple preferences, single rules, or
conventions — those belong in CLAUDE.md.

## Settings Suggestion (.claude/settings.json)

**Best for**: Repeated tool permission patterns observed during the conversation.

**Examples**:
- User approved Bash `npm test` every time -> suggest adding to allowedTools
- User denied all Write operations to a specific directory -> note the pattern

**Important**: Always present the exact JSON change and get explicit user
approval. Settings changes affect security boundaries.

**Format**:
```json
{
  "permissions": {
    "allow": ["Bash(npm test)", "Bash(npm run build)"]
  }
}
```

## Project Documentation

**Best for**: Team-wide conventions that should be shared with other developers,
not just the agent. Things that belong in CONTRIBUTING.md, README, or similar.

**Examples**:
- "PRs require at least one approval from the platform team" -> CONTRIBUTING.md
- "The staging environment URL is X" -> README or docs/

**When to choose project docs over CLAUDE.md**: If the knowledge benefits
human developers too, it belongs in project docs. If it only helps the agent,
use CLAUDE.md.

## Lint Rule

**Best for**: Code patterns that are statically detectable and should be
enforced at build time. The learning must be about a pattern that can be
caught by a linter.

**Examples**:
- "Never use console.log in production code" -> ESLint no-console rule
- "Always use strict equality (===)" -> ESLint eqeqeq rule
- "Import order must be: external, internal, relative" -> ESLint import/order

**When to choose lint over CLAUDE.md**: If the pattern is mechanically
detectable and the cost of forgetting is high. If it requires judgment or
context to apply, use CLAUDE.md instead.

**Propose adding/configuring the lint rule** rather than writing a custom one,
unless no existing rule covers the pattern.
