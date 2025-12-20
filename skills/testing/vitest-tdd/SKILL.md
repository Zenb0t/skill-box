# Vitest TDD

> Specialized Test-Driven Development skill for Vitest - the blazing fast unit test framework powered by Vite.

## Overview

The Vitest TDD skill is a specialized implementation of TDD practices specifically for Vitest. It provides:
- Vitest-specific test generation and scaffolding
- Modern JavaScript/TypeScript testing patterns
- Component testing with React, Vue, and Svelte
- Vite integration and optimization
- Native ESM support
- Advanced mocking with `vi` utilities
- Snapshot testing patterns
- Coverage configuration with c8/v8

This skill builds on the generic [tdd-workflow](../tdd-workflow/SKILL.md) skill but focuses exclusively on Vitest's features and ecosystem.

## Capabilities

### Test Generation
- Generate Vitest test suites from requirements
- Create describe/it/test blocks with proper structure
- Implement beforeEach/afterEach setup patterns
- Generate parameterized tests with test.each
- Create concurrent test suites with test.concurrent

### Component Testing
- **React**: Test components with @testing-library/react
- **Vue**: Test components with @testing-library/vue
- **Svelte**: Test components with @testing-library/svelte
- User interaction testing with fireEvent and userEvent
- Async component testing
- Custom hook testing

### Mocking & Spying
- Mock modules with `vi.mock()`
- Create spies with `vi.spyOn()`
- Mock timers with `vi.useFakeTimers()`
- Mock dates, random, and globals
- Partial module mocking
- Factory function mocking

### Snapshot Testing
- Generate component snapshots
- Inline snapshots with `toMatchInlineSnapshot()`
- Update snapshots workflow
- Snapshot serializers
- Custom matchers

### Configuration & Setup
- Vitest configuration (vitest.config.ts)
- Multiple test environments (node, jsdom, happy-dom)
- Global test setup files
- Custom matchers and utilities
- Coverage configuration with c8
- Reporter configuration

### Advanced Features
- UI mode for interactive testing
- Workspace support for monorepos
- Benchmark testing with bench
- Type testing with expectTypeOf and assertType
- In-source testing
- Browser mode (experimental)

## Prerequisites

- **Node.js**: 16.14+ or 18+
- **Vite**: 2.x or 3.x+ (automatically included with Vitest)
- **TypeScript** (optional but recommended)
- **Testing Library** (for component testing)

## Installation

```bash
# Install Vitest
npm install -D vitest

# For React component testing
npm install -D @testing-library/react @testing-library/jest-dom
npm install -D @testing-library/user-event jsdom

# For Vue component testing
npm install -D @testing-library/vue @testing-library/jest-dom
npm install -D jsdom

# For coverage
npm install -D @vitest/coverage-c8
# or
npm install -D @vitest/coverage-v8

# For UI mode
npm install -D @vitest/ui
```

## Usage Examples

### Example 1: Unit Test from Requirement

**Requirement**: Create a password validator that checks length, uppercase, lowercase, and numbers

**Generated Test**:
```typescript
import { describe, it, expect } from 'vitest'
import { validatePassword } from './password'

describe('Password Validator', () => {
  describe('Valid Passwords', () => {
    it('should accept password with all requirements', () => {
      // Arrange
      const password = 'Password123'

      // Act
      const result = validatePassword(password)

      // Assert
      expect(result.isValid).toBe(true)
      expect(result.errors).toHaveLength(0)
    })
  })

  describe('Length Validation', () => {
    it('should reject password shorter than 8 characters', () => {
      const result = validatePassword('Pass1')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must be at least 8 characters')
    })

    it('should accept password with exactly 8 characters', () => {
      const result = validatePassword('Pass123!')

      expect(result.isValid).toBe(true)
    })
  })

  describe('Character Requirements', () => {
    it('should reject password without uppercase letter', () => {
      const result = validatePassword('password123')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain uppercase letter')
    })

    it('should reject password without lowercase letter', () => {
      const result = validatePassword('PASSWORD123')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain lowercase letter')
    })

    it('should reject password without number', () => {
      const result = validatePassword('Password')

      expect(result.isValid).toBe(false)
      expect(result.errors).toContain('Password must contain number')
    })
  })

  describe('Edge Cases', () => {
    it('should handle empty string', () => {
      const result = validatePassword('')

      expect(result.isValid).toBe(false)
      expect(result.errors.length).toBeGreaterThan(0)
    })

    it('should handle very long password', () => {
      const longPassword = 'P'.repeat(100) + 'assword123'

      const result = validatePassword(longPassword)

      expect(result.isValid).toBe(true)
    })
  })
})

// Parameterized tests
describe.each([
  { password: 'Password123', expected: true },
  { password: 'pass123', expected: false },
  { password: 'PASSWORD123', expected: false },
  { password: 'Password', expected: false },
  { password: 'Pass1', expected: false },
])('validatePassword($password)', ({ password, expected }) => {
  it(`should return ${expected}`, () => {
    expect(validatePassword(password).isValid).toBe(expected)
  })
})
```

