---
name: reflect
description: >
  Analyze the current conversation to extract learnings from user corrections,
  steering, and domain knowledge. Produce persistent artifacts (CLAUDE.md
  entries, memory files, settings, skills, or project docs) so future sessions
  avoid the same mistakes. Use when the user says "reflect", "what did you
  learn", "retrospective", "capture learnings", or expresses frustration with
  repeated agent mistakes. Can be invoked mid-session or at end-of-session.
---

# Reflect

Close the feedback loop: when a user corrects or steers the agent, that
knowledge dies with the conversation. This skill captures learnings as
persistent artifacts so future sessions start smarter.

## Procedure

### 1. Read Existing Context

Before scanning the conversation, read the project's existing guidance to
avoid proposing duplicates:

- Read `CLAUDE.md` (if it exists) for current project conventions
- Check `.claude/` memory directory for existing learnings
- Note what's already documented — amendments beat new entries

### 2. Scan the Conversation

Review the full conversation history. Identify **learning moments**:

| Type | Signal |
|------|--------|
| **Correction** | Agent made a mistake, user fixed it |
| **Steering** | User redirected approach ("don't do X, do Y") |
| **Preference** | User expressed how things should be done |
| **Domain knowledge** | User provided context the agent lacked |
| **Unblocking** | User gave info that unstuck the agent |
| **Tool/workflow** | User showed a better way to use tools or run commands |
| **Permission pattern** | User repeatedly approved/denied the same tool action |

For each moment, extract:
- **What happened** (one sentence)
- **What the agent got wrong** (or didn't know)
- **The correct approach**

If called multiple times in a session, skip learnings already captured in
earlier invocations.

### 3. Generalize and Filter

For each learning, attempt to extract the **general principle** behind the
specific correction. Example: "don't use that API endpoint" might generalize
to "this team avoids library X entirely."

Present both the specific learning and the proposed generalization — the user
confirms whether the generalization is valid.

**Discard** learnings that are:
- Truly one-off with no generalizable principle
- Already documented (agent just missed it — note as a discovery problem instead)
- Trivial (typo-level)

**Discovery problems** (info exists but was missed): propose cross-references
or better trigger terms rather than duplicating content.

### 4. Classify Each Learning

Determine the best artifact for each learning. See `references/artifacts.md`
for the full classification guide.

Quick reference:

| Learning type | Target artifact |
|---|---|
| Project convention, pattern, or preference | `CLAUDE.md` entry |
| Cross-session knowledge (personal workflow, recurring insight) | Memory file in `.claude/` |
| Multi-step workflow or procedure | New skill |
| Repeated tool permission approval/denial | `.claude/settings.json` suggestion |
| Team/repo convention (shared with other devs) | Project docs (CONTRIBUTING.md, etc.) |
| Enforceable code pattern (statically detectable) | Lint rule |

**Amendment vs new entry**: If a learning relates to an existing entry in
CLAUDE.md or memory, propose an amendment to that entry rather than a new one.

### 5. Propose Changes

Present findings using this format:

```
## Reflection Summary

**Learnings found:** N total, M worth persisting

### Learning 1: [short title]

**What happened:** [one sentence]
**Root cause:** [what the agent lacked]
**Correct approach:** [what to do next time]
**Generalization:** [broader principle, if applicable — confirm with user]

**Proposed artifact:** [CLAUDE.md entry | memory file | skill | settings | project doc | lint rule]
**Target file:** [exact path]
**Action:** [CREATE new entry | AMEND existing entry at line N]
**Proposed content:**

> [the actual text to add or modify]

---
```

If amending, show the current content and the proposed replacement.

### 6. Apply After Approval

- Wait for user approval on each proposed change
- User may approve all, approve some, or modify proposals
- Apply approved changes with the Edit tool (amend) or Write tool (create)
- For settings.json changes, show the exact JSON change for user review before applying

### Quality Gate

Before proposing any learning, verify:
- **Recurring**: Will this come up in future sessions?
- **Actionable**: Does it give clear guidance on what to do?
- **Scoped**: Is it in the narrowest applicable artifact?
- **Non-redundant**: Does it add info not already documented?
- **Concise**: Is the proposed text as short as possible while remaining clear?

### Edge Cases

**No learnings found**: Report "No corrections or new knowledge emerged from
this conversation that aren't already documented."

**Conflicting with existing docs**: Flag the conflict. User decides which is
correct — the existing doc may be outdated.

**Discovery problem**: If the agent missed existing documentation, propose
adding cross-references or trigger terms to make it more discoverable, rather
than duplicating content.
