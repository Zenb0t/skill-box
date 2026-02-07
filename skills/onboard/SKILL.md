# Codebase Onboarding (onboard)

Generate or augment an AGENTS.md file and a `./bin/verify` script for any codebase. This skill scans the project, discovers tooling, validates commands, and produces documentation that helps AI agents (and humans) work effectively in the repo.

## Trigger

Use this skill when:
- Entering a new codebase for the first time
- A repo has no AGENTS.md or CLAUDE.md
- Existing AGENTS.md may be stale or incomplete
- Setting up a monorepo with multiple packages

## Workflow

### Step 1: Detect Existing Documentation

Scan for existing agent documentation files:

```
Check (in order):
1. ./AGENTS.md
2. ./CLAUDE.md
3. **/AGENTS.md (nested, for monorepos)
4. **/CLAUDE.md (nested)
```

Select operating mode based on findings:

| Found | Mode | Action |
|-------|------|--------|
| Nothing | **Create** | Generate AGENTS.md from scratch |
| AGENTS.md at root | **Augment** | Discover gaps, propose additions |
| Multiple AGENTS.md | **Map & Augment** | Handle each level in monorepo |
| CLAUDE.md only | **Migrate** | Create AGENTS.md from CLAUDE.md content |
| Both AGENTS.md + CLAUDE.md | **Reconcile** | Check consistency, flag conflicts |

### Step 2: Detect Project Type

Identify the ecosystem by checking for marker files. Reference: `references/ecosystems.md`

Check in this order:
1. **Package/manifest files** — `package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`, `pom.xml`, `*.csproj`
2. **Lock files** — `pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `Cargo.lock`, `poetry.lock`, `uv.lock`
3. **Config files** — `tsconfig.json`, `setup.cfg`, `build.gradle`, `.tool-versions`
4. **CI files** — `.github/workflows/`, `.gitlab-ci.yml`, `Jenkinsfile`

For monorepos, also check: `pnpm-workspace.yaml`, `nx.json`, `turbo.json`, `lerna.json`
Reference: `references/monorepo-patterns.md`

### Step 3: Discover Commands

Extract commands from project configuration. Use tiered safety levels:

**Tier 1 — Safe (read-only, always run):**
- Parse `package.json` scripts, `Makefile` targets, `Cargo.toml` metadata
- Read CI workflow files for command sequences
- Check for `./bin/verify`, `./scripts/`, `Makefile`

**Tier 2 — Safe to probe (no side effects):**
- `<pkg-manager> run --list` or equivalent
- `make -n <target>` (dry run)
- Check tool versions: `node -v`, `python3 --version`, etc.

**Tier 3 — Requires confirmation:**
- Running test suites
- Running build commands
- Running linters (may auto-fix)

> **Rule**: Never run Tier 3 commands without user confirmation. Always ask first.

### Step 4: Validate Existing Documentation (Augment/Reconcile modes)

When AGENTS.md already exists:

1. **Parse** — Extract all documented commands, structure descriptions, conventions
2. **Cross-reference** — Compare documented commands against discovered commands
3. **Validate** — Run Tier 1 and Tier 2 checks to verify documented commands exist
4. **Report**:
   - Commands documented but not found → flag as potentially broken
   - Commands discovered but not documented → suggest additions
   - Missing sections (e.g., no test commands, no structure overview) → suggest additions

Output a discovery report:

```markdown
## Discovery Report

### Existing AGENTS.md Analysis
- Location: `./AGENTS.md`
- Lines: <count>
- Sections found: <list>

### Validation Results
| Documented Command | Status | Notes |
|-------------------|--------|-------|
| `<command>` | ✓ Works | <details> |
| `<command>` | ✗ Not found | <details> |

### Suggested Additions
<diff format showing proposed additions>

### Unknowns
- [ ] <item>: `__________` (context about what was detected but not resolved)
```

### Step 5: Generate or Update AGENTS.md

Use the template from `references/agents-md-template.md`.

**For Create mode:** Generate the full file.
**For Augment mode:** Propose additions as a diff — never overwrite silently.
**For Migrate mode:** Transform CLAUDE.md content into AGENTS.md format, preserving all information.
**For Reconcile mode:** Flag conflicts between AGENTS.md and CLAUDE.md, suggest resolution.

Include a verification section in the generated AGENTS.md:

```markdown
### Verification
Evidence storage: `<path>` <!-- used by verify skill -->
```

Keep AGENTS.md under 500 lines. Use progressive disclosure — link to detailed docs rather than inlining everything.

### Step 6: Create or Detect Verify Script

Check if `./bin/verify` (or equivalent) already exists.

- If **missing**: Create one using templates from `references/verify-script.md`
- If **exists**: Validate it works, document it in AGENTS.md

The verify script should support:
- `--mode=quick` — lint + typecheck (< 30s target)
- `--mode=full` — lint + typecheck + test (complete verification)
- `--scope=<path>` — limit to specific package/directory (monorepos)

### Step 7: Output Summary

Present the user with:
1. What was detected (ecosystem, tools, structure)
2. What was generated/updated (AGENTS.md, verify script)
3. What remains unknown (checkboxes for user to fill in)
4. Suggested next steps

```markdown
## Onboarding Complete

### Detected
- **Ecosystem**: Node.js (pnpm)
- **Framework**: Next.js 14
- **Testing**: Vitest
- **Monorepo**: Yes (pnpm workspaces, 4 packages)

### Generated
- [x] `AGENTS.md` — created (142 lines)
- [x] `./bin/verify` — created (supports --mode and --scope)

### Needs Your Input
- [ ] E2E test command: `__________` (detected Playwright config but no script)
- [ ] Deploy command: `__________` (CI deploys but no local command found)
- [ ] Secrets/env setup: `__________` (found .env.example but unclear requirements)
- [ ] Verification evidence directory: `__________` (default: `docs/verification/`, can be gitignored)

### Next Steps
1. Review generated AGENTS.md and fill in unknowns
2. Run `./bin/verify --mode=full` to validate setup
3. Consider adding the `verify` skill for ongoing verification workflows
```

## Important Rules

1. **Never overwrite existing files without showing the diff first**
2. **Never run test/build/lint commands without asking** — these are Tier 3
3. **Always surface unknowns as checkboxes** — don't guess, don't hallucinate
4. **Keep AGENTS.md under 500 lines** — link to docs for details
5. **Verify script must be idempotent** — safe to run repeatedly
6. **Ask the user about testing** — most codebases have tests defined; ask what they want validated