### Example 2: React Component Test

**Requirement**: Test a Counter component with increment/decrement buttons

**Generated Test**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Counter } from './Counter'

describe('Counter Component', () => {
  it('should render initial count', () => {
    // Arrange & Act
    render(<Counter initialCount={0} />)

    // Assert
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })

  it('should render with custom initial count', () => {
    render(<Counter initialCount={5} />)

    expect(screen.getByText('Count: 5')).toBeInTheDocument()
  })

  describe('Increment Button', () => {
    it('should increment count when clicked', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<Counter initialCount={0} />)

      // Act
      await user.click(screen.getByRole('button', { name: /increment/i }))

      // Assert
      expect(screen.getByText('Count: 1')).toBeInTheDocument()
    })

    it('should increment multiple times', async () => {
      const user = userEvent.setup()
      render(<Counter initialCount={0} />)

      await user.click(screen.getByRole('button', { name: /increment/i }))
      await user.click(screen.getByRole('button', { name: /increment/i }))
      await user.click(screen.getByRole('button', { name: /increment/i }))

      expect(screen.getByText('Count: 3')).toBeInTheDocument()
    })
  })

  describe('Decrement Button', () => {
    it('should decrement count when clicked', async () => {
      const user = userEvent.setup()
      render(<Counter initialCount={5} />)

      await user.click(screen.getByRole('button', { name: /decrement/i }))

      expect(screen.getByText('Count: 4')).toBeInTheDocument()
    })

    it('should not go below zero', async () => {
      const user = userEvent.setup()
      render(<Counter initialCount={0} />)

      await user.click(screen.getByRole('button', { name: /decrement/i }))

      expect(screen.getByText('Count: 0')).toBeInTheDocument()
    })
  })

  describe('Reset Button', () => {
    it('should reset count to initial value', async () => {
      const user = userEvent.setup()
      render(<Counter initialCount={5} />)

      await user.click(screen.getByRole('button', { name: /increment/i }))
      await user.click(screen.getByRole('button', { name: /reset/i }))

      expect(screen.getByText('Count: 5')).toBeInTheDocument()
    })
  })

  describe('Callbacks', () => {
    it('should call onChange when count changes', async () => {
      // Arrange
      const handleChange = vi.fn()
      const user = userEvent.setup()
      render(<Counter initialCount={0} onChange={handleChange} />)

      // Act
      await user.click(screen.getByRole('button', { name: /increment/i }))

      // Assert
      expect(handleChange).toHaveBeenCalledWith(1)
      expect(handleChange).toHaveBeenCalledTimes(1)
    })
  })

  describe('Accessibility', () => {
    it('should have accessible button labels', () => {
      render(<Counter initialCount={0} />)

      expect(screen.getByRole('button', { name: /increment/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /decrement/i })).toBeInTheDocument()
    })

    it('should display count with proper semantics', () => {
      render(<Counter initialCount={5} />)

      const countDisplay = screen.getByText(/count:/i)
      expect(countDisplay).toBeInTheDocument()
    })
  })
})
```

### Example 3: Mocking with vi

**Requirement**: Test a service that fetches user data from an API

**Generated Test**:
```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { fetchUser, UserService } from './userService'

