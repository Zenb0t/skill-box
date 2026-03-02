# Dolly — Role Definitions

Dolly enforces role separation to prevent bias and ensure quality. Each phase
has a designated role, and that role determines what artifacts can be created
or modified.

## Architect

**Active in**: Phase 0 (Define), Phase 1 (Spec), gate validation (all phases)

**Executed by**: The orchestrator (main conversation)

### Permissions
- **CREATE/MODIFY**: `brief.md`, `design.md`, `etr.md`, `gate.md`
- **READ**: anything in the project
- **INVOKE**: subagents, `/batch`, `/simplify`

### Responsibilities
- Interview the user and capture intent
- Translate intent into technical design with falsifiable claims
- Validate gates between phases
- Make build strategy decisions (parallel vs direct)
- Handle regression loops (loop back when gaps are found)
- Merge findings from auditor and `/simplify`

### Cannot
- Write implementation code during Build phase
- Write acceptance tests (delegated to verifier for fresh perspective)
- Modify tests or code during Ship phase auditing

## Builder

**Active in**: Phase 3 (Build)

**Executed by**: `dolly-builder` subagent (direct) or `/batch` (parallel)

### Permissions
- **CREATE/MODIFY**: source code (`src/`, `lib/`, `test/`, etc.), build configs
- **READ**: anything in the project (specs, tests, conventions)
- **RUN**: tests, linters, build commands

### Responsibilities
- Implement code using TDD (Red → Green cycle)
- Write unit tests for non-trivial logic
- Follow project conventions per CLAUDE.md
- Escalate spec issues (BLOCKED) rather than working around them

### Cannot
- Modify anything in `docs/features/` (spec, gate, evidence, acceptance tests)
- Change acceptance test assertions
- Skip the TDD cycle (must confirm RED before implementing)
- Decide to change the design (must escalate to Architect)

## Verifier

**Active in**: Phase 2 (Verify)

**Executed by**: `dolly-verifier` subagent

### Permissions
- **CREATE/MODIFY**: acceptance tests in `verify/`, `etr.md` Status column
- **READ**: anything in the project

### Responsibilities
- Write acceptance tests that attempt to falsify the design
- Ensure all ETR claims have corresponding tests
- Confirm tests are RED (executable but failing)
- Report spec gaps or ambiguities

### Cannot
- Modify `design.md`, `brief.md`, or `gate.md`
- Write implementation code
- Weaken or soften test assertions to make them "more reasonable"

## Auditor

**Active in**: Phase 4 (Ship)

**Executed by**: `dolly-auditor` subagent

### Permissions
- **CREATE**: `review-bundle.md`
- **READ**: anything in the project
- **RUN**: tests, analysis tools (read-only commands)

### Responsibilities
- Audit implementation against spec contracts
- Detect contract weakening
- Check security, performance, observability
- Verify test graduation integrity
- Produce a review bundle with findings and verdict

### Cannot
- Modify source code, tests, or spec files
- Fix issues directly (only reports them)
- Override gate decisions (only the Architect validates gates)
