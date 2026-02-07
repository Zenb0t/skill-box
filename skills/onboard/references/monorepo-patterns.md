# Monorepo Detection & Handling

## Detection

### Workspace Markers

| Tool | Marker File | Workspace Definition |
|------|------------|---------------------|
| pnpm | `pnpm-workspace.yaml` | `packages:` list |
| npm | `package.json` | `workspaces` field |
| yarn | `package.json` | `workspaces` field |
| nx | `nx.json` | `projects` or auto-detect |
| turbo | `turbo.json` | Inherits workspace config |
| lerna | `lerna.json` | `packages` field |
| cargo | `Cargo.toml` | `[workspace] members` |
| go | `go.work` | `use` directives |

### Detection Order

1. Check for `pnpm-workspace.yaml` → pnpm workspaces
2. Check `package.json` for `workspaces` → npm/yarn workspaces
3. Check for `nx.json` → Nx monorepo
4. Check for `turbo.json` → Turborepo (uses pnpm/npm/yarn workspaces)
5. Check for `lerna.json` → Lerna (legacy, may coexist with others)
6. Check `Cargo.toml` for `[workspace]` → Cargo workspace
7. Check for `go.work` → Go workspace

### Distinguishing Orchestrators from Workspace Managers

- **Workspace managers** define which packages exist: pnpm, npm, yarn, cargo
- **Orchestrators** run tasks across packages: turbo, nx, lerna
- A project may have both (e.g., pnpm workspaces + turborepo)

## Nested AGENTS.md Strategy

### Hierarchy

```
project-root/
├── AGENTS.md              # Root: project-wide info
├── packages/
│   ├── auth/
│   │   └── AGENTS.md      # Package-specific commands & conventions
│   └── api/
│       └── AGENTS.md      # Package-specific commands & conventions
└── apps/
    └── web/
        └── AGENTS.md      # App-specific commands & conventions
```

### Root AGENTS.md Content

The root file should contain:
- Project overview and architecture
- Monorepo tool and workspace structure
- Cross-package commands (e.g., `pnpm -r test`)
- Shared conventions (code style, commit format)
- How to add new packages
- Root-level verify command

### Package AGENTS.md Content

Each package file should contain:
- Package purpose and responsibility
- Package-specific commands (build, test, lint)
- Package-specific conventions or gotchas
- Dependencies on other packages
- Package-specific verify scope

### Augmentation Rules for Monorepos

When augmenting an existing monorepo:

1. **Scan all levels** — Find every AGENTS.md in the tree
2. **Check consistency** — Verify root describes all packages that exist
3. **Check coverage** — Flag packages that lack their own AGENTS.md
4. **Avoid duplication** — Don't repeat root-level info in package files
5. **Scope verify** — Ensure `--scope` flag works for individual packages

## Common Monorepo Patterns

### pnpm Workspaces

```yaml
# pnpm-workspace.yaml
packages:
  - 'packages/*'
  - 'apps/*'
```

Commands:
```bash
pnpm -r test              # Run tests in all packages
pnpm --filter <pkg> test  # Run tests in specific package
pnpm -r build             # Build all packages
pnpm --filter <pkg> build # Build specific package
```

### Turborepo

```jsonc
// turbo.json
{
  "pipeline": {
    "build": { "dependsOn": ["^build"] },
    "test": {},
    "lint": {}
  }
}
```

Commands:
```bash
turbo run build            # Build all (with caching)
turbo run test             # Test all (with caching)
turbo run build --filter=<pkg>  # Specific package
```

### Nx

```jsonc
// nx.json
{
  "targetDefaults": {
    "build": { "dependsOn": ["^build"] },
    "test": {}
  }
}
```

Commands:
```bash
nx run-many -t build       # Build all
nx run-many -t test        # Test all
nx run <project>:build     # Specific project
nx affected -t test        # Only changed projects
```

### Cargo Workspaces

```toml
# Cargo.toml (root)
[workspace]
members = ["crates/*"]
```

Commands:
```bash
cargo build                # Build all
cargo test                 # Test all
cargo test -p <crate>      # Test specific crate
cargo clippy --workspace   # Lint all
```

### Go Workspaces

```
// go.work
use (
    ./cmd/api
    ./pkg/auth
    ./internal/shared
)
```

Commands:
```bash
go build ./...             # Build all
go test ./...              # Test all
go test ./cmd/api/...      # Test specific module
```

## Verify Script for Monorepos

The verify script should detect monorepo structure and support scoping:

```bash
# Root-level runs everything
./bin/verify --mode=quick

# Scope to specific package
./bin/verify --mode=quick --scope=packages/auth

# Full verification of everything
./bin/verify --mode=full
```

When creating the verify script for a monorepo, use the orchestrator if available (turbo, nx) for caching benefits. Fall back to workspace manager commands (pnpm -r, cargo test) otherwise.