// Mock the fetch function
global.fetch = vi.fn()

describe('UserService', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks()
  })

  afterEach(() => {
    // Reset mocks after each test
    vi.resetAllMocks()
  })

  describe('fetchUser', () => {
    it('should fetch user data successfully', async () => {
      // Arrange
      const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }

      vi.mocked(fetch).mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      } as Response)

      // Act
      const user = await fetchUser(1)

      // Assert
      expect(user).toEqual(mockUser)
      expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/1')
      expect(fetch).toHaveBeenCalledTimes(1)
    })

    it('should throw error when fetch fails', async () => {
      // Arrange
      vi.mocked(fetch).mockResolvedValueOnce({
        ok: false,
        status: 404,
        statusText: 'Not Found',
      } as Response)

      // Act & Assert
      await expect(fetchUser(999)).rejects.toThrow('User not found')
      expect(fetch).toHaveBeenCalledWith('https://api.example.com/users/999')
    })

    it('should throw error on network failure', async () => {
      // Arrange
      vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'))

      // Act & Assert
      await expect(fetchUser(1)).rejects.toThrow('Network error')
    })
  })

  describe('UserService with spies', () => {
    it('should call fetchUser when getting user profile', async () => {
      // Arrange
      const service = new UserService()
      const fetchUserSpy = vi.spyOn(service, 'fetchUser')

      fetchUserSpy.mockResolvedValueOnce({
        id: 1,
        name: 'John',
        email: 'john@example.com'
      })

      // Act
      await service.getUserProfile(1)

      // Assert
      expect(fetchUserSpy).toHaveBeenCalledWith(1)
      expect(fetchUserSpy).toHaveBeenCalledTimes(1)
    })
  })

  describe('Timers', () => {
    it('should retry after delay on failure', async () => {
      // Arrange
      vi.useFakeTimers()

      vi.mocked(fetch)
        .mockRejectedValueOnce(new Error('Timeout'))
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ id: 1, name: 'John' }),
        } as Response)

      // Act
      const promise = fetchUser(1)

      // Fast-forward time
      await vi.advanceTimersByTimeAsync(1000)

      const user = await promise

      // Assert
      expect(user).toEqual({ id: 1, name: 'John' })
      expect(fetch).toHaveBeenCalledTimes(2)

      vi.useRealTimers()
    })
  })
})

// Module mocking
vi.mock('./api', () => ({
  apiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
}))

describe('UserService with mocked module', () => {
  it('should use mocked API client', async () => {
    const { apiClient } = await import('./api')

    vi.mocked(apiClient.get).mockResolvedValueOnce({
      data: { id: 1, name: 'John' }
    })

    const service = new UserService()
    const user = await service.fetchUser(1)

    expect(user.name).toBe('John')
    expect(apiClient.get).toHaveBeenCalledWith('/users/1')
  })
})
```

### Example 4: Async Testing

**Requirement**: Test a form submission handler

**Generated Test**:
```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    // Arrange
    const handleSubmit = vi.fn().mockResolvedValue({ success: true })
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Assert
    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'Password123',
      })
    })
  })

  it('should show loading state during submission', async () => {
    // Arrange
    const handleSubmit = vi.fn(() => new Promise(resolve => {
      setTimeout(() => resolve({ success: true }), 100)
    }))
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'Password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Assert - Loading state
    expect(screen.getByText(/logging in/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /login/i })).toBeDisabled()

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.queryByText(/logging in/i)).not.toBeInTheDocument()
    })
  })

  it('should display error on failed submission', async () => {
    // Arrange
    const handleSubmit = vi.fn().mockRejectedValue(
      new Error('Invalid credentials')
    )
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    // Act
    await user.type(screen.getByLabelText(/email/i), 'test@example.com')
    await user.type(screen.getByLabelText(/password/i), 'wrong')
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument()
    })
  })

  it('should validate email format', async () => {
    // Arrange
    const handleSubmit = vi.fn()
    const user = userEvent.setup()

    render(<LoginForm onSubmit={handleSubmit} />)

    // Act
    await user.type(screen.getByLabelText(/email/i), 'invalid-email')
    await user.type(screen.getByLabelText(/password/i), 'Password123')
    await user.click(screen.getByRole('button', { name: /login/i }))

    // Assert
    expect(await screen.findByText(/invalid email format/i)).toBeInTheDocument()
    expect(handleSubmit).not.toHaveBeenCalled()
  })
})
```

### Example 5: Snapshot Testing

**Requirement**: Test that components render consistently

**Generated Test**:
```typescript
import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { UserCard } from './UserCard'

