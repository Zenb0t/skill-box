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
