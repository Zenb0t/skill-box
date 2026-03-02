# Dolly — Feature Directory Template

When starting a new feature, scaffold the following directory structure at
`docs/features/<feature-name>/`:

## Directory Structure

```
docs/features/<feature-name>/
├── brief.md           # Phase 0 output — user's intent
├── design.md          # Phase 1 output — technical spec
├── etr.md             # Phase 1 output — epistemic test register
├── gate.md            # Gate tracking for all phases
├── verify/            # Phase 2 output — acceptance tests
└── review-bundle.md   # Phase 4 output — audit findings
```

## Initial `gate.md` Content

Create `gate.md` with the following starter content:

```markdown
---
feature: <feature-name>
created: <YYYY-MM-DD>
---

# Phase 0: Define

Status: PENDING

## Checklist
- [ ] `brief.md` exists with all required sections
- [ ] User has confirmed the brief
- [ ] Non-goals are explicitly stated

## Rationale

## Needs
- (user input)

## Produces
- brief.md

---

# Phase 1: Spec

Status: PENDING

## Checklist
- [ ] `design.md` exists with all required sections
- [ ] Build strategy is specified as `parallel` or `direct` with rationale
- [ ] `etr.md` exists with at least 3 falsifiable claims
- [ ] Falsification section contains specific, testable claims
- [ ] Design references existing codebase patterns (not greenfield assumptions)

## Rationale

## Falsification

## Needs
- brief.md

## Produces
- design.md
- etr.md

---

# Phase 2: Verify

Status: PENDING

## Checklist
- [ ] Acceptance tests exist in `verify/`
- [ ] All ETR claims have corresponding tests
- [ ] `etr.md` Status column updated to TESTED for covered claims
- [ ] Tests are executable and currently RED
- [ ] Tests target falsification (not just happy path)

## Rationale

## Falsification

## Needs
- design.md
- etr.md

## Produces
- verify/*

---

# Phase 3: Build

Status: PENDING

## Checklist
- [ ] All acceptance tests in `verify/` are GREEN
- [ ] Implementation follows `design.md` contracts
- [ ] No spec/gate/evidence files were modified by the builder
- [ ] Unit tests exist for non-trivial logic

## Rationale

## Needs
- design.md
- etr.md
- verify/*

## Produces
- (implementation files)

---

# Phase 4: Ship

Status: PENDING

## Checklist
- [ ] `review-bundle.md` exists with audit findings
- [ ] No contract weakening detected
- [ ] `/simplify` review completed, issues addressed
- [ ] All acceptance tests still GREEN after Ship-phase changes
- [ ] Feature is ready to merge

## Rationale

## Needs
- design.md
- etr.md
- verify/*
- (implementation files)

## Produces
- review-bundle.md
```

## Initial `brief.md` Stub

```markdown
# Brief: <feature-name>

## Problem Statement

## Users / Consumers

## Success Criteria

## Constraints

## Non-Goals
```

## Notes

- Only `gate.md` and `brief.md` are created during scaffolding.
- Other files (`design.md`, `etr.md`, `review-bundle.md`) are created by
  their respective phases.
- The `verify/` directory is created by the verifier subagent.
