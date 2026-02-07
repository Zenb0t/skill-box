# Security Review Checklist

Use this checklist when verifying security-sensitive changes and no project-specific security guidelines exist. Check for project guidelines first (see `references/change-types.md`).

## Input Validation

- [ ] All user-facing entry points validate input (API endpoints, form handlers, CLI args)
- [ ] Input is sanitized before use in queries, commands, or output
- [ ] Output is properly encoded for its context (HTML, URL, SQL, shell)
- [ ] File uploads are validated (type, size, content)
- [ ] Redirects are validated against an allowlist

## Authentication

- [ ] Session tokens are generated with sufficient entropy
- [ ] Tokens are stored securely (httpOnly cookies, not localStorage for sensitive tokens)
- [ ] Session invalidation works on logout
- [ ] Password reset flows don't leak user existence
- [ ] Rate limiting exists on auth endpoints

## Authorization

- [ ] Every protected resource checks permissions before access
- [ ] Role/permission checks happen server-side, not just client-side
- [ ] Users can only access resources they own (no IDOR)
- [ ] Privilege escalation paths are reviewed (role changes, admin actions)
- [ ] API endpoints enforce the same auth rules as the UI

## Cryptography

- [ ] Standard algorithms used (no custom crypto)
- [ ] Keys and secrets are not hardcoded in source
- [ ] Secrets are loaded from environment or a secrets manager
- [ ] Passwords are hashed with bcrypt, scrypt, or argon2 (not MD5/SHA)
- [ ] TLS is enforced for sensitive data in transit

## Data Exposure

- [ ] Error messages don't leak stack traces, internal paths, or DB details
- [ ] Logs don't contain passwords, tokens, or PII
- [ ] API responses don't include fields the user shouldn't see
- [ ] Debug/dev modes are not enabled in production config
- [ ] Sensitive data is excluded from client-side state and browser storage

## Dependencies

- [ ] No dependencies with known CVEs (`npm audit`, `pip audit`, etc.)
- [ ] Dependencies are pinned or locked (lock file committed)
- [ ] New dependencies are from reputable sources with active maintenance
- [ ] Transitive dependencies reviewed for major version changes
