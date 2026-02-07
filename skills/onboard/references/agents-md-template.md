# AGENTS.md Template

## Guidelines

- Keep under 500 lines total
- Use progressive disclosure: brief in AGENTS.md, link to detailed docs
- Commands must be copy-pasteable
- Mark unknowns explicitly with `__________`
- Include a "Quick Start" section at the top for immediate usefulness

## Template

```markdown
# AGENTS.md

## Quick Start

```bash
# Verify everything works
./bin/verify --mode=quick

# Run full checks
./bin/verify --mode=full
```

## Overview

<1-2 sentence description of what this project does.>

- **Language**: <language>
- **Framework**: <framework>
- **Package Manager**: <manager>
- **Monorepo**: <Yes (tool) | No>

## Commands

### Build

```bash
<build command>
```

### Test

```bash
# Unit tests
<unit test command>

# E2E tests (if applicable)
<e2e command or __________>
```

### Lint & Format

```bash
# Lint
<lint command>

# Format check
<format command>

# Typecheck (if applicable)
<typecheck command>
```

### Development

```bash
# Start dev server
<dev command>

# Watch mode
<watch command or __________>
```

## Verification

Quick check (< 30s):
```bash
<lint command> && <typecheck command>
```

Full check:
```bash
<test command>
```

## Project Structure

```
<root>/
├── <dir>/     # <purpose>
├── <dir>/     # <purpose>
└── <file>     # <purpose>
```

## Conventions

- **Branching**: <branch strategy or __________>
- **Commits**: <commit convention or __________>
- **Code style**: <enforced by linter/formatter>
- **PR process**: <process or __________>

## Gotchas

- <Non-obvious things that trip people up>

## References

- <Link to detailed docs>
- <Link to architecture decision records>
```

## CLAUDE.md Shim

When a project uses CLAUDE.md instead of AGENTS.md, or when both should exist for compatibility:

```markdown
<!-- CLAUDE.md -->
<!-- This file provides Claude Code with project context. -->
<!-- Canonical source: AGENTS.md -->

See [AGENTS.md](./AGENTS.md) for full project documentation.

<!-- Key commands for quick reference: -->
<!-- Build: <command> -->
<!-- Test: <command> -->
<!-- Lint: <command> -->
<!-- Verify: ./bin/verify --mode=quick -->
```

## Progressive Disclosure Pattern

### Level 1 — AGENTS.md (< 500 lines)
What an AI agent needs to start working: commands, structure, conventions.

### Level 2 — Linked docs
Architecture details, API docs, design decisions. Referenced from AGENTS.md but not inlined.

### Level 3 — Code comments
Inline explanations for non-obvious logic. Discovered by reading source, not documented in AGENTS.md.

## Sections Reference

### Required Sections
- **Quick Start** — Immediate copy-paste commands
- **Overview** — What is this project
- **Commands** — Build, test, lint, dev
- **Project Structure** — Directory layout

### Recommended Sections
- **Verification** — Quick and full check commands
- **Conventions** — How the team works
- **Gotchas** — Non-obvious pitfalls

### Optional Sections
- **References** — Links to detailed docs
- **Dependencies** — Key external services
- **Environment** — Required env vars (names only, not values)
- **Deployment** — How to deploy
