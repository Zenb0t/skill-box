# Verify Script Templates

## Overview

The verify script (`./bin/verify`) provides a single entry point for checking project health. It supports two modes and optional scoping for monorepos.

## Interface

```
Usage: ./bin/verify [OPTIONS]

Options:
  --mode=quick    Lint + typecheck only (target: < 30s)
  --mode=full     Lint + typecheck + tests (complete verification)
  --scope=<path>  Limit to specific package/directory (monorepos)
  -h, --help      Show help
```

## Bash Skeleton (Language-Agnostic)

```bash
#!/usr/bin/env bash
set -euo pipefail

# Defaults
MODE="quick"
SCOPE=""

# Parse arguments
for arg in "$@"; do
  case $arg in
    --mode=*) MODE="${arg#*=}" ;;
    --scope=*) SCOPE="${arg#*=}" ;;
    -h|--help)
      echo "Usage: $0 [--mode=quick|full] [--scope=<path>]"
      exit 0
      ;;
    *) echo "Unknown argument: $arg"; exit 1 ;;
  esac
done

echo "=== Verify (mode=$MODE, scope=${SCOPE:-all}) ==="

FAILED=0

run_check() {
  local name="$1"
  shift
  echo -n "  $name... "
  if "$@" > /dev/null 2>&1; then
    echo "✓"
  else
    echo "✗ FAILED"
    FAILED=1
  fi
}

# ──── Quick checks (always run) ────

# TODO: Replace with actual project commands
# run_check "Lint" <lint-command>
# run_check "Typecheck" <typecheck-command>

# ──── Full checks (only in full mode) ────

if [ "$MODE" = "full" ]; then
  # TODO: Replace with actual project commands
  # run_check "Unit tests" <test-command>
  # run_check "E2E tests" <e2e-command>
  echo ""
fi

# ──── Summary ────

if [ $FAILED -eq 0 ]; then
  echo "=== All checks passed ==="
  exit 0
else
  echo "=== Some checks failed ==="
  exit 1
fi
```

## Node.js (pnpm) Example

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE="${1:-quick}"
MODE="${MODE#--mode=}"
SCOPE=""

for arg in "$@"; do
  case $arg in
    --mode=*) MODE="${arg#*=}" ;;
    --scope=*) SCOPE="${arg#*=}" ;;
  esac
done

FILTER=""
if [ -n "$SCOPE" ]; then
  FILTER="--filter ./$SCOPE"
fi

echo "=== Verify (mode=$MODE, scope=${SCOPE:-all}) ==="
FAILED=0

run_check() {
  local name="$1"; shift
  echo -n "  $name... "
  if "$@" > /dev/null 2>&1; then echo "✓"; else echo "✗ FAILED"; FAILED=1; fi
}

# Quick
run_check "Lint" pnpm $FILTER run lint
run_check "Typecheck" pnpm $FILTER run typecheck

# Full
if [ "$MODE" = "full" ]; then
  run_check "Unit tests" pnpm $FILTER run test
fi

[ $FAILED -eq 0 ] && echo "=== All checks passed ===" || { echo "=== Some checks failed ==="; exit 1; }
```

## Python (uv/poetry) Example

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE="quick"
SCOPE=""

for arg in "$@"; do
  case $arg in
    --mode=*) MODE="${arg#*=}" ;;
    --scope=*) SCOPE="${arg#*=}" ;;
  esac
done

PYTEST_SCOPE=""
if [ -n "$SCOPE" ]; then
  PYTEST_SCOPE="$SCOPE"
fi

echo "=== Verify (mode=$MODE, scope=${SCOPE:-all}) ==="
FAILED=0

run_check() {
  local name="$1"; shift
  echo -n "  $name... "
  if "$@" > /dev/null 2>&1; then echo "✓"; else echo "✗ FAILED"; FAILED=1; fi
}

# Quick
run_check "Lint" ruff check .
run_check "Typecheck" mypy .
run_check "Format" ruff format --check .

# Full
if [ "$MODE" = "full" ]; then
  run_check "Tests" pytest $PYTEST_SCOPE
fi

[ $FAILED -eq 0 ] && echo "=== All checks passed ===" || { echo "=== Some checks failed ==="; exit 1; }
```

## Rust Example

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE="quick"
SCOPE=""

for arg in "$@"; do
  case $arg in
    --mode=*) MODE="${arg#*=}" ;;
    --scope=*) SCOPE="${arg#*=}" ;;
  esac
done

PKG_FLAG=""
if [ -n "$SCOPE" ]; then
  PKG_FLAG="-p $SCOPE"
fi

echo "=== Verify (mode=$MODE, scope=${SCOPE:-all}) ==="
FAILED=0

run_check() {
  local name="$1"; shift
  echo -n "  $name... "
  if "$@" > /dev/null 2>&1; then echo "✓"; else echo "✗ FAILED"; FAILED=1; fi
}

# Quick
run_check "Check" cargo check $PKG_FLAG
run_check "Clippy" cargo clippy $PKG_FLAG -- -D warnings
run_check "Format" cargo fmt --check $PKG_FLAG

# Full
if [ "$MODE" = "full" ]; then
  run_check "Tests" cargo test $PKG_FLAG
fi

[ $FAILED -eq 0 ] && echo "=== All checks passed ===" || { echo "=== Some checks failed ==="; exit 1; }
```

## Go Example

```bash
#!/usr/bin/env bash
set -euo pipefail

MODE="quick"
SCOPE="./..."

for arg in "$@"; do
  case $arg in
    --mode=*) MODE="${arg#*=}" ;;
    --scope=*) SCOPE="./${arg#*=}/..." ;;
  esac
done

echo "=== Verify (mode=$MODE, scope=$SCOPE) ==="
FAILED=0

run_check() {
  local name="$1"; shift
  echo -n "  $name... "
  if "$@" > /dev/null 2>&1; then echo "✓"; else echo "✗ FAILED"; FAILED=1; fi
}

# Quick
run_check "Vet" go vet $SCOPE
run_check "Build" go build $SCOPE

# Full
if [ "$MODE" = "full" ]; then
  run_check "Tests" go test $SCOPE
fi

[ $FAILED -eq 0 ] && echo "=== All checks passed ===" || { echo "=== Some checks failed ==="; exit 1; }
```

## Notes

- Always use `set -euo pipefail` for safety
- The script must be idempotent — safe to run repeatedly
- Exit code 0 = all checks passed, 1 = something failed
- For monorepos using turbo/nx, prefer those for caching:
  ```bash
  run_check "Lint" turbo run lint --filter="$SCOPE"
  ```
- Make the script executable: `chmod +x ./bin/verify`
