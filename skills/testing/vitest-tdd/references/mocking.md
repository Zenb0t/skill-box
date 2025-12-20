# Vitest Mocking Guide

Comprehensive guide to mocking with Vitest's `vi` utilities.

## Table of Contents

- [Mock Functions](#mock-functions)
- [Module Mocking](#module-mocking)
- [Spying](#spying)
- [Timers](#timers)
- [Globals](#globals)
- [Advanced Patterns](#advanced-patterns)

## Mock Functions

### Basic Mock

```typescript
import { vi, expect } from 'vitest'

const mockFn = vi.fn()

// Call the mock
mockFn('arg1', 'arg2')

// Assertions
expect(mockFn).toHaveBeenCalled()
expect(mockFn).toHaveBeenCalledWith('arg1', 'arg2')
expect(mockFn).toHaveBeenCalledTimes(1)
```

### Mock Return Values

```typescript
// Single return value
const mockFn = vi.fn().mockReturnValue(42)
expect(mockFn()).toBe(42)

// Chain multiple return values
const mockFn = vi.fn()
  .mockReturnValueOnce('first')
  .mockReturnValueOnce('second')
  .mockReturnValue('default')

expect(mockFn()).toBe('first')
expect(mockFn()).toBe('second')
expect(mockFn()).toBe('default')
expect(mockFn()).toBe('default')
```

### Mock Resolved/Rejected Values

```typescript
// Resolved promise
const mockFn = vi.fn().mockResolvedValue({ data: 'success' })
const result = await mockFn()
expect(result).toEqual({ data: 'success' })

// Rejected promise
const mockFn = vi.fn().mockRejectedValue(new Error('Failed'))
await expect(mockFn()).rejects.toThrow('Failed')

// Multiple async calls
const mockFn = vi.fn()
  .mockResolvedValueOnce({ data: 'first' })
  .mockResolvedValueOnce({ data: 'second' })
  .mockRejectedValue(new Error('Failed'))

await mockFn() // { data: 'first' }
await mockFn() // { data: 'second' }
await mockFn() // throws Error
```

### Mock Implementation

```typescript
// Custom implementation
const mockFn = vi.fn((a, b) => a + b)
expect(mockFn(1, 2)).toBe(3)

// Dynamic implementation
const mockFn = vi.fn().mockImplementation((name) => `Hello, ${name}!`)
expect(mockFn('World')).toBe('Hello, World!')

// One-time implementation
const mockFn = vi.fn()
  .mockImplementationOnce(() => 'first')
  .mockImplementationOnce(() => 'second')
  .mockImplementation(() => 'default')
```

## Module Mocking

### Auto-mocking Modules

```typescript
// Automatically mock all exports
vi.mock('./api')

import { fetchUser, createUser } from './api'

// All exports are now mocked
vi.mocked(fetchUser).mockResolvedValue({ id: 1, name: 'John' })
vi.mocked(createUser).mockResolvedValue({ id: 2, name: 'Jane' })
```

### Partial Module Mocking

```typescript
vi.mock('./utils', async () => {
  const actual = await vi.importActual('./utils')
  return {
    ...actual,
    // Mock only specific exports
    formatDate: vi.fn(() => '2024-01-01'),
  }
})
```

### Factory Function Mocking

```typescript
vi.mock('./database', () => ({
  default: {
    query: vi.fn(),
    connect: vi.fn(),
    disconnect: vi.fn(),
  },
}))

import db from './database'

vi.mocked(db.query).mockResolvedValue([{ id: 1 }])
```

### Mocking ES Modules

```typescript
// Mock default export
vi.mock('./UserService', () => ({
  default: vi.fn().mockImplementation(() => ({
    getUser: vi.fn(),
    createUser: vi.fn(),
  })),
}))

// Mock named exports
vi.mock('./utils', () => ({
  formatDate: vi.fn(() => '2024-01-01'),
  parseDate: vi.fn((str) => new Date(str)),
}))
```

### Mocking Node Modules

```typescript
// Mock axios
vi.mock('axios')

import axios from 'axios'

vi.mocked(axios.get).mockResolvedValue({
  data: { id: 1, name: 'John' },
  status: 200,
})

// Mock fs
vi.mock('fs')

import { readFileSync } from 'fs'

vi.mocked(readFileSync).mockReturnValue('file content')
```

### Dynamic Imports

```typescript
import { vi } from 'vitest'

vi.mock('./dynamicModule', () => ({
  dynamicFunction: vi.fn(() => 'mocked'),
}))

it('should mock dynamic import', async () => {
  const { dynamicFunction } = await import('./dynamicModule')
  expect(dynamicFunction()).toBe('mocked')
})
```

## Spying

### Spy on Object Methods

```typescript
const obj = {
  method: (a: number, b: number) => a + b,
}

const spy = vi.spyOn(obj, 'method')

// Call still works
expect(obj.method(1, 2)).toBe(3)

// Spy records calls
expect(spy).toHaveBeenCalledWith(1, 2)

// Can override implementation
spy.mockImplementation(() => 100)
expect(obj.method(1, 2)).toBe(100)

// Restore original
spy.mockRestore()
expect(obj.method(1, 2)).toBe(3)
```

### Spy on Class Methods

```typescript
class UserService {
  getUser(id: number) {
    return { id, name: 'John' }
  }
}

const service = new UserService()
const spy = vi.spyOn(service, 'getUser')

spy.mockReturnValue({ id: 1, name: 'Mocked' })

expect(service.getUser(1)).toEqual({ id: 1, name: 'Mocked' })
expect(spy).toHaveBeenCalledWith(1)
```

### Spy on Getters/Setters

```typescript
const obj = {
  get value() {
    return 42
  },
  set value(val: number) {
    // setter logic
  },
}

const getSpy = vi.spyOn(obj, 'value', 'get')
getSpy.mockReturnValue(100)

expect(obj.value).toBe(100)

const setSpy = vi.spyOn(obj, 'value', 'set')
obj.value = 200

expect(setSpy).toHaveBeenCalledWith(200)
```

## Timers

### Fake Timers

```typescript
import { vi, beforeEach, afterEach } from 'vitest'

beforeEach(() => {
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

it('should delay execution', () => {
  const callback = vi.fn()

  setTimeout(callback, 1000)

  expect(callback).not.toHaveBeenCalled()

  vi.advanceTimersByTime(1000)

  expect(callback).toHaveBeenCalled()
})
```

### Advance Timers

```typescript
it('should handle intervals', () => {
  const callback = vi.fn()

  setInterval(callback, 100)

  vi.advanceTimersByTime(250)

  expect(callback).toHaveBeenCalledTimes(2)

  vi.advanceTimersByTime(100)

  expect(callback).toHaveBeenCalledTimes(3)
})
```

### Run All Timers

```typescript
it('should run all pending timers', () => {
  const callback1 = vi.fn()
  const callback2 = vi.fn()

  setTimeout(callback1, 100)
  setTimeout(callback2, 200)

  vi.runAllTimers()

  expect(callback1).toHaveBeenCalled()
  expect(callback2).toHaveBeenCalled()
})
```

### Run Only Pending Timers

```typescript
it('should run only current timers', () => {
  const callback = vi.fn(() => {
    setTimeout(callback, 100) // Schedule another timer
  })

  setTimeout(callback, 100)

  vi.runOnlyPendingTimers()

  expect(callback).toHaveBeenCalledTimes(1) // Only first timer ran
})
```

### Async Timer Advancement

```typescript
it('should advance async timers', async () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve('done'), 1000)
  })

  const pendingPromise = promise.then((val) => val)

  await vi.advanceTimersByTimeAsync(1000)

  await expect(pendingPromise).resolves.toBe('done')
})
```

### Set System Time

```typescript
it('should set system time', () => {
  const now = new Date('2024-01-01')
  vi.setSystemTime(now)

  expect(Date.now()).toBe(now.getTime())
  expect(new Date()).toEqual(now)

  vi.useRealTimers()
})
```

## Globals

### Mock Date

```typescript
const mockDate = new Date('2024-01-01T00:00:00.000Z')

vi.useFakeTimers()
vi.setSystemTime(mockDate)

it('should use mocked date', () => {
  expect(new Date()).toEqual(mockDate)
  expect(Date.now()).toBe(mockDate.getTime())
})

vi.useRealTimers()
```

### Mock Math.random

```typescript
it('should mock random', () => {
  const randomSpy = vi.spyOn(Math, 'random')
  randomSpy.mockReturnValue(0.5)

  expect(Math.random()).toBe(0.5)

  randomSpy.mockRestore()
})
```

### Mock console

```typescript
it('should mock console', () => {
  const consoleSpy = vi.spyOn(console, 'log')

  console.log('test message')

  expect(consoleSpy).toHaveBeenCalledWith('test message')

  consoleSpy.mockRestore()
})
```

### Mock Global fetch

```typescript
import { vi } from 'vitest'

global.fetch = vi.fn()

it('should mock fetch', async () => {
  vi.mocked(fetch).mockResolvedValue({
    ok: true,
    json: async () => ({ data: 'test' }),
  } as Response)

  const response = await fetch('https://api.example.com')
  const data = await response.json()

  expect(data).toEqual({ data: 'test' })
  expect(fetch).toHaveBeenCalledWith('https://api.example.com')
})
```

### Mock window/global

```typescript
it('should mock window properties', () => {
  Object.defineProperty(window, 'location', {
    value: {
      href: 'https://example.com',
    },
    writable: true,
  })

  expect(window.location.href).toBe('https://example.com')
})
```

## Advanced Patterns

### Mock Classes

```typescript
vi.mock('./UserService')

import { UserService } from './UserService'

const MockUserService = vi.mocked(UserService)

it('should mock class', () => {
  MockUserService.mockImplementation(() => ({
    getUser: vi.fn().mockResolvedValue({ id: 1 }),
    createUser: vi.fn(),
  }))

  const service = new UserService()
  expect(service.getUser).toBeDefined()
})
```

### Mock Constructors

```typescript
class Database {
  constructor(config: any) {}
  query(sql: string) {
    return []
  }
}

const MockDatabase = vi.fn().mockImplementation(() => ({
  query: vi.fn().mockReturnValue([{ id: 1 }]),
}))

vi.mock('./database', () => ({
  Database: MockDatabase,
}))
```

### Mocking Chained Methods

```typescript
const mockBuilder = {
  select: vi.fn().mockReturnThis(),
  where: vi.fn().mockReturnThis(),
  limit: vi.fn().mockReturnThis(),
  execute: vi.fn().mockResolvedValue([{ id: 1 }]),
}

it('should mock builder pattern', async () => {
  const results = await mockBuilder
    .select('*')
    .where('id', 1)
    .limit(10)
    .execute()

  expect(results).toEqual([{ id: 1 }])
  expect(mockBuilder.select).toHaveBeenCalledWith('*')
  expect(mockBuilder.where).toHaveBeenCalledWith('id', 1)
})
```

### Conditional Mocking

```typescript
import { vi } from 'vitest'

const shouldMock = process.env.USE_MOCKS === 'true'

if (shouldMock) {
  vi.mock('./api', () => ({
    fetchData: vi.fn().mockResolvedValue({ mocked: true }),
  }))
}
```

### Reset vs Clear vs Restore

```typescript
const mockFn = vi.fn()

// mockClear: Clears call history but keeps implementation
mockFn.mockClear()

// mockReset: Clears history AND resets implementation
mockFn.mockReset()

// mockRestore: Only works on spies, restores original
const spy = vi.spyOn(obj, 'method')
spy.mockRestore()

// Clear all mocks
vi.clearAllMocks()

// Reset all mocks
vi.resetAllMocks()

// Restore all mocks (spies only)
vi.restoreAllMocks()
```

### Mock Call Analysis

```typescript
const mockFn = vi.fn()

mockFn('arg1', 'arg2')
mockFn('arg3')

// Access call arguments
expect(mockFn.mock.calls).toEqual([
  ['arg1', 'arg2'],
  ['arg3'],
])

// Access specific call
expect(mockFn.mock.calls[0]).toEqual(['arg1', 'arg2'])

// Access return values
expect(mockFn.mock.results[0].value).toBe(undefined)

// Access instances (for constructor calls)
expect(mockFn.mock.instances).toHaveLength(0)
```

### Mock Async Iterations

```typescript
async function* mockGenerator() {
  yield 1
  yield 2
  yield 3
}

it('should mock async generator', async () => {
  const results = []
  for await (const value of mockGenerator()) {
    results.push(value)
  }
  expect(results).toEqual([1, 2, 3])
})
```

## Best Practices

### 1. Always Clean Up

```typescript
import { vi, afterEach } from 'vitest'

afterEach(() => {
  vi.clearAllMocks()
  vi.useRealTimers()
})
```

### 2. Use mockResolvedValue for Promises

```typescript
// ✅ Good
const mockFn = vi.fn().mockResolvedValue(data)

// ❌ Avoid
const mockFn = vi.fn().mockReturnValue(Promise.resolve(data))
```

### 3. Prefer Spies for Existing Methods

```typescript
// ✅ Good - preserves original behavior
const spy = vi.spyOn(obj, 'method')

// ❌ Avoid - replaces completely
obj.method = vi.fn()
```

### 4. Use Type-Safe Mocks

```typescript
import { vi } from 'vitest'

const mockFn = vi.fn<[string, number], boolean>()

mockFn('test', 123) // ✅ Type-safe
mockFn(123, 'test') // ❌ Type error
```

### 5. Mock at Module Level When Needed

```typescript
// ✅ Good for module-wide mocking
vi.mock('./api')

// ✅ Good for test-specific mocking
beforeEach(() => {
  vi.mocked(apiClient.get).mockResolvedValue(data)
})

afterEach(() => {
  vi.clearAllMocks()
})
```

## Common Patterns

### API Client Mocking

```typescript
vi.mock('./apiClient')

import { apiClient } from './apiClient'

beforeEach(() => {
  vi.mocked(apiClient.get).mockResolvedValue({ data: [] })
  vi.mocked(apiClient.post).mockResolvedValue({ data: {} })
})
```

### Database Mocking

```typescript
vi.mock('./database')

import { db } from './database'

beforeEach(() => {
  vi.mocked(db.query).mockResolvedValue([])
  vi.mocked(db.insert).mockResolvedValue({ id: 1 })
})
```

### React Hook Mocking

```typescript
vi.mock('react-router-dom', () => ({
  useNavigate: vi.fn(),
  useParams: vi.fn(),
}))

import { useNavigate } from 'react-router-dom'

it('should use navigate', () => {
  vi.mocked(useNavigate).mockReturnValue(mockNavigate)
  // test
})
```

## Resources

- [Vitest Mock Functions](https://vitest.dev/api/mock.html)
- [Vitest VI Utilities](https://vitest.dev/api/vi.html)
- [Testing Library Best Practices](https://testing-library.com/docs/guiding-principles)
