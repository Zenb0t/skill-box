---
name: dolly
description: >
  Lightweight SDLC orchestrator with 5 gated phases (Define, Spec, Verify,
  Build, Ship). Uses falsification-first verification and role separation.
  Invoke /dolly to start or resume a feature workflow. Use when the user
  wants structured feature development with verification gates.
---

# Dolly — Lightweight Anvil SDLC Skill

Dolly is a 5-phase gated software development lifecycle orchestrator. It brings
the epistemological rigor of Anvil (falsification-first verification, role
separation, gate-based progression) into a Claude Code skill with no CLI
dependency.

## Invocation

```
/dolly <feature-name>        # Start or resume a feature
/dolly <feature-name> status # Show current phase + gate status
```

## Philosophy

1. **Falsification over confirmation** — Tests are designed to BREAK the design,
   not confirm it works. A spec that survives earnest attempts at falsification
   is stronger than one that merely passes happy-path tests.
2. **Role separation** — The person who writes the spec must not be the person
   who builds the implementation. Fresh eyes find blind spots.
3. **Gate-based progression** — No phase begins until the prior phase's gate is
   validated. Gates are checklists with rationale, not rubber stamps.
4. **Evidence over assertion** — Every gate rationale must reference concrete
   artifacts (files, test results, diffs).

## Setup

On first invocation, check whether the project has Dolly's subagents installed.
If any of the following files are missing, load `references/setup.md` and follow
its instructions before proceeding:

- `.claude/agents/dolly-verifier.md`
- `.claude/agents/dolly-builder.md`
- `.claude/agents/dolly-auditor.md`

## Phase Table

| # | Phase    | Role      | Delegation                          | Inputs                | Outputs                          |
|---|----------|-----------|-------------------------------------|-----------------------|----------------------------------|
| 0 | Define   | Architect | Orchestrator (this skill)           | User request          | `brief.md`, gate                 |
| 1 | Spec     | Architect | Orchestrator (this skill)           | `brief.md`            | `design.md`, `etr.md`, gate      |
| 2 | Verify   | Verifier  | Spawn `dolly-verifier` subagent     | `design.md`, `etr.md` | Acceptance tests (RED), gate     |
| 3 | Build    | Builder   | `/batch` (parallel) or `dolly-builder` (direct) | Acceptance tests, spec | Implementation (GREEN), gate |
| 4 | Ship     | Auditor   | Spawn `dolly-auditor` + `/simplify` | Built code, spec      | `review-bundle.md`, gate         |

## Orchestration Protocol

### Status Check

If invoked as `/dolly <feature-name> status`:
1. Read `gate.md` in `docs/features/<feature-name>/`.
2. Summarize the status of each phase (PENDING / ACTIVE / BLOCKED / PASSED).
3. Report the current phase and any blocking issues.
4. Return — do not start or advance any phase work.

### Starting or Resuming

1. Parse `<feature-name>` from invocation.
2. Set feature directory: `docs/features/<feature-name>/`.
3. If the directory doesn't exist, scaffold it per `references/feature-template.md`
   (creates `gate.md` and `brief.md` stub only; other files are created by their
   respective phases).
4. If it exists, read `gate.md` to determine the current phase.
5. Resume from the earliest phase with `Status: PENDING` or `Status: BLOCKED`.

### Gate Validation Protocol

After completing work in any phase, validate its gate before advancing:

1. Read `gate.md` in the feature directory.
2. Find the current phase's section (e.g., `# Phase 1: Spec`).
3. Check that every path under `## Needs` exists and is non-empty.
4. Check that every path under `## Produces` exists and is non-empty.
5. Check that ALL checklist items under `## Checklist` are `[x]` (checked).
6. Check that `## Rationale` references concrete file paths or evidence.
7. For phases 1 and 2, check that `## Falsification` is non-empty and
   contains specific, testable claims.
8. If all checks pass → set `Status: PASSED`, advance to next phase.
9. If any check fails → set `Status: BLOCKED`, report what's missing, and loop.

See `references/gate-format.md` for the full gate schema.

---

## Phase 0: Define

**Role**: Architect (orchestrator)
**Goal**: Capture the user's intent in a structured brief.

### Process

1. Use `AskUserQuestion` to interview the user. Gather:
   - What problem does this feature solve?
   - Who are the users/consumers?
   - What does success look like?
   - What are known constraints or dependencies?
   - Are there things this feature explicitly should NOT do?
