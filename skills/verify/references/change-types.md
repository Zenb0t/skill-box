# Change Type Classification & Verification Ladders

## Classification Guide

### How to Classify

Look at the git diff (or planned changes) and categorize:

1. **What files changed?** — Source code, tests, config, docs?
2. **What's the intent?** — New behavior, changed behavior, preserved behavior?
3. **What's the risk?** — Could this break existing functionality?

If a change spans multiple categories, use the highest verification level.

---

## Change Types

### Refactor

**Definition**: Restructuring code without changing external behavior.

**Signals**:
- Renaming functions/variables/files
- Extracting functions or modules
- Moving code between files
- Simplifying logic without changing outcomes

**Verification Ladder**:
1. ✅ Lint & format
2. ✅ Typecheck
3. ✅ Full test suite (proves behavior preserved)
4. ✅ Build

**Key concern**: Prove nothing changed. If tests pass, behavior is preserved.

---

### Feature

**Definition**: Adding new functionality.

**Signals**:
- New files/modules
- New API endpoints
- New UI components
- New CLI commands

**Verification Ladder**:
1. ✅ Lint & format
2. ✅ Typecheck
3. ✅ Unit tests (especially new tests for new feature)
4. ⬜ Integration tests (if available)
5. ⬜ Build

**Key concern**: Does the new thing work? Are there tests for it?

**Flag if**: New feature has zero test coverage.

---

### Bug Fix

**Definition**: Correcting incorrect behavior.

**Signals**:
- Fixing conditional logic
- Handling edge cases
- Correcting data transformations
- Fixing race conditions

**Verification Ladder**:
1. ✅ Lint & format
2. ✅ Typecheck
3. ✅ Unit tests (including regression test for the bug)
4. ⬜ Related integration tests

**Key concern**: Does the fix work? Does it cause regressions?

**Flag if**: No regression test added for the fixed bug.

---

### Dependency Upgrade

**Definition**: Updating or adding external dependencies.

**Signals**:
- Changes to lock files
- Changes to manifest files (package.json, Cargo.toml, etc.)
- Version bumps

**Verification Ladder**:
1. ✅ Install/resolve dependencies
2. ✅ Lint & format
3. ✅ Typecheck (catches API changes)
4. ✅ Full test suite
5. ✅ Build (catches bundling issues)

**Key concern**: Does everything still work with the new version?

**Flag if**:
- Major version bump (breaking changes likely)
- Security advisory motivated the upgrade
- Multiple deps upgraded simultaneously

---

### Config Change

**Definition**: Changes to build, CI, or tooling configuration.

**Signals**:
- CI workflow files
- Build config (webpack, vite, tsconfig, etc.)
- Linter/formatter config
- Docker/deployment config

**Verification Ladder**:
1. ✅ Lint & format (especially if linter config changed)
2. ✅ Typecheck (especially if tsconfig changed)
3. ✅ Build (proves build config works)
4. ⬜ Test suite (if CI config changed)

**Key concern**: Do the tools still work correctly?

---

### Documentation

**Definition**: Changes to docs, comments, or README files only.

**Signals**:
- `.md` files only
- Code comments only (no logic changes)
- JSDoc/docstring updates

**Verification Ladder**:
1. ✅ Lint (catches markdown issues, broken links)
2. ✅ Format check
3. ⬜ Doc build (if project builds docs)

**Key concern**: Minimal risk, but lint catches broken formatting.

---

### Security-Sensitive

**Definition**: Changes touching authentication, authorization, crypto, or input validation.

**Signals**:
- Auth/login flows
- Permission checks
- Cryptographic operations
- Input sanitization/validation
- CORS/CSP/security headers
- Secret/token handling

**Verification Ladder**:
1. ✅ Lint & format
2. ✅ Typecheck
3. ✅ Full test suite
4. ✅ Build
5. ✅ Security-specific tests (if available)
6. ⚠ Manual review checklist:
   - [ ] No secrets in code
   - [ ] Input validation on all entry points
   - [ ] Auth checks not bypassed
   - [ ] Error messages don't leak sensitive info
   - [ ] Cryptographic primitives used correctly

**Key concern**: Security bugs are high-impact. Over-verify.

**Always flag**: Any security change should be explicitly called out in the PR.

---

### Performance

**Definition**: Changes aimed at improving performance.

**Signals**:
- Algorithm changes
- Caching additions
- Query optimization
- Lazy loading / code splitting
- Memory optimization

**Verification Ladder**:
1. ✅ Lint & format
2. ✅ Typecheck
3. ✅ Full test suite (proves correctness preserved)
4. ✅ Build
5. ⬜ Benchmark (if available)
6. ⬜ Before/after measurements

**Key concern**: Performance changes often introduce subtle correctness bugs. Full test suite is required.

---

### New Module/Package

**Definition**: Adding a new package to a monorepo or new module to the project.

**Signals**:
- New directory under packages/ or apps/
- New workspace member
- New Cargo crate

**Verification Ladder**:
1. ✅ Lint & format (new code follows standards)
2. ✅ Typecheck
3. ✅ New package tests pass
4. ✅ Full monorepo build (catches integration issues)
5. ✅ Workspace resolution (new package is discoverable)

**Key concern**: Does it integrate correctly? Can other packages depend on it?

---

## Quick Reference

| Type | Level | Required Checks |
|------|-------|----------------|
| Docs | Low | lint, format |
| Config | Medium | lint, typecheck, build |
| Feature | Medium | lint, typecheck, unit tests |
| Bug fix | Medium | lint, typecheck, unit tests |
| Refactor | High | lint, typecheck, full tests, build |
| Dependency | High | lint, typecheck, full tests, build |
| Performance | High | lint, typecheck, full tests, build |
| New module | High | lint, typecheck, tests, build |
| Security | Critical | everything + manual review |
