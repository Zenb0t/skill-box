# Dolly — Gate Format Specification

Gates are the quality checkpoints between phases. Each phase has a gate section
in `gate.md` that must be validated before the next phase can begin.

## YAML Frontmatter

The top of `gate.md` contains document-level metadata:

```yaml
---
feature: <feature-name>
created: <YYYY-MM-DD>
---
```

## Gate Section Format

Each phase's gate follows this structure:

```markdown
# Phase <N>: <Name>

Status: <PENDING | ACTIVE | BLOCKED | PASSED>

## Checklist
- [ ] Item 1
- [ ] Item 2
- [x] Completed item

## Rationale
<Why this gate should pass. Must reference concrete files, test output, or
evidence. "Looks good" is not rationale.>

## Falsification
<Phases 1 and 2 only. What specific, testable claims were made or tested.>

## Needs
- <file or artifact this phase requires as input>

## Produces
- <file or artifact this phase creates as output>
```

## Status Values

| Status    | When Set | Meaning |
|-----------|----------|---------|
| `PENDING` | Initial state, or after regression reset | Not started |
| `ACTIVE`  | When work begins on a phase | In progress |
| `BLOCKED` | When gate validation fails | Issues must be resolved |
| `PASSED`  | When all checks pass | Ready to advance |

## Validation Rules

The orchestrator validates gates by checking:

1. **Needs**: Every path in `Needs` must resolve to an existing, non-empty file
   or directory.
2. **Produces**: Every path in `Produces` must resolve to an existing, non-empty
   file or directory.
3. **Checklist**: ALL items must be `[x]`. A single `[ ]` blocks the gate.
4. **Rationale**: Must be non-empty. Must contain at least one file path or
   concrete reference (not just prose).
5. **Falsification** (phases 1 & 2 only): Must be non-empty. Must contain
   specific, testable claims (see `falsification.md` for criteria).

## Regression Rules

When a gate validation fails or a downstream phase discovers issues:

1. Set the current gate's Status to `BLOCKED`.
2. Identify which earlier phase needs revision.
3. Reset all gates from the target phase onward to `PENDING`.
4. Resume from the target phase.

Example: If the auditor in Phase 4 finds contract weakening:
- Set Phase 4 Status to `BLOCKED`
- Set Phase 3 Status to `PENDING`
- Resume at Phase 3 (rebuild to honor the contract)

## Rationale Examples

**Bad** (no evidence):
> The spec covers everything we need. Looks complete.

**Good** (references artifacts):
> `design.md` defines 4 API endpoints matching the brief's success criteria.
> `etr.md` contains 5 falsifiable claims covering auth, validation, and error
> handling. The build strategy is set to `direct` because the feature modifies
> a single module (`src/auth/`). See `design.md#build-strategy` for rationale.
