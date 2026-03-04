# Dolly — UI Completeness & Error Pattern Requirements

This reference governs how Dolly handles features that include a user interface.
Any feature that exposes a UI component — particularly forms — must satisfy these
requirements during spec, verification, build, and audit.

---

## Why UI Completeness Matters

A feature is not complete until a human user can successfully accomplish their
goal through the interface. Backend code that works perfectly but surfaces no
errors, shows a blank screen on failure, or silently swallows input mistakes is
an incomplete feature — regardless of test coverage.

Users navigate software by clicking, typing, and submitting forms. If any step
in that journey is broken, ambiguous, or inaccessible, the feature is broken —
even if the underlying API is correct.

---

## Phase 1: Spec — Error Pattern Discovery

Before writing `design.md`, the Architect **must** scour the codebase for
existing error and validation patterns. The goal is consistency: new features
must follow established conventions, not invent new ones.

### Discovery Checklist (run before writing design.md)

Search the codebase for:

1. **Form validation patterns**
   - How are required fields marked? (e.g., `required` attribute, `*` label)
   - How are field-level errors displayed? (e.g., inline below field, toast)
   - How are form-level errors displayed? (e.g., banner at top, alert box)
   - What libraries are used? (e.g., `react-hook-form`, `zod`, `yup`, `formik`)
   - Are validations run on submit only, or on blur/change as well?

2. **API error response patterns**
   - What shape do error responses take? (e.g., `{ error: string }`, `{ errors: [] }`)
   - Are field-level errors returned from the server? (e.g., `{ field: "email", message: "..." }`)
   - What HTTP status codes map to what user-facing messages?

3. **Loading and async state patterns**
   - How are loading states shown during async operations? (spinner, skeleton, disabled button)
   - How are network errors surfaced?
   - Are optimistic updates used anywhere?

4. **Accessibility patterns**
   - Are error messages linked to form fields via `aria-describedby`?
   - Are error states communicated to screen readers (e.g., `role="alert"`)
   - Is focus managed after form submission?

### Codify Discoveries in design.md

The `design.md` **must** include a section titled `## Error & Validation Patterns`
that explicitly states which project conventions will be followed. Example:

```markdown
## Error & Validation Patterns

**Discovered conventions** (from codebase scan):
- Form validation: `react-hook-form` + `zod` schema (see `src/components/LoginForm.tsx`)
- Field errors: Displayed inline below each field using `<FieldError>` component
- Form-level errors: Displayed in `<AlertBanner>` at top of form
- API errors: `{ code: string, message: string, field?: string }` (see `src/api/types.ts`)
- Loading state: Submit button disabled + spinner (see `src/components/Button.tsx`)

**This feature will follow**: all of the above conventions
**Deviations**: none — or explain why a deviation is necessary
```

If no existing patterns are found (greenfield project), explicitly state that
and define the conventions that will be established.

---

## Phase 1: Spec — UI Completeness Requirements

If the feature includes any form (any UI that collects user input), `design.md`
must include:

### Required Sections for UI Features

#### `## UI Components`
List every UI component the feature introduces or modifies:
- Component name and location
- Its purpose in the user flow
- What it accepts as input
- What it produces or triggers

#### `## User Flows`
Describe every path a human user can take to accomplish the feature's goal:

```markdown
### Flow 1: Happy Path
1. User navigates to [screen/page]
2. User fills in [fields]
3. User clicks [button/action]
4. System [does X]
5. User sees [confirmation/next screen]

### Flow 2: Validation Error
1. User submits form with [invalid input]
2. System rejects submission
3. User sees [specific error message] at [location]
4. User corrects input and resubmits

### Flow 3: Server Error
1. User submits valid form
2. Server returns error (e.g., network failure, conflict)
3. User sees [specific error message]
4. Form state is preserved (user does not lose input)
```

#### `## Form Validation Rules`
For every form field, specify:
- Required or optional
- Format constraints (max length, pattern, type)
- Business rules (e.g., "email must be unique", "date must be in future")
- Error message copy (exact text shown to user)
- When validation triggers (on-submit, on-blur, on-change)

Example:

