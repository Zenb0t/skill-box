# Verification Workflow (verify)

Run structured verification before committing or opening a PR. This skill classifies the change type, selects the appropriate verification level, generates evidence, and integrates with existing PR templates.

## Trigger

Use this skill when:
- About to commit or push a meaningful change
- Preparing a pull request
- Asked to verify that changes don't break anything
- After completing a feature or bug fix

## Workflow

### Step 1: Classify the Change

Determine what type of change was made. Reference: `references/change-types.md`

| Change Type | Description | Verification Level |
|-------------|-------------|-------------------|
| **Refactor** | Behavior-preserving restructuring | High — prove nothing changed |
| **Feature** | New functionality | Medium — prove it works |
| **Bug fix** | Correcting broken behavior | Medium — prove fix + no regression |
| **Dependency** | Upgrading/adding dependencies | High — prove nothing broke |
| **Config** | Build/CI/tooling changes | Medium — prove tools still work |
| **Docs** | Documentation only | Low — lint/format check |
| **Security** | Auth, crypto, input validation | Critical — full suite + manual review |
| **Performance** | Optimization changes | High — prove correctness + measure |

If the change spans multiple types, use the highest verification level among them.

### Step 2: Select Verification Ladder

Based on the change type, determine which checks to run. Each ladder is cumulative — higher levels include everything below.

**Low (docs, minor config):**
- Lint
- Format check

**Medium (features, bug fixes):**
- Lint + format
- Typecheck
- Unit tests (related to changed files)

**High (refactors, dependency upgrades):**
- Lint + format
- Typecheck
- Full test suite
- Build verification

**Critical (security-sensitive):**
- All of the above
- Manual review checklist
- Security-specific checks (if available)

### Step 3: Run Verification

Execute checks using the project's verify script or individual commands.

**Prefer `./bin/verify`** if it exists:
```bash
# For Low/Medium
./bin/verify --mode=quick

# For High/Critical
./bin/verify --mode=full
```

**Otherwise**, run commands individually from AGENTS.md.

**Capture evidence** for each check:
- Command run
- Exit code
- Summary of output (pass count, error count)
- Duration

### Step 4: Generate Evidence Bundle

Produce a structured verification report. Reference: `references/evidence-format.md`

```markdown
## Verification Evidence

### Context
- **Change**: <brief description>
- **Type**: <change type>
- **Level**: <Low | Medium | High | Critical>
- **Files changed**: <count>

### Checks Performed
| Check | Command | Result | Duration |
|-------|---------|--------|----------|
| Lint | `pnpm lint` | ✓ Pass | 3.2s |
| Typecheck | `pnpm typecheck` | ✓ Pass | 8.1s |
| Tests | `pnpm test` | ✓ 47 passed | 12.3s |
| Build | `pnpm build` | ✓ Pass | 15.7s |

### Gaps
- E2E tests: Not run (no E2E script configured)
- Performance: Not measured (not a perf change)

### Confidence
<High | Medium | Low> — <brief justification>
```

### Step 5: Detect and Integrate with PR Template

Check for existing PR templates. Reference: `references/pr-templates.md`

Search locations:
1. `.github/PULL_REQUEST_TEMPLATE.md`
2. `.github/pull_request_template.md`
3. `.github/PULL_REQUEST_TEMPLATE/` (directory of templates)
4. `docs/pull_request_template.md`
5. `.gitlab/merge_request_templates/`

**If template has a testing/verification section:**
→ Format evidence to match the template's style

**If template exists but lacks a verification section:**
→ Suggest adding one, append evidence as a new section

**If no template exists:**
→ Output evidence in the standard format above, offer to create a template

### Step 6: Handle Stop Conditions

Stop and escalate to the user when:

1. **Test failure** — Don't try to fix tests automatically. Report what failed.
2. **Build failure** — Report the error, don't guess at fixes.
3. **Missing test coverage** — Flag that changed code has no test coverage.
4. **Security change without tests** — Always flag security changes that lack test coverage.
5. **Unknown verification method** — If you can't determine how to verify something, say so.

For each stop condition, output:

```markdown
### ⚠ Verification Blocked

**Reason**: <what happened>
**Failed check**: `<command>` (exit code <N>)
**Output**: <relevant error output>
**Suggested action**: <what the user should do>
```

### Step 7: Output Summary

Present the final verification summary:

```markdown
## Verification Complete

### Change Summary
<1-2 sentences about what changed>

### Result: ✓ PASS | ✗ FAIL | ⚠ PARTIAL

### Evidence
<evidence table from Step 4>

### For PR Description
<formatted section ready to paste into PR>

### Remaining Items
- [ ] <anything that needs manual verification>
- [ ] <any unknowns>
```

## Important Rules

1. **Never skip verification** — even docs changes get lint checked
2. **Never auto-fix test failures** — report them, let the user decide
3. **Always show what was NOT checked** — gaps matter as much as passes
4. **Adapt to the project** — use whatever tools the project already has
5. **Ask about testing expectations** — most codebases have tests; ask the user which ones to run if unclear
6. **Evidence is append-only** — never modify or delete previous verification results
