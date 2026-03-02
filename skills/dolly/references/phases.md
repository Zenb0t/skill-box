# Dolly — Phase Details & Transition Rules

## Phase Progression

```
Phase 0: Define  →  Phase 1: Spec  →  Phase 2: Verify  →  Phase 3: Build  →  Phase 4: Ship
                         ↑                    |                                     |
                         └────────────────────┘                                     |
                         (spec gaps found)                                          |
                         ↑                                        ↑                 |
                         └────────────────────────────────────────┼─────────────────┘
                         (spec insufficient)                      |
                                                                  └─────────────────┘
                                                                  (contract weakening)
```

## Transition Rules

1. **Forward transitions** require the current phase's gate to be PASSED.
2. **Backward transitions** (regression loops):
   - Verify → Spec: When the verifier finds the spec is ambiguous or untestable.
   - Ship → Build: When the auditor finds contract weakening in the implementation.
   - Ship → Spec: When the auditor finds the spec itself is insufficient.
3. A backward transition resets all downstream gates to PENDING.
4. There is no skipping. Phase N requires Phase N-1 to be PASSED.

## Phase 0: Define — Full Checklist

**Entry**: User invokes `/dolly <feature-name>`
**Exit**: Gate 0 PASSED

- [ ] Feature directory scaffolded at `docs/features/<feature-name>/`
- [ ] User interviewed (problem, users, success criteria, constraints, non-goals)
- [ ] `brief.md` written with all sections populated
- [ ] User has reviewed and confirmed the brief
- [ ] Non-goals explicitly stated (prevents scope creep later)
- [ ] Gate 0 validated: `brief.md` exists, checklist complete, rationale written

## Phase 1: Spec — Full Checklist

**Entry**: Gate 0 PASSED
**Exit**: Gate 1 PASSED

- [ ] `brief.md` read and understood
- [ ] Codebase explored for existing patterns, conventions, related code
- [ ] `design.md` written with: Overview, API/Interface, Internal Design, Build Strategy, Falsification
- [ ] Build strategy determined: `parallel` or `direct` with rationale
- [ ] `etr.md` written with at least 3 falsifiable claims
- [ ] Each ETR claim is specific and testable (see `falsification.md` for criteria)
- [ ] Design references existing codebase patterns (not greenfield assumptions)
- [ ] Gate 1 validated: all artifacts exist, checklist complete, falsification section non-empty

## Phase 2: Verify — Full Checklist

**Entry**: Gate 1 PASSED
**Exit**: Gate 2 PASSED

- [ ] `dolly-verifier` subagent spawned with spec context
- [ ] Verifier read `design.md` and `etr.md`
- [ ] Acceptance tests written to `verify/`
- [ ] Every ETR claim has at least one corresponding test
- [ ] Tests are executable using the project's test framework
- [ ] Tests are RED (confirmed by running them)
- [ ] Tests target edge cases, boundaries, and assumptions (not just happy paths)
- [ ] `etr.md` Status column updated to TESTED for covered claims
- [ ] Gate 2 validated: tests exist, all claims covered, tests are RED

**Note**: If spec gaps are found during verification, the orchestrator loops
back to Phase 1 and resets Gate 2 to PENDING.

## Phase 3: Build — Full Checklist

**Entry**: Gate 2 PASSED
**Exit**: Gate 3 PASSED

### If Build Strategy is `parallel`:
- [ ] `/batch` invoked with spec + acceptance test constraints
- [ ] `/batch` completed its decomposition and implementation
- [ ] All PRs from `/batch` merged or ready to merge
- [ ] All acceptance tests GREEN in merged result
- [ ] No spec/gate/evidence files modified

### If Build Strategy is `direct`:
- [ ] `dolly-builder` subagent spawned in worktree
- [ ] Builder confirmed acceptance tests are RED before implementing
- [ ] Builder implemented code using Red-Green TDD cycle
- [ ] All acceptance tests GREEN
- [ ] Unit tests written for non-trivial internal logic
- [ ] No spec/gate/evidence files modified
- [ ] No BLOCKED escalations (or they were resolved)

### Common:
- [ ] Gate 3 validated: all acceptance tests GREEN, contracts honored, checklist complete

## Phase 4: Ship — Full Checklist

**Entry**: Gate 3 PASSED
**Exit**: Gate 4 PASSED

- [ ] `dolly-auditor` subagent spawned with spec + implementation context
- [ ] Auditor reviewed: contract compliance, contract weakening, security, performance, observability, test graduation
- [ ] `review-bundle.md` written to feature directory
- [ ] No contract weakening detected (if found: loop back to Phase 3 or Phase 1)
- [ ] `/simplify` invoked on changed code
- [ ] `/simplify` findings addressed (issues fixed or justified)
- [ ] All acceptance tests still GREEN after Ship-phase changes
- [ ] Gate 4 validated: review complete, no blocking issues, feature ready to merge

## Gate Status Values

See `references/gate-format.md` for the full gate schema, status values, and
validation rules.