| Field     | Required | Constraints        | Error Message                        | Trigger  |
|-----------|----------|--------------------|--------------------------------------|----------|
| email     | Yes      | valid email format | "Enter a valid email address"        | on-blur  |
| password  | Yes      | min 8 chars        | "Password must be at least 8 chars"  | on-blur  |
| name      | Yes      | max 100 chars      | "Name cannot exceed 100 characters"  | on-blur  |

#### `## Error States`
For every error that can occur:
- What triggers the error
- What the user sees (message, location, visual treatment)
- What the user can do next (recovery path)

---

## Phase 1: ETR — Behavior Claims, Not Existence Claims

ETR claims must describe **behavior** — what the system **does** when conditions
are met — not merely that something **exists** or is **present**.

### Existence Claim (REJECT — fails gate)
> "The form has validation"

This claim cannot be falsified. It passes if an empty `validate()` function
exists. It tells us nothing about whether the validation actually works.

### Behavior Claim (ACCEPT — passes gate)
> "Submitting the form with an empty email field displays 'Enter a valid email
> address' below the email input and prevents form submission"

This claim can be falsified. A test can submit the form and check:
1. Did the error message appear?
2. Did it appear in the right place?
3. Was submission blocked?

### Behavior Claim Test Template

Every ETR claim must answer these questions:

| Question | Must be answered in claim |
|----------|--------------------------|
| **When?** | Under what condition does this behavior occur? |
| **What?** | What does the system do? (not "it works" — be specific) |
| **Where?** | For UI claims: where does the user see this? |
| **How?** | What is the observable outcome? (message text, state change, redirect) |

### Examples

| Weak (Existence) | Strong (Behavior) |
|-----------------|-------------------|
| "Email validation exists" | "Submitting with a malformed email shows 'Enter a valid email address' inline below the email field; submission is blocked" |
| "Server errors are handled" | "When the server returns 500, the form displays 'Something went wrong. Please try again.' in the top-level error banner; user's input is preserved" |
| "Loading state is shown" | "While the form is submitting, the submit button is disabled and shows a spinner; all fields are disabled to prevent changes" |
| "Auth is checked" | "Accessing `/settings` without a valid session redirects to `/login` with `returnTo=/settings` in the query string" |
| "The component renders" | "On initial load, the email field is empty, the submit button is disabled, and no error messages are visible" |

---

## Phase 2: Verify — Cross-Reference Agent

When the feature has UI components, the Verifier may spawn a **cross-reference
sub-agent** to validate spec coverage before writing tests. This agent checks
that the spec and ETR fully cover all user flows.

### When to Spawn a Cross-Reference Agent

Spawn when:
- The feature has 2+ UI forms or screens
- The ETR has 5+ claims and some feel abstract
- The brief mentions complex user flows or multi-step workflows

### Cross-Reference Agent Prompt

```
You are a spec coverage checker. Your job is to find gaps between the feature
brief, the design, and the ETR — before any tests are written.

Read:
- docs/features/<feature-name>/brief.md
- docs/features/<feature-name>/design.md
- docs/features/<feature-name>/etr.md

Check:
1. Every success criterion in brief.md maps to at least one ETR claim
2. Every user flow in design.md has at least one ETR claim per step
3. Every form field in design.md has at least one ETR claim for:
   - Valid input (happy path)
   - Invalid input (validation error)
4. Every error state in design.md has a corresponding ETR claim
5. ETR claims describe BEHAVIOR, not EXISTENCE (see ui-and-errors.md criteria)

Report:
- Gaps (brief items with no ETR coverage)
- Existence claims that need to be converted to behavior claims
- User flows with untested steps
- Error states with no coverage

Do NOT write tests. Do NOT modify any files. Report only.
```

The orchestrator reviews this report and either:
- Loops back to Phase 1 to fill gaps in the spec/ETR
- Confirms coverage is sufficient and proceeds to test writing

---

## Phase 3: Build — Completeness Handoff Protocol

The Builder must not return to the orchestrator by simply stating "all tests
pass." Before declaring Phase 3 complete, the Builder must explicitly verify
completeness using the following protocol.

### Builder Completeness Checklist

The Builder produces a **Completeness Report** (appended to its return message
or written to `docs/features/<feature-name>/completeness.md`) that answers:

