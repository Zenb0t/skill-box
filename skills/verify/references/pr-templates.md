# PR Template Detection & Integration

## Detection

### Search Locations (in priority order)

1. `.github/PULL_REQUEST_TEMPLATE.md` — GitHub standard
2. `.github/pull_request_template.md` — GitHub lowercase variant
3. `.github/PULL_REQUEST_TEMPLATE/default.md` — GitHub multiple templates
4. `.github/PULL_REQUEST_TEMPLATE/*.md` — GitHub named templates
5. `docs/pull_request_template.md` — Docs location
6. `PULL_REQUEST_TEMPLATE.md` — Root level
7. `.gitlab/merge_request_templates/*.md` — GitLab
8. `.gitlab/merge_request_templates/Default.md` — GitLab default

### Parsing

When a template is found, identify sections by looking for:
- `## ` headers (H2 level)
- `### ` headers (H3 level)
- HTML comments `<!-- ... -->` (template instructions)
- Checkbox lists `- [ ]`

Look specifically for verification-related sections:
- "Testing" / "Test Plan" / "Tests"
- "Verification" / "Validation"
- "Checklist" / "Review Checklist"
- "Quality" / "QA"

## Integration Strategies

### Strategy A: Template Has a Testing Section

The template already has a section like:

```markdown
## Testing
<!-- Describe testing performed -->
```

**Action**: Fill in the section with verification evidence in compact format.

**Output**:
```markdown
## Testing
Verified via `./bin/verify --mode=full`:

| Check | Result | Duration |
|-------|--------|----------|
| Lint | ✓ | 3.2s |
| Typecheck | ✓ | 8.1s |
| Tests | ✓ 47/47 | 12.3s |
| Build | ✓ | 15.7s |

Gaps: No E2E tests configured.
```

### Strategy B: Template Exists, No Testing Section

The template has sections but none related to testing.

**Action**: Suggest adding a testing section. Place it after the description/changes section.

**Suggested addition**:
```markdown
## Verification
<!-- Auto-populated by verification workflow -->

| Check | Result | Duration |
|-------|--------|----------|
| Lint | ✓ | 3.2s |
| Typecheck | ✓ | 8.1s |
| Tests | ✓ 47/47 | 12.3s |
```

Also suggest permanently adding the section to the template file.

### Strategy C: No Template Exists

No PR template found anywhere.

**Action**: Offer to create a minimal template with verification built in.

**Suggested template** (`.github/PULL_REQUEST_TEMPLATE.md`):

```markdown
## Summary
<!-- What does this PR do? -->

## Changes
<!-- List the key changes -->
-

## Verification
<!-- Verification evidence (auto-populated or manual) -->

| Check | Result |
|-------|--------|
| Lint | |
| Typecheck | |
| Tests | |

## Notes
<!-- Anything reviewers should know -->
```

### Strategy D: Multiple Templates (Directory)

Project has `.github/PULL_REQUEST_TEMPLATE/` with multiple template files.

**Action**:
1. List available templates
2. Check if any are verification-focused
3. If none, suggest adding a verification section to the default template
4. Do not modify specialized templates (bug report, feature request) without asking

## Adapting Evidence to Existing Style

### If template uses checkboxes

```markdown
## Checklist
- [x] Lint passes
- [x] Typecheck passes
- [x] Unit tests pass (47/47)
- [x] Build succeeds
- [ ] E2E tests (not configured)
```

### If template uses free-form text

```markdown
## Testing
All verification checks passed:
- Lint: clean, no warnings
- Typecheck: no errors
- Unit tests: 47 passed in 12.3s
- Build: successful in 15.7s

E2E tests were not run (no script configured).
```

### If template uses HTML comments as placeholders

Replace the comment with actual content:

Before:
```markdown
## Testing
<!-- Describe the tests you ran and their results -->
```

After:
```markdown
## Testing
Ran `./bin/verify --mode=full`:
- ✓ Lint (3.2s)
- ✓ Typecheck (8.1s)
- ✓ Tests: 47/47 passed (12.3s)
- ✓ Build (15.7s)
```

## GitLab Merge Request Integration

GitLab uses a different template system. The same strategies apply, but note:
- Templates are in `.gitlab/merge_request_templates/`
- The default template is `Default.md`
- GitLab supports description templates selected from a dropdown
- Verification evidence goes in the same locations (testing/checklist sections)

## Rules

1. **Never overwrite template content** — add to it, don't replace it
2. **Match the existing style** — checkboxes if they use checkboxes, prose if they use prose
3. **Preserve HTML comments** — they're instructions for future PRs
4. **Suggest template improvements** — but as a separate suggestion, not inline
5. **Ask before creating** — don't create PR templates without confirmation
