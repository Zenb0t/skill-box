# Vitest Configuration Guide

Complete guide to configuring Vitest for different project types and requirements.

## Basic Configuration

### Minimal Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    // Enable globals (describe, it, expect)
    globals: true,
  },
})
```

### Recommended Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node', // or 'jsdom', 'happy-dom'
    setupFiles: ['./test/setup.ts'],
    include: ['**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'coverage/**',
        'dist/**',
        'packages/*/test{,s}/**',
        '**/*.d.ts',
        '**/*.config.*',
        '**/mockData',
      ],
    },
  },
})
```

## Environment Configurations

### Node Environment (Default)

Best for: Unit tests, utility functions, Node.js APIs

```typescript
export default defineConfig({
  test: {
    environment: 'node',
  },
})
```

### jsdom Environment

Best for: React, Vue, web components

```typescript
export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

**Setup file** (`test/setup.ts`):
```typescript
import { expect, afterEach } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Extend Vitest matchers
expect.extend(matchers)

// Cleanup after each test
afterEach(() => {
  cleanup()
})
```

### happy-dom Environment

Lighter and faster alternative to jsdom

```typescript
export default defineConfig({
  test: {
    environment: 'happy-dom',
  },
})
```

## React Configuration

### With Vite React Plugin

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    css: true, // Parse CSS imports
  },
})
```

### With SWC (Faster)

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

### React Testing Setup

```typescript
// test/setup.ts
import '@testing-library/jest-dom'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

afterEach(() => {
  cleanup()
})

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  unobserve() {}
  takeRecords() {
    return []
  }
}
```

## Vue Configuration

### Vue 3

```typescript
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

### Vue Testing Setup

```typescript
// test/setup.ts
import '@testing-library/jest-dom'
import { config } from '@vue/test-utils'

// Configure Vue Test Utils
config.global.mocks = {
  $t: (key: string) => key, // Mock i18n
}

// Stub Teleport
config.global.stubs = {
  teleport: true,
}
```

## TypeScript Configuration

### Basic TypeScript Setup

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    typecheck: {
      enabled: true,
      checker: 'tsc',
      include: ['**/*.{test,spec}-d.ts'],
    },
  },
})
```

### Path Aliases

```typescript
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
      '@utils': path.resolve(__dirname, './src/utils'),
    },
  },
  test: {
    globals: true,
  },
})
```

## Coverage Configuration

### c8 Provider (Default)

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html', 'lcov'],
      include: ['src/**/*.{js,ts,jsx,tsx}'],
      exclude: [
        'node_modules/',
        'test/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/mockData/**',
        '**/*.test.{js,ts,jsx,tsx}',
      ],
      all: true,
      lines: 80,
      functions: 80,
      branches: 80,
      statements: 80,
    },
  },
})
```

### v8 Provider

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json-summary', 'json'],
      reportOnFailure: true,
    },
  },
})
```

### Istanbul Provider

```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'clover', 'json'],
    },
  },
})
```

## Advanced Configurations

### Workspace (Monorepo)

```typescript
// vitest.workspace.ts
import { defineWorkspace } from 'vitest/config'

export default defineWorkspace([
  'packages/*',
  {
    test: {
      include: ['tests/**/*.{browser}.test.{ts,js}'],
      name: 'browser',
      environment: 'jsdom',
    },
  },
  {
    test: {
      include: ['tests/**/*.{node}.test.{ts,js}'],
      name: 'node',
      environment: 'node',
    },
  },
])
```

### Multiple Test Environments

```typescript
export default defineConfig({
  test: {
    environmentMatchGlobs: [
      // Run React tests in jsdom
      ['**/*.react.test.{ts,tsx}', 'jsdom'],
      // Run API tests in node
      ['**/*.api.test.{ts,tsx}', 'node'],
      // Run everything else in happy-dom
      ['**/*.test.{ts,tsx}', 'happy-dom'],
    ],
  },
})
```

### Custom Test Sequences

```typescript
export default defineConfig({
  test: {
    sequence: {
      shuffle: true, // Randomize test order
      concurrent: true, // Run tests concurrently
      setupFiles: 'list', // Run setup files in parallel
    },
  },
})
```