describe('UserCard Snapshots', () => {
  it('should match snapshot with user data', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://example.com/avatar.jpg',
    }

    const { container } = render(<UserCard user={user} />)

    expect(container).toMatchSnapshot()
  })

  it('should match inline snapshot for user name', () => {
    const user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    }

    const { container } = render(<UserCard user={user} />)
    const userName = container.querySelector('.user-name')

    expect(userName?.textContent).toMatchInlineSnapshot('"John Doe"')
  })

  it('should render loading state snapshot', () => {
    const { container } = render(<UserCard isLoading />)

    expect(container).toMatchSnapshot()
  })

  it('should render error state snapshot', () => {
    const { container } = render(
      <UserCard error={new Error('Failed to load')} />
    )

    expect(container).toMatchSnapshot()
  })
})
```

## Reference Documentation

- [Vitest Configuration](references/vitest-config.md) - Complete configuration guide
- [Component Testing](references/component-testing.md) - React, Vue, Svelte testing patterns
- [Mocking Guide](references/mocking.md) - Comprehensive mocking with vi utilities
- [Best Practices](references/best-practices.md) - Vitest-specific best practices

## Vitest-Specific Features

### Test Filtering

```typescript
// Run only specific tests
test.only('runs only this test', () => {
  expect(true).toBe(true)
})

// Skip tests
test.skip('skips this test', () => {
  expect(true).toBe(true)
})

// Run tests concurrently
test.concurrent('runs concurrently', async () => {
  await someAsyncOperation()
})

// Todo tests
test.todo('implement this test later')
```

### Type Testing

```typescript
import { expectTypeOf, assertType } from 'vitest'

it('should have correct types', () => {
  expectTypeOf({ name: 'John' }).toEqualTypeOf<{ name: string }>()
  expectTypeOf(123).toBeNumber()
  expectTypeOf('hello').toBeString()

  const value = getValue()
  assertType<string>(value)
})
```

### Benchmark Testing

```typescript
import { bench, describe } from 'vitest'

describe('Performance', () => {
  bench('sort 1000 items', () => {
    const arr = Array.from({ length: 1000 }, () => Math.random())
    arr.sort()
  })

  bench('find in array', () => {
    const arr = Array.from({ length: 1000 }, (_, i) => i)
    arr.find(x => x === 500)
  })
})
```

## Configuration Examples

### Basic vitest.config.ts

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'c8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'test/',
      ],
    },
  },
})
```

### With React

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'],
  },
})
```

## Limitations

- Primarily focused on JavaScript/TypeScript projects
- Requires Vite or compatible build tool
- Component testing limited to React, Vue, and Svelte
- Some Jest plugins may not be compatible
- Browser mode is still experimental

## Related Skills

- **tdd-workflow** - Generic TDD skill for all languages
- **shadcn-ui** - UI component testing patterns
- **github-workflow** - CI/CD integration for test automation

## Version History

- **1.0.0** (2024-12-20) - Initial release
  - Vitest test generation
  - Component testing support
  - Mocking and spying patterns
  - Snapshot testing
  - Configuration templates

## Contributing

Contributions welcome! Areas for improvement:
- Additional component framework examples
- More complex mocking scenarios
- Browser mode examples (when stable)
- Playwright integration examples

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.

## License

This skill is licensed under the MIT License - see [LICENSE.txt](LICENSE.txt) for details.

## Resources

- [Vitest Documentation](https://vitest.dev/)
- [Testing Library](https://testing-library.com/)
- [Vite Documentation](https://vitejs.dev/)
- [Modern JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
- [Component Testing Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
