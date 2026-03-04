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
- [ ] Codebase scoured for error handling and form validation patterns (see `ui-and-errors.md`)
- [ ] Codebase explored for existing architecture, patterns, conventions, related code
- [ ] `design.md` written with: Overview, API/Interface, Internal Design, Build Strategy, Error & Validation Patterns, Falsification
- [ ] If feature has UI: `design.md` includes UI Components and User Flows sections (happy path, validation error, server error)
- [ ] If feature has forms: `design.md` includes Form Validation Rules table (field, required, constraints, error message, trigger)
- [ ] Build strategy determined: `parallel` or `direct` with rationale
- [ ] `etr.md` written with at least 3 falsifiable claims
- [ ] Each ETR claim describes BEHAVIOR not EXISTENCE (answers: When? What? Where? How?)
- [ ] If feature has forms: ETR has at least one claim per field for valid and invalid input
- [ ] If feature has error states: ETR has at least one claim per error state
- [ ] Design references existing codebase patterns (not greenfield assumptions)
- [ ] Gate 1 validated: all artifacts exist, checklist complete, ETR claims are behavioral

## Phase 2: Verify — Full Checklist

**Entry**: Gate 1 PASSED
**Exit**: Gate 2 PASSED

- [ ] Optional cross-reference agent spawned (if feature has 2+ UI forms or 5+ ETR claims)
- [ ] Cross-reference gaps resolved (spec looped back if gaps found, or confirmed sufficient)
- [ ] `dolly-verifier` subagent spawned with spec context
- [ ] Verifier read `design.md` and `etr.md`
- [ ] Acceptance tests written to `verify/`
- [ ] Every ETR claim has at least one corresponding test
- [ ] Tests verify BEHAVIOR (observable outcomes), not just function calls or existence
- [ ] Tests are executable using the project's test framework
- [ ] Tests are RED (confirmed by running them)
- [ ] Tests target edge cases, boundaries, and assumptions (not just happy paths)
- [ ] If feature has UI: tests cover user interaction flows (simulate user clicking/typing)
- [ ] If feature has forms: tests cover field validation (valid AND invalid input per field)
- [ ] If feature has error states: each error state has a test verifying its UI rendering
- [ ] `etr.md` Status column updated to TESTED for covered claims
- [ ] Gate 2 validated: tests exist, all claims covered, tests are RED, behavior verified

**Note**: If spec gaps are found during verification, the orchestrator loops
back to Phase 1 and resets Gate 2 to PENDING.

## Phase 3: Build — Full Checklist

**Entry**: Gate 2 PASSED
**Exit**: Gate 3 PASSED

### If Build Strategy is `parallel`:
- [ ] `/batch` invoked with spec + acceptance test constraints + completeness report requirement
- [ ] `/batch` completed its decomposition and implementation
- [ ] All PRs from `/batch` merged or ready to merge
- [ ] Builder/batch submitted a Completeness Report
- [ ] Completeness Report reviewed by orchestrator before gate validation
- [ ] All acceptance tests GREEN in merged result (each file confirmed)
- [ ] All ETR claims mapped to at least one GREEN test
- [ ] No spec/gate/evidence files modified

### If Build Strategy is `direct`:
- [ ] `dolly-builder` subagent spawned in worktree with completeness report requirement
- [ ] Builder confirmed acceptance tests are RED before implementing
- [ ] Builder implemented code using Red-Green TDD cycle
- [ ] All acceptance tests GREEN (each file confirmed)
- [ ] All ETR claims mapped to at least one GREEN test
- [ ] Builder submitted Completeness Report before returning
- [ ] Completeness Report reviewed by orchestrator before gate validation
- [ ] Unit tests written for non-trivial internal logic
- [ ] No spec/gate/evidence files modified
- [ ] No BLOCKED escalations (or they were resolved)

### Common (including UI features):
- [ ] If feature has UI: every user flow in design.md is implemented end-to-end
- [ ] If feature has forms: all form fields have client-side validation wired
- [ ] If feature has forms: all form fields have server-side validation reflected in UI
- [ ] Gate 3 validated: all acceptance tests GREEN, contracts honored, completeness confirmed

## Phase 4: Ship — Full Checklist

**Entry**: Gate 3 PASSED
**Exit**: Gate 4 PASSED

- [ ] `dolly-auditor` subagent spawned with spec + implementation context + user-perspective audit instructions
- [ ] Auditor reviewed: contract compliance, contract weakening, security, performance, observability, test graduation
- [ ] Auditor performed user-perspective audit:
  - [ ] User objective identified
  - [ ] All entry points to the feature mapped
  - [ ] Every user flow walked step-by-step as a human user would experience it
  - [ ] No dead ends, blank screens, or inaccessible features found
  - [ ] Error messages verified to be plain language with recovery guidance
  - [ ] Form input preservation on error verified
- [ ] `review-bundle.md` written to feature directory (includes `## UI & User Experience` section)
- [ ] No contract weakening detected (if found: loop back to Phase 3 or Phase 1)
- [ ] No user flow dead ends detected (if found: BLOCK and loop back to Phase 3)
- [ ] `/simplify` invoked on changed code
- [ ] `/simplify` findings addressed (issues fixed or justified)
- [ ] All acceptance tests still GREEN after Ship-phase changes
- [ ] Gate 4 validated: review complete, user flows verified, no blocking issues, feature ready to merge

## Gate Status Values

See `references/gate-format.md` for the full gate schema, status values, and
validation rules.
