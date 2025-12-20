# Testing

Skills for Test-Driven Development, testing frameworks, and quality assurance.

## Available Skills

### tdd-workflow

Comprehensive Test-Driven Development workflow skill that reads project plans and generates test cases.

**Capabilities:**
- Read project plans, specifications, and requirements
- Generate comprehensive test cases from requirements
- Create test scaffolding for multiple languages and frameworks
- Support TDD workflow (Red-Green-Refactor)
- Identify edge cases and boundary conditions
- Generate tests for JavaScript/TypeScript, Python, Java, Go, Rust, Ruby, C#, PHP

**Supported Frameworks:**
- **JavaScript/TypeScript**: Jest, Vitest, Mocha, Testing Library
- **Python**: pytest, unittest
- **Java**: JUnit 5, TestNG, Mockito
- **Go**: testing package, testify
- **Rust**: built-in testing
- **Ruby**: RSpec, Minitest
- **C#**: xUnit, NUnit, MSTest
- **PHP**: PHPUnit

**Use Cases:**
- Converting requirements to test cases
- Implementing TDD practices
- Creating test scaffolding for new features
- Generating comprehensive test suites
- Learning testing best practices

**Installation:**
```bash
# Upload tdd-workflow.skill to Claude Code via Settings → Skills
```

**Usage Examples:**
- "Read this user story and generate Jest test cases"
- "Create pytest tests for this API endpoint specification"
- "Generate test cases for a shopping cart feature"
- "Write JUnit tests for this authentication requirement"

### vitest-tdd

Specialized TDD skill for Vitest - the blazing fast unit test framework powered by Vite.

**Capabilities:**
- Vitest-specific test generation and scaffolding
- React, Vue, and Svelte component testing
- Advanced mocking with `vi` utilities
- Snapshot testing patterns
- Vite integration and optimization
- Native ESM support
- Coverage configuration with c8/v8
- UI mode for interactive testing

**Supported Testing:**
- **Unit Tests**: Pure functions, utilities, business logic
- **Component Tests**: React, Vue, Svelte with Testing Library
- **Integration Tests**: API clients, services, workflows
- **Async Tests**: Promises, async/await, timers
- **Snapshot Tests**: Component rendering, output consistency

**Use Cases:**
- Testing Vite-powered applications
- React/Vue/Svelte component testing
- Modern JavaScript/TypeScript testing
- Fast test execution with HMR
- Interactive debugging with UI mode

**Installation:**
```bash
# Upload vitest-tdd.skill to Claude Code via Settings → Skills
```

**Usage Examples:**
- "Generate Vitest tests for this password validator"
- "Create React component tests with Testing Library"
- "Write async tests with vi.useFakeTimers()"
- "Generate snapshot tests for this component"
- "Mock fetch API calls in Vitest"

## TDD Principles

This category focuses on **Test-Driven Development**, which follows the cycle:

1. **RED**: Write a failing test
2. **GREEN**: Make the test pass with minimal code
3. **REFACTOR**: Improve the code while keeping tests green

### Benefits of TDD

- **Better Design**: Tests force you to think about API design first
- **Confidence**: Comprehensive test coverage enables fearless refactoring
- **Documentation**: Tests document how code should behave
- **Fewer Bugs**: Catch issues early in development
- **Faster Debugging**: Failing tests pinpoint problems quickly

### When to Use TDD

✅ **Good for**:
- Business logic and algorithms
- API and library development
- Complex validation rules
- Data transformations
- Critical functionality

⚠️ **Challenging for**:
- UI/UX experimentation
- Exploratory prototypes
- Simple CRUD operations
- Third-party integrations (use integration tests instead)

## Testing Best Practices

### Test Structure
```
describe('Feature')
  ├── describe('Success Cases')
  │   ├── should handle valid input
  │   └── should return expected format
  ├── describe('Validation')
  │   ├── should reject invalid input
  │   └── should validate required fields
  └── describe('Edge Cases')
      ├── should handle empty input
      ├── should handle large datasets
      └── should handle special characters
```

### Naming Conventions

**Good test names**:
- `should calculate total price for multiple items`
- `should reject invalid email format`
- `should throw error when user not found`

**Poor test names**:
- `test1`
- `it works`
- `testUser`

### Coverage Goals

- **Unit Tests**: 80-90% code coverage
- **Integration Tests**: Critical user paths
- **E2E Tests**: Key user journeys

## Skill Comparison

| Feature | tdd-workflow | vitest-tdd |
|---------|--------------|------------|
| **Languages** | Multi-language | JavaScript/TypeScript |
| **Frameworks** | 10+ frameworks | Vitest only |
| **Component Testing** | No | Yes (React/Vue/Svelte) |
| **Mocking** | Generic patterns | Vitest `vi` utilities |
| **Configuration** | Generic | Vitest-specific |
| **Best For** | Any language/framework | Vite-based projects |

## Future Skills

Planned additions to this category:

- **jest-tdd** - Specialized Jest TDD skill
- **playwright-e2e** - End-to-end testing with Playwright
- **cypress-e2e** - End-to-end testing with Cypress
- **contract-testing** - API contract testing with Pact
- **mutation-testing** - Test quality validation
- **property-testing** - Property-based testing (QuickCheck, Hypothesis)
- **performance-testing** - Load and performance testing
- **visual-testing** - Visual regression testing

## Testing Resources

### Books
- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/) - Freeman & Pryce
- [The Art of Unit Testing](https://www.manning.com/books/the-art-of-unit-testing-third-edition) - Roy Osherove

### Online Resources
- [Testing Library](https://testing-library.com/) - User-centric testing
- [Jest Documentation](https://jestjs.io/)
- [pytest Documentation](https://docs.pytest.org/)
- [Go Testing](https://pkg.go.dev/testing)

### Practice
- [TDD Kata](http://www.codekatas.org/) - Practice TDD with katas
- [Exercism](https://exercism.io/) - Learn TDD through exercises
- [Coding Dojo](https://codingdojo.org/) - TDD practice sessions

## Common Testing Patterns

### Arrange-Act-Assert (AAA)
```javascript
test('should add item to cart', () => {
  // Arrange: Setup
  const cart = new ShoppingCart();
  const item = { id: 1, price: 10 };

  // Act: Execute
  cart.addItem(item);

  // Assert: Verify
  expect(cart.items).toContain(item);
});
```

### Given-When-Then (BDD)
```python
def test_user_registration():
    # Given: User with valid data
    user_data = {'email': 'test@example.com', 'password': 'Password123'}

    # When: User registers
    user = register_user(user_data)

    # Then: User is created and active
    assert user.id is not None
    assert user.active is True
```

### Test Fixtures
```python
@pytest.fixture
def database():
    db = Database(':memory:')
    db.setup()
    yield db
    db.teardown()

def test_query(database):
    result = database.query('SELECT * FROM users')
    assert result is not None
```

## Contributing

Have a testing skill to add? See [CONTRIBUTING.md](../../CONTRIBUTING.md) for guidelines.

Ideas for new skills:
- Framework-specific skills (Cypress, Playwright, Selenium)
- Testing pattern libraries
- Test data generators
- Mock/stub helpers
- Coverage analyzers