**Test Coverage**
- [ ] All acceptance tests in `verify/` are GREEN (list each test file + result)
- [ ] All ETR claims have at least one GREEN test (map claim → test)
- [ ] No acceptance tests were skipped or marked pending

**UI Completeness** (if feature has UI)
- [ ] Every user flow in `design.md` is implemented end-to-end
- [ ] Every form field has validation wired up (client-side)
- [ ] Every form has server-side validation reflected in the UI
- [ ] Every error state defined in the spec is reachable via the UI
- [ ] Loading states are implemented for all async operations

**Design Contract**
- [ ] Every API endpoint in `design.md` is implemented with correct signatures
- [ ] Every component in `design.md##UI Components` is implemented
- [ ] No spec items were silently dropped or deferred

### Requesting Orchestrator Completeness Verification

Before marking itself done, the Builder must explicitly surface this checklist
to the orchestrator with a request:

```
COMPLETENESS CHECK REQUESTED

I have implemented the feature. Before advancing to Gate 3 validation, please
verify the following items that require orchestrator review:

1. [List any items from completeness checklist that could not be self-verified]
2. [Flag any design ambiguities encountered during build]
3. [List any items from the ETR that were difficult to satisfy and why]

Completeness report: [inline or path to completeness.md]

All acceptance tests: GREEN ✓ [list results]
```

The orchestrator reviews this report before validating Gate 3.

---

## Phase 4: Ship — User-Perspective Audit

The Auditor must not only check code quality — they must **think like a user**
and walk through the feature as a human would experience it.

### The User Perspective Checklist

Before reviewing code, the Auditor must answer these questions:

**Objective Identification**
- What is the user trying to accomplish with this feature?
- What does success look like from the user's perspective?
- What would make the user feel the feature "doesn't work"?

**Access Path Mapping**
- How does a user discover or navigate to this feature?
- What UI elements do they click or interact with first?
- List every entry point: navigation links, buttons, direct URLs, redirects

**User Journey Walkthrough**
For each user flow in `design.md`, the Auditor must trace:
1. The exact sequence of UI interactions
2. What the user sees at each step (including loading states)
3. What happens if the user makes a mistake at each step
4. What the user sees when they succeed
5. What the user sees when something goes wrong (server errors, timeouts)

**Error Experience Audit**
- Are error messages written in plain language (not technical jargon)?
- Do error messages tell the user what went wrong AND what to do about it?
- Is the user's input preserved on error (form is not reset on server error)?
- Is focus moved to the error on submission failure (accessibility)?
- Are errors announced to screen readers?

**UI Completeness Gaps**
- Are there any user flows in the spec that lead to dead ends in the implementation?
- Are there any paths a user can take that are not covered by acceptance tests?
- Are there any features mentioned in the brief that are not accessible via the UI?

### Audit Report: UI Section

The `review-bundle.md` must include a `## UI & User Experience` section:

```markdown
## UI & User Experience

### User Objective
[What the user is trying to accomplish]

### Access Paths
| Entry Point | How User Gets There | Implemented? |
|-------------|--------------------|----|
| /signup button | Clicks "Sign Up" in nav | ✓ |
| Direct URL /register | Types URL directly | ✓ |

### Flow Walkthroughs
#### Flow: Happy Path
- Step 1: [user action] → [what user sees] ✓
- Step 2: [user action] → [what user sees] ✓

#### Flow: Validation Error
- Step 1: [invalid input] → [error message shown] ✓
- Error message is plain language: ✓
- Input preserved: ✓
- Focus managed: ✓

### Error Experience
| Error | User-Facing Message | Input Preserved | Accessible |
|-------|--------------------|----|-----|
| Empty email | "Enter a valid email address" | N/A | ✓ |
| Server 500 | "Something went wrong. Try again." | ✓ | ✓ |

### Gaps Found
[Any flows, paths, or error states that are incomplete or inaccessible]

### Verdict
PASS / PASS WITH NOTES / BLOCK
```

If any user flow leads to a dead end, an inaccessible feature, or an
unhelpful error state, the Auditor must flag this as a **BLOCK** — not a note.
A feature that users cannot successfully complete is not shippable.