2. Synthesize answers into `brief.md` with sections:
   - **Problem Statement** (1-3 sentences)
   - **Users / Consumers**
   - **Success Criteria** (observable, measurable outcomes)
   - **Constraints** (technical, scope, timeline)
   - **Non-Goals** (explicit exclusions)
3. Present `brief.md` to the user for confirmation.
4. Validate gate 0.

### Gate 0 Checklist
- [ ] `brief.md` exists with all required sections
- [ ] User has confirmed the brief
- [ ] Non-goals are explicitly stated

---

## Phase 1: Spec

**Role**: Architect (orchestrator)
**Goal**: Translate the brief into a technical design with falsifiable claims.

### Process

1. Read `brief.md`.
2. **Discover existing error and validation patterns** — Before writing any
   spec, scour the codebase for established conventions. Search for:
   - Form validation libraries and patterns in use (`react-hook-form`, `zod`,
     `yup`, `formik`, `vee-validate`, etc.)
   - How field-level errors are displayed (inline, toast, banner)
   - How API/server errors are surfaced to the user
   - Existing error response shapes from the API
   - Loading state patterns for async operations
   - Accessibility patterns (aria attributes, focus management)
   See `references/ui-and-errors.md` for the full discovery checklist.
   **Codify all discoveries in `design.md#error--validation-patterns`.**
3. Explore the rest of the codebase to understand existing architecture,
   patterns, and conventions. Use Glob, Grep, and Read tools as needed.
4. Write `design.md` with sections:
   - **Overview** — What will be built, how it fits into existing architecture
   - **API / Interface** — Public contracts (function signatures, endpoints,
     component props, etc.)
   - **Internal Design** — Key implementation decisions with rationale
   - **Build Strategy** — Either `parallel` (for `/batch`) or `direct` (for
     single builder). Include rationale for the choice. Use `parallel` when:
     the feature decomposes into 3+ independent units of work that can be
     built in separate worktrees without merge conflicts.
   - **Error & Validation Patterns** — (required) Document discovered codebase
     conventions and explicitly state which this feature will follow. If the
     feature has no UI, state "N/A — no UI components."
   - **UI Components** — (required if feature has UI) List every component
     introduced or modified. Include the user flows as step-by-step sequences
     covering: happy path, validation errors, and server errors.
   - **Form Validation Rules** — (required if feature has forms) A table of
     every form field with: required/optional, constraints, error message copy,
     and validation trigger (on-submit, on-blur, on-change).
   - **Falsification** — Claims that, if disproven, would invalidate the design.
     Each claim must describe BEHAVIOR (what the system does under a condition),
     not EXISTENCE (that something is present). See `references/falsification.md`
     for the behavior-vs-existence distinction and criteria. Weak: "it should
     be fast" or "errors are handled." Strong: "submitting with empty email
     shows 'Enter a valid email address' below the field and blocks submission."
5. Write `etr.md` (Epistemic Test Register):
   - A table of falsifiable claims extracted from the design.
   - Columns: `Claim`, `Test Strategy`, `Pass Criteria`, `Status`
   - Initial Status for all claims: `UNTESTED`
   - Status lifecycle: `UNTESTED` → `TESTED` (Phase 2, tests written) →
     `RED` (Phase 2, tests confirmed failing) → `GREEN` (Phase 3, tests pass)
   - Each claim maps to one or more acceptance tests (written in Phase 2).
   - **Each claim must pass the behavior test**: it must answer When, What,
     Where (UI), and How. Existence claims ("X is implemented", "X is present",
     "X is handled") are rejected at gate validation.
   - If the feature has forms: at least one claim per form field for valid
     input and at least one claim per form field for invalid input.
   - If the feature has error states: at least one claim per error state.
6. Validate gate 1.

### Gate 1 Checklist
- [ ] `design.md` exists with all required sections
- [ ] Build strategy is specified as `parallel` or `direct` with rationale
- [ ] `etr.md` exists with at least 3 falsifiable claims
- [ ] ETR claims describe BEHAVIOR not EXISTENCE (each answers: When? What? Where? How?)
- [ ] Falsification section contains specific, testable claims
- [ ] Error & validation patterns section documents codebase discoveries
- [ ] If feature has UI: user flows are documented for happy path, validation error, and server error
- [ ] If feature has forms: form validation rules table is present with field-level error messages
- [ ] Design references existing codebase patterns (not greenfield assumptions)

---

## Phase 2: Verify

