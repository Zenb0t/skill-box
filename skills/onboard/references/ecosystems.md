# Ecosystem Detection Patterns

## Node.js

### Package Managers

| Manager | Manifest | Lock File | Detect Command |
|---------|----------|-----------|----------------|
| npm | `package.json` | `package-lock.json` | `npm --version` |
| pnpm | `package.json` | `pnpm-lock.yaml` | `pnpm --version` |
| yarn (classic) | `package.json` | `yarn.lock` | `yarn --version` (1.x) |
| yarn (berry) | `package.json` | `yarn.lock` + `.yarnrc.yml` | `yarn --version` (2+) |
| bun | `package.json` | `bun.lockb` | `bun --version` |

### Common Commands

```
# Safe probes (Tier 1-2)
<mgr> run --list          # List available scripts (npm doesn't support this; parse package.json instead)
cat package.json | jq '.scripts'  # Parse scripts directly

# Typical scripts
<mgr> run build            # Build
<mgr> run test             # Test
<mgr> run lint             # Lint
<mgr> run typecheck        # Type checking (or tsc --noEmit)
<mgr> run dev              # Dev server
```

### Framework Detection

| Framework | Marker Files |
|-----------|-------------|
| Next.js | `next.config.js`, `next.config.mjs`, `next.config.ts` |
| Remix | `remix.config.js`, `app/root.tsx` |
| Vite | `vite.config.ts`, `vite.config.js` |
| Astro | `astro.config.mjs` |
| Express | Check `package.json` dependencies |
| Nest.js | `nest-cli.json` |

### Test Framework Detection

| Framework | Marker Files |
|-----------|-------------|
| Jest | `jest.config.*`, `package.json#jest` |
| Vitest | `vitest.config.*`, `vite.config.*` with test config |
| Mocha | `.mocharc.*`, `package.json#mocha` |
| Playwright | `playwright.config.*` |
| Cypress | `cypress.config.*`, `cypress/` |

---

## Python

### Package Managers

| Manager | Manifest | Lock File | Detect Command |
|---------|----------|-----------|----------------|
| pip | `requirements.txt`, `setup.py`, `setup.cfg` | — | `pip --version` |
| poetry | `pyproject.toml` (with `[tool.poetry]`) | `poetry.lock` | `poetry --version` |
| uv | `pyproject.toml` | `uv.lock` | `uv --version` |
| pipenv | `Pipfile` | `Pipfile.lock` | `pipenv --version` |
| conda | `environment.yml` | — | `conda --version` |

### Common Commands

```
# Safe probes
python3 --version
<mgr> --version

# Typical commands (vary by manager)
pytest                     # Test (most common)
python -m pytest           # Test (explicit)
ruff check .               # Lint (modern)
flake8                     # Lint (legacy)
mypy .                     # Type check
black --check .            # Format check
```

### Framework Detection

| Framework | Marker |
|-----------|--------|
| Django | `manage.py`, `settings.py`, `django` in deps |
| Flask | `flask` in deps, `app.py` |
| FastAPI | `fastapi` in deps |
| Streamlit | `streamlit` in deps |

---

## Rust

### Manifest & Lock

| File | Purpose |
|------|---------|
| `Cargo.toml` | Manifest (always present) |
| `Cargo.lock` | Lock file (present for binaries, optional for libs) |

### Common Commands

```
# Safe probes
rustc --version
cargo --version
cargo metadata --format-version 1  # Project info (Tier 1, read-only)

# Build & test
cargo build                # Build
cargo test                 # Test
cargo clippy               # Lint
cargo fmt --check          # Format check
cargo check                # Type check (fast, no codegen)
```

### Workspace Detection

Check `Cargo.toml` for `[workspace]` section with `members`.

---

## Go

### Manifest & Lock

| File | Purpose |
|------|---------|
| `go.mod` | Module definition |
| `go.sum` | Dependency checksums |

### Common Commands

```
# Safe probes
go version
go list ./...              # List packages (Tier 2)

# Build & test
go build ./...             # Build
go test ./...              # Test
go vet ./...               # Lint
golangci-lint run          # Extended lint (if installed)
```

---

## Java

### Build Tools

| Tool | Marker | Wrapper |
|------|--------|---------|
| Maven | `pom.xml` | `mvnw` |
| Gradle | `build.gradle`, `build.gradle.kts` | `gradlew` |

### Common Commands

```
# Maven
./mvnw --version           # Safe probe
./mvnw compile             # Build
./mvnw test                # Test
./mvnw verify              # Full verification

# Gradle
./gradlew --version        # Safe probe
./gradlew build            # Build
./gradlew test             # Test
./gradlew check            # Lint + test
```

---

## .NET

### Manifest

| File | Purpose |
|------|---------|
| `*.csproj` | C# project |
| `*.fsproj` | F# project |
| `*.sln` | Solution file |
| `global.json` | SDK version pinning |

### Common Commands

```
dotnet --version            # Safe probe
dotnet build                # Build
dotnet test                 # Test
dotnet format --verify-no-changes  # Format check
```

---

## Generic Detection (Any Ecosystem)

### CI-Based Discovery

Parse CI config files to discover commands the project actually uses:

| CI System | Config Location |
|-----------|----------------|
| GitHub Actions | `.github/workflows/*.yml` |
| GitLab CI | `.gitlab-ci.yml` |
| CircleCI | `.circleci/config.yml` |
| Jenkins | `Jenkinsfile` |
| Travis | `.travis.yml` |

Extract `run:` steps from CI configs — these are the commands the project trusts.

### Makefile Discovery

If `Makefile` exists:
```
make -pn | grep -E '^[a-zA-Z_-]+:' | cut -d: -f1  # List targets (Tier 1)
```

Common useful targets: `build`, `test`, `lint`, `check`, `verify`, `dev`, `clean`

### Script Directory Discovery

Check for:
- `./bin/` — project scripts
- `./scripts/` — project scripts
- `./tools/` — project tools
- `Justfile` — just command runner
- `Taskfile.yml` — task runner
