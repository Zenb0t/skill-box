# Falsification-First Epistemology for Software

## The Core Idea

Karl Popper argued that scientific theories gain strength not by accumulating
confirmations, but by surviving sincere attempts at refutation. A theory that
has been tested against its most vulnerable predictions — and survived — is
stronger than one that has only been confirmed under favorable conditions.

Dolly applies this principle to software development.

## Confirmation vs Falsification

**Confirmation bias in software**: "Write a test that proves the login works."
This produces happy-path tests that confirm what the developer already believes.
The test passes, everyone feels confident, and the edge case that breaks
production is never caught.

**Falsification approach**: "Write a test designed to BREAK the login." This
forces the tester to think adversarially:
- What if the password is 10,000 characters?
- What if the same user logs in from two sessions simultaneously?
- What if the database connection drops mid-authentication?
- What if the JWT secret is empty?

The test writer's goal is to find the test that FAILS — because a failing test
reveals a genuine weakness in the design.

## Strong vs Weak Falsification

### Weak Claims (hard to falsify, therefore less useful)
- "The system should be fast" — How fast? Under what load?
- "Errors are handled gracefully" — Which errors? What does graceful mean?
- "The API is secure" — Against what threats? To what standard?
- "It works correctly" — Under which conditions? With which inputs?

### Strong Claims (specific, testable, falsifiable)
- "GET /users responds in < 200ms at p99 with 100 concurrent connections"
- "Invalid email formats return 422 with field-level error messages"
- "SQL injection via the search parameter is prevented by parameterized queries"
- "If Redis is unavailable, the system falls back to database queries within 5s"

The difference: strong claims specify the CONDITION, the BEHAVIOR, and the
THRESHOLD. You can write a test that either confirms or denies the claim.

## The ETR (Epistemic Test Register)

Every falsifiable claim from the design is registered in `etr.md`. This is the
contract between the spec and the tests. Each claim must have:

1. **Claim** — The specific, falsifiable statement
2. **Test Strategy** — How to test it (unit, integration, load, manual)
3. **Pass Criteria** — What constitutes survival (threshold, behavior)
4. **Status** — UNTESTED → TESTED → RED → GREEN

A claim that cannot be tested is a claim that cannot be falsified. It should
be revised or removed from the design.

## Why Verifiers Must Be Separate

The person who wrote the design has unconscious bias toward their own solution.
They will write tests that confirm their mental model, not tests that challenge
it. By delegating verification to a separate agent:

- Fresh eyes find assumptions the designer didn't know they were making
- The verifier has no ego investment in the design surviving
- Adversarial testing is more thorough when the tester's goal is to break,
  not to confirm

## Applying Falsification in Each Phase

| Phase | Falsification Activity |
|-------|----------------------|
| Spec  | Write falsifiable claims in design.md; register them in etr.md |
| Verify | Write tests that attempt to disprove each claim |
| Build  | Tests go from RED to GREEN — each GREEN test is a survived falsification |
| Ship   | Auditor checks that no contracts were weakened (stealth confirmation bias) |

## The Ratchet Effect

Once a claim survives falsification (test goes GREEN), that test becomes a
permanent guard. During Ship, the auditor checks for "test graduation" — if
acceptance test assertions were weakened to make them pass, that's contract
weakening, not genuine survival. The original assertion must be preserved.

---

## Behavior Claims vs Existence Claims

A critical failure mode for ETR claims is the **existence claim** — a claim
that asserts something *is present* rather than *behaves correctly*.

### The Distinction

**Existence claim**: "The form has validation"
- Can be satisfied by an empty `validate()` function
- Tells us nothing about whether validation works
- Cannot be meaningfully falsified

**Behavior claim**: "Submitting the form with an empty email field displays
'Enter a valid email address' below the email input and prevents submission"
- Specifies the condition (empty email)
- Specifies the observable outcome (error message, location, blocked submission)
- Can be directly tested and falsified

### The Behavior Claim Test

Every ETR claim must be answerable with: "I could write a test that either
confirms or disproves this claim." If you can't, the claim needs revision.

Ask four questions of every claim:

| Question  | What it requires |
|-----------|-----------------|
| **When?** | Under what input or condition? |
| **What?** | What does the system do? (specific action, not "works") |
| **Where?** | For UI: where does the user see the outcome? |
| **How?** | What is the measurable threshold or observable state? |

### UI-Specific Behavior Claim Examples

| Weak (Existence)                    | Strong (Behavior)                                                                              |
|-------------------------------------|-----------------------------------------------------------------------------------------------|
| "Email validation exists"           | "Submitting with a malformed email shows 'Enter a valid email address' inline below the email field; submission is blocked" |
| "Server errors are handled"         | "When the server returns 500, the form shows 'Something went wrong. Try again.' in the top-level banner; user's input is preserved" |
| "Loading state is shown"            | "While the form is submitting, the submit button is disabled and shows a spinner; all fields are read-only" |
| "Auth is checked"                   | "Accessing `/settings` without a valid session redirects to `/login?returnTo=/settings`" |
| "The component renders"             | "On initial load, the email field is empty, the submit button is disabled, no error messages are visible" |
| "Error handling is implemented"     | "An API timeout after 10s shows 'Request timed out. Check your connection.' and re-enables the submit button" |

### Why This Matters

Existence claims create a false sense of coverage. A spec full of existence
claims will pass gate validation while describing a system that could have no
working behavior at all. The ETR must describe what the system *does*, not
what it *has*.

When reviewing ETR claims in Gate 1 validation, reject any claim that:
- Uses passive voice without a subject: "errors are handled" (by whom? how?)
- States presence without behavior: "validation is present", "auth exists"
- Omits the observable outcome: "the form validates correctly"
- Cannot be directly translated into a test assertion