**Role**: Verifier (subagent)
**Goal**: Write acceptance tests designed to BREAK the design. Tests must be RED.

### Process

1. **Optional: Spawn a cross-reference agent first** — If the feature has
   multiple UI forms/screens, 5+ ETR claims, or complex multi-step flows,
   spawn a cross-reference agent before the verifier to check spec coverage.
   See `references/ui-and-errors.md#cross-reference-agent-prompt` for the
   prompt. Review its findings and loop back to Phase 1 if gaps are found.

2. Spawn the `dolly-verifier` subagent with the following prompt:

   ```
   Feature: "<feature-name>"
   Feature directory: docs/features/<feature-name>/

   Read these files:
   - docs/features/<feature-name>/design.md
   - docs/features/<feature-name>/etr.md

   Write acceptance tests to: docs/features/<feature-name>/verify/
   Update etr.md Status column to TESTED for each covered claim.

   If the feature has UI components or forms, ensure tests also cover:
   - User interaction paths (simulate user clicking/typing in the UI)
   - Form validation behavior for each field (valid and invalid input)
   - Error state rendering (messages appear in the right place)
   - Loading states during async operations
   ```

3. When the verifier returns, review its output:
   - Run the tests to confirm they are RED.
   - Update ETR Status from `TESTED` to `RED` for claims with confirmed-failing tests.
   - Check that every ETR claim is covered.
   - **Check that tests verify BEHAVIOR** — tests must assert on observable
     outcomes (error messages, state changes, redirects), not just function
     calls or existence.
   - If the feature has UI: confirm tests cover user interaction paths and
     error states, not only the underlying API/logic.
   - If gaps exist, loop back: either re-invoke the verifier or revise the
     spec (return to Phase 1).
4. Validate gate 2.

### Gate 2 Checklist
- [ ] Acceptance tests exist in `verify/`
- [ ] All ETR claims have corresponding tests
- [ ] `etr.md` Status column updated to TESTED for covered claims
- [ ] Tests are executable and currently RED
- [ ] Tests target falsification (not just happy path)
- [ ] Tests verify BEHAVIOR (observable outcomes), not just existence or invocation
- [ ] If feature has UI: tests cover user interaction flows, not only underlying logic
- [ ] If feature has forms: tests cover field validation for both valid and invalid input
- [ ] If feature has error states: each error state has a test verifying its UI rendering

### Regression Rule
If the verifier discovers that the spec is ambiguous, contradictory, or
untestable, the orchestrator must return to Phase 1 to revise `design.md`
and `etr.md` before re-running Phase 2.

---

## Phase 3: Build

**Role**: Builder (subagent or `/batch`)
**Goal**: Make acceptance tests GREEN using TDD.

### Process

1. Read the `Build Strategy` section from `design.md`.

2. **If strategy is `parallel`**:
   - Invoke `/batch` with the following task description:
     ```
     Implement the feature described in docs/features/<feature-name>/design.md.

     Constraints:
     - All acceptance tests in docs/features/<feature-name>/verify/ must pass GREEN.
     - Follow the ETR claims in docs/features/<feature-name>/etr.md.
     - Use TDD: run tests RED first, then implement until GREEN.
     - Do NOT modify any files in docs/features/<feature-name>/ (spec is read-only).
     - Follow project conventions per CLAUDE.md.

     Before completing, produce a Completeness Report:
     - List each acceptance test file and its GREEN/RED result
     - Map each ETR claim to a passing test
     - If the feature has UI: confirm every user flow in design.md is implemented
       end-to-end including loading states and error states
     - If the feature has forms: confirm all form fields have client-side and
       server-side validation wired up
     ```
   - `/batch` will handle its own decomposition, worktree isolation, and PR creation.
   - After `/batch` completes, review the Completeness Report and verify all
     acceptance tests pass in the merged result.
   - Update ETR Status from `RED` to `GREEN` for claims with passing tests.

3. **If strategy is `direct`**:
   - Spawn the `dolly-builder` subagent in a worktree with the following prompt:
     ```
     Feature: "<feature-name>"
     Feature directory: docs/features/<feature-name>/

     Read: design.md, etr.md, and all tests in verify/
     Implement using TDD until all acceptance tests are GREEN.
     Do NOT modify any files in docs/features/<feature-name>/.

     Before returning, produce a Completeness Report that covers:
     - All acceptance tests with GREEN/RED status
     - Each ETR claim mapped to a passing test
     - If the feature has UI: confirmation that every user flow in design.md
       is implemented end-to-end, including loading states and error states
     - If the feature has forms: confirmation that all form fields have both
       client-side and server-side validation wired up
     - Any spec ambiguities or design gaps encountered during build
     ```
   - When the builder returns, **review the Completeness Report** before
     running tests yourself.
   - Verify all acceptance tests pass.
   - Update ETR Status from `RED` to `GREEN` for claims with passing tests.