### Reporters

```typescript
export default defineConfig({
  test: {
    reporters: ['verbose', 'html', 'json'],
    outputFile: {
      json: './test-results/results.json',
      html: './test-results/index.html',
    },
  },
})
```

### UI Mode

```typescript
export default defineConfig({
  test: {
    ui: true,
    open: true, // Open UI automatically
    uiBase: '/__vitest__/',
  },
})
```

## Performance Optimization

### Faster Test Execution

```typescript
export default defineConfig({
  test: {
    // Use threads for parallel execution
    threads: true,
    maxThreads: 4,
    minThreads: 1,

    // Isolate tests
    isolate: true,

    // Pool options
    pool: 'threads', // or 'forks'
    poolOptions: {
      threads: {
        singleThread: false,
      },
    },
  },
})
```

### Watch Mode Optimization

```typescript
export default defineConfig({
  test: {
    watch: true,
    watchExclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/coverage/**',
    ],
  },
})
```

## Test Timeouts

```typescript
export default defineConfig({
  test: {
    testTimeout: 10000, // 10 seconds
    hookTimeout: 10000, // 10 seconds for before/after hooks
    teardownTimeout: 10000,
  },
})
```

## Global Setup and Teardown

```typescript
export default defineConfig({
  test: {
    globalSetup: ['./test/global-setup.ts'],
    setupFiles: ['./test/setup.ts'],
  },
})
```

**global-setup.ts**:
```typescript
// Runs once before all tests
export async function setup() {
  // Start database, server, etc.
  console.log('Global setup')
}

// Runs once after all tests
export async function teardown() {
  // Cleanup
  console.log('Global teardown')
}
```

## In-Source Testing

```typescript
export default defineConfig({
  test: {
    includeSource: ['src/**/*.{js,ts}'],
  },
  define: {
    'import.meta.vitest': 'undefined',
  },
})
```

**Usage in source**:
```typescript
// src/sum.ts
export function sum(a: number, b: number) {
  return a + b
}

if (import.meta.vitest) {
  const { it, expect } = import.meta.vitest
  it('adds numbers', () => {
    expect(sum(1, 2)).toBe(3)
  })
}
```

## Benchmark Configuration

```typescript
export default defineConfig({
  test: {
    benchmark: {
      include: ['**/*.bench.{js,ts}'],
      exclude: ['node_modules'],
    },
  },
})
```

## Browser Mode (Experimental)

```typescript
export default defineConfig({
  test: {
    browser: {
      enabled: true,
      name: 'chrome', // or 'firefox', 'safari'
      headless: true,
    },
  },
})
```

## Common Patterns

### Multiple Configurations

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

const isCI = process.env.CI === 'true'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      enabled: isCI,
      reporter: isCI ? ['json', 'lcov'] : ['text', 'html'],
    },
    reporters: isCI ? ['json', 'junit'] : ['verbose'],
  },
})
```

### Conditional Setup

```typescript
// test/setup.ts
import { beforeAll, afterAll } from 'vitest'

if (process.env.USE_MSW === 'true') {
  const { server } = await import('./mocks/server')

  beforeAll(() => server.listen())
  afterAll(() => server.close())
}
```

## Package.json Scripts

```json
{
  "scripts": {
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "test:watch": "vitest watch",
    "test:related": "vitest related",
    "test:ci": "vitest run --reporter=verbose --coverage"
  }
}
```

## Troubleshooting

### ESM Issues

```typescript
export default defineConfig({
  test: {
    deps: {
      inline: [
        // Inline dependencies that have ESM issues
        'problematic-package',
      ],
    },
  },
})
```

### Module Resolution

```typescript
export default defineConfig({
  test: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
    server: {
      deps: {
        external: ['external-package'],
      },
    },
  },
})
```

## Resources

- [Vitest Config Reference](https://vitest.dev/config/)
- [Vitest Examples](https://github.com/vitest-dev/vitest/tree/main/examples)
- [Testing Library Setup](https://testing-library.com/docs/react-testing-library/setup)