4. Validate gate 3.

### Gate 3 Checklist
- [ ] Builder submitted a Completeness Report (or completeness.md exists)
- [ ] All acceptance tests in `verify/` are GREEN (each test file confirmed)
- [ ] All ETR claims map to at least one GREEN test (claim → test mapping confirmed)
- [ ] Implementation follows `design.md` contracts
- [ ] No spec/gate/evidence files were modified by the builder
- [ ] Unit tests exist for non-trivial logic
- [ ] If feature has UI: every user flow in design.md is implemented end-to-end
- [ ] If feature has forms: all form fields have client-side and server-side validation wired

---

## Phase 4: Ship

**Role**: Auditor (subagent) + `/simplify`
**Goal**: Harden the implementation and catch contract weakening.

### Process

1. Spawn the `dolly-auditor` subagent AND invoke `/simplify` in parallel
   (they are independent read-only reviews):

   Auditor prompt:
   ```
   Feature: "<feature-name>"
   Feature directory: docs/features/<feature-name>/

   Review implementation against: design.md, etr.md, and tests in verify/
   Write findings to: docs/features/<feature-name>/review-bundle.md

   In addition to contract and security review, perform a USER PERSPECTIVE AUDIT:
   1. Identify the user's objective: what is the user trying to accomplish?
   2. Map every entry point: how does a user navigate to or discover this feature?
   3. Walk through each user flow from design.md step-by-step as a human user
      would experience it (clicking UI, filling forms, reading responses).
   4. Verify every step in every flow is implemented and reachable.
   5. Verify error messages are plain language (not technical jargon) and tell
      the user what to do, not just what went wrong.
   6. Verify the user's input is preserved on error (form is not reset).
   7. Identify any user flow that leads to a dead end, blank screen, or
      unhelpful error — these are BLOCKING issues.
   See references/ui-and-errors.md for the full user-perspective audit checklist
   and the required UI section format for review-bundle.md.
   ```

   `/simplify`: invoke on the changed code for reuse, quality, and efficiency.

2. Merge findings:
   - If the auditor found contract weakening → BLOCK. Return to Phase 3
     (or Phase 1 if the spec itself is insufficient).
   - If the auditor found user flows that lead to dead ends or inaccessible
     features → BLOCK. Return to Phase 3 to implement the missing paths.
   - If `/simplify` found issues → fix them (orchestrator or builder).
   - If both pass → proceed to gate validation.

3. Validate gate 4.

### Gate 4 Checklist
- [ ] `review-bundle.md` exists with audit findings
- [ ] No contract weakening detected
- [ ] User perspective audit completed: user objective identified, all entry points mapped
- [ ] All user flows walked step-by-step — no dead ends or inaccessible paths
- [ ] Error messages are plain language and include recovery guidance
- [ ] If feature has forms: user input is preserved on server error
- [ ] `/simplify` review completed, issues addressed
- [ ] All acceptance tests still GREEN after any Ship-phase changes
- [ ] Feature is ready to merge

---

## Rules

1. **Never skip phases.** Every feature goes through all 5 phases in order.
   The only exception is looping back (e.g., Verify → Spec when gaps are found).

2. **Role enforcement.** The orchestrator (Architect role) writes specs and
   validates gates. Builders write implementation code. Verifiers write tests.
   Auditors review. No role writes artifacts outside its scope. See
   `references/roles.md` for detailed permissions per role.

3. **Falsification is non-negotiable.** Every spec must include falsifiable
   claims. Every verification phase must attempt to disprove those claims.
   "It works" is not evidence — "it survived these specific attempts to break
   it" is.

4. **Evidence over assertion.** Gate rationale must reference concrete files,
   test output, or diffs. "Looks good" is not rationale.

5. **Spec is read-only during Build.** Builders must not modify spec, gate,
   or evidence files. If a builder finds a spec issue, they stop and escalate.

6. **Contract preservation.** During Ship, the auditor checks that the
   implementation honors every contract in the spec. Weakening a contract
   (making it less strict) without spec revision is a gate failure.
