# TDD Workflow

> Test-Driven Development skill that reads project plans and generates comprehensive test cases and test scaffolding across multiple languages and frameworks.

## Overview

The TDD Workflow skill helps developers implement Test-Driven Development practices by:
- Reading project plans, specifications, and requirements
- Generating test cases from requirements
- Creating test scaffolding for multiple languages and frameworks
- Following the Red-Green-Refactor cycle
- Identifying edge cases and boundary conditions
- Suggesting test organization and structure

This skill is designed to work with any codebase and supports multiple programming languages and testing frameworks.

## Capabilities

### Plan Analysis
- Parse project plans, user stories, and requirements documents
- Extract testable requirements and acceptance criteria
- Identify edge cases, boundary conditions, and error scenarios
- Map requirements to test cases
- Suggest test coverage strategies

### Test Case Generation
- Create comprehensive test case descriptions
- Generate test case templates for different frameworks
- Include setup, execution, and assertion steps
- Document expected inputs and outputs
- Cover happy paths, edge cases, and error conditions

### Multi-Language Support
- **JavaScript/TypeScript**: Jest, Vitest, Mocha, Chai, Testing Library
- **Python**: pytest, unittest, doctest
- **Java**: JUnit 5, TestNG, Mockito
- **Go**: testing package, testify
- **Rust**: built-in testing framework
- **Ruby**: RSpec, Minitest
- **C#**: xUnit, NUnit, MSTest
- **PHP**: PHPUnit

### TDD Workflow Support
- **Red Phase**: Generate failing tests based on requirements
- **Green Phase**: Suggest minimal implementation to pass tests
- **Refactor Phase**: Identify refactoring opportunities while keeping tests green
- Maintain test-first discipline throughout development

### Test Organization
- Suggest test file structure and naming conventions
- Organize tests by feature, component, or layer
- Create test suites and test groups
- Implement test fixtures and factories
- Set up mocks, stubs, and test doubles

## Prerequisites

- **Understanding**: Basic knowledge of testing concepts
- **Tools**: Testing framework installed for your language
- **Project**: Existing codebase or project plan
- **Optional**: Test runner configured in your build system

## Usage Examples

### Example 1: Generate Test Cases from User Story

**Task**: Read a user story and generate test cases

**Input**:
```markdown
User Story: As a user, I want to register an account with email and password

Acceptance Criteria:
- Email must be valid format
- Password must be at least 8 characters
- Password must contain uppercase, lowercase, and number
- Email must be unique in system
- Success returns user object with id
```

**Output**:
```javascript
// Test cases generated for Jest/Testing Library

describe('User Registration', () => {
  describe('Valid Registration', () => {
    it('should successfully register user with valid email and password', async () => {
      // Arrange
      const userData = {
        email: 'user@example.com',
        password: 'Password123'
      };

      // Act
      const result = await registerUser(userData);

      // Assert
      expect(result).toHaveProperty('id');
      expect(result.email).toBe(userData.email);
    });
  });

  describe('Email Validation', () => {
    it('should reject invalid email format', async () => {
      const userData = {
        email: 'invalid-email',
        password: 'Password123'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Invalid email format');
    });

    it('should reject duplicate email', async () => {
      const userData = {
        email: 'existing@example.com',
        password: 'Password123'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Email already exists');
    });
  });

  describe('Password Validation', () => {
    it('should reject password shorter than 8 characters', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'Pass1'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Password must be at least 8 characters');
    });

    it('should reject password without uppercase letter', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'password123'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Password must contain uppercase letter');
    });

    it('should reject password without lowercase letter', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'PASSWORD123'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Password must contain lowercase letter');
    });

    it('should reject password without number', async () => {
      const userData = {
        email: 'user@example.com',
        password: 'Password'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Password must contain number');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty email', async () => {
      const userData = {
        email: '',
        password: 'Password123'
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Email is required');
    });

    it('should handle empty password', async () => {
      const userData = {
        email: 'user@example.com',
        password: ''
      };

      await expect(registerUser(userData))
        .rejects.toThrow('Password is required');
    });

    it('should trim whitespace from email', async () => {
      const userData = {
        email: '  user@example.com  ',
        password: 'Password123'
      };

      const result = await registerUser(userData);
      expect(result.email).toBe('user@example.com');
    });
  });
});
```

### Example 2: Generate Python Test Cases from Specification

**Task**: Create pytest tests for a shopping cart feature

**Input**:
```
Feature: Shopping Cart
- Add items to cart
- Remove items from cart
- Update item quantities
- Calculate total price
- Apply discount codes
- Clear cart
```

**Output**:
```python
import pytest
from decimal import Decimal
from shopping_cart import ShoppingCart, Item

class TestShoppingCart:
    """Test suite for ShoppingCart functionality"""

    @pytest.fixture
    def cart(self):
        """Fixture providing fresh cart for each test"""
        return ShoppingCart()

    @pytest.fixture
    def sample_item(self):
        """Fixture providing sample item"""
        return Item(id=1, name="Widget", price=Decimal("9.99"))

    class TestAddItems:
        """Tests for adding items to cart"""

        def test_add_item_to_empty_cart(self, cart, sample_item):
            """Should add item to empty cart"""
            cart.add_item(sample_item, quantity=1)

            assert len(cart.items) == 1
            assert cart.items[0].item == sample_item
            assert cart.items[0].quantity == 1

        def test_add_multiple_quantities(self, cart, sample_item):
            """Should add item with specified quantity"""
            cart.add_item(sample_item, quantity=3)

            assert cart.items[0].quantity == 3

        def test_add_same_item_twice_increases_quantity(self, cart, sample_item):
            """Should increase quantity when adding existing item"""
            cart.add_item(sample_item, quantity=2)
            cart.add_item(sample_item, quantity=3)

            assert len(cart.items) == 1
            assert cart.items[0].quantity == 5

        def test_add_item_with_zero_quantity_raises_error(self, cart, sample_item):
            """Should raise error for zero quantity"""
            with pytest.raises(ValueError, match="Quantity must be positive"):
                cart.add_item(sample_item, quantity=0)

        def test_add_item_with_negative_quantity_raises_error(self, cart, sample_item):
            """Should raise error for negative quantity"""
            with pytest.raises(ValueError, match="Quantity must be positive"):
                cart.add_item(sample_item, quantity=-1)

    class TestRemoveItems:
        """Tests for removing items from cart"""

        def test_remove_item_from_cart(self, cart, sample_item):
            """Should remove item from cart"""
            cart.add_item(sample_item, quantity=1)
            cart.remove_item(sample_item.id)

            assert len(cart.items) == 0

        def test_remove_nonexistent_item_raises_error(self, cart):
            """Should raise error when removing non-existent item"""
            with pytest.raises(KeyError, match="Item not found"):
                cart.remove_item(999)

    class TestUpdateQuantity:
        """Tests for updating item quantities"""

        def test_update_item_quantity(self, cart, sample_item):
            """Should update quantity of existing item"""
            cart.add_item(sample_item, quantity=2)
            cart.update_quantity(sample_item.id, 5)

            assert cart.items[0].quantity == 5

        def test_update_to_zero_removes_item(self, cart, sample_item):
            """Should remove item when quantity updated to zero"""
            cart.add_item(sample_item, quantity=2)
            cart.update_quantity(sample_item.id, 0)

            assert len(cart.items) == 0

    class TestCalculateTotal:
        """Tests for total price calculation"""

        def test_empty_cart_total_is_zero(self, cart):
            """Should return zero for empty cart"""
            assert cart.get_total() == Decimal("0.00")

        def test_single_item_total(self, cart, sample_item):
            """Should calculate total for single item"""
            cart.add_item(sample_item, quantity=1)

            assert cart.get_total() == Decimal("9.99")

        def test_multiple_quantities_total(self, cart, sample_item):
            """Should calculate total for multiple quantities"""
            cart.add_item(sample_item, quantity=3)

            assert cart.get_total() == Decimal("29.97")

        def test_multiple_items_total(self, cart):
            """Should calculate total for multiple different items"""
            item1 = Item(id=1, name="Widget", price=Decimal("9.99"))
            item2 = Item(id=2, name="Gadget", price=Decimal("15.50"))

            cart.add_item(item1, quantity=2)
            cart.add_item(item2, quantity=1)

            assert cart.get_total() == Decimal("35.48")

    class TestDiscountCodes:
        """Tests for discount code application"""

        def test_apply_percentage_discount(self, cart, sample_item):
            """Should apply percentage discount to total"""
            cart.add_item(sample_item, quantity=1)
            cart.apply_discount("SAVE10", discount_type="percentage", value=10)

            assert cart.get_total() == Decimal("8.99")

        def test_apply_fixed_discount(self, cart, sample_item):
            """Should apply fixed amount discount"""
            cart.add_item(sample_item, quantity=1)
            cart.apply_discount("SAVE5", discount_type="fixed", value=5)

            assert cart.get_total() == Decimal("4.99")

        def test_invalid_discount_code_raises_error(self, cart):
            """Should raise error for invalid discount code"""
            with pytest.raises(ValueError, match="Invalid discount code"):
                cart.apply_discount("INVALID")

        def test_discount_cannot_make_total_negative(self, cart, sample_item):
            """Should not allow discount to make total negative"""
            cart.add_item(sample_item, quantity=1)
            cart.apply_discount("SAVE20", discount_type="fixed", value=20)

            assert cart.get_total() == Decimal("0.00")

    class TestClearCart:
        """Tests for clearing cart"""

        def test_clear_removes_all_items(self, cart, sample_item):
            """Should remove all items from cart"""
            cart.add_item(sample_item, quantity=3)
            cart.clear()

            assert len(cart.items) == 0
            assert cart.get_total() == Decimal("0.00")

        def test_clear_removes_discount(self, cart, sample_item):
            """Should remove applied discount"""
            cart.add_item(sample_item, quantity=1)
            cart.apply_discount("SAVE10", discount_type="percentage", value=10)
            cart.clear()

            assert cart.discount is None


# Parametrized tests for edge cases
@pytest.mark.parametrize("quantity,expected_total", [
    (1, Decimal("9.99")),
    (2, Decimal("19.98")),
    (10, Decimal("99.90")),
    (100, Decimal("999.00"))
])
def test_quantity_total_calculation(quantity, expected_total):
    """Test total calculation with various quantities"""
    cart = ShoppingCart()
    item = Item(id=1, name="Widget", price=Decimal("9.99"))
    cart.add_item(item, quantity=quantity)

    assert cart.get_total() == expected_total
```

### Example 3: Generate Test Cases for API Endpoint

**Task**: Create tests for RESTful API endpoint

**Input**:
```
API Endpoint: POST /api/users
Purpose: Create new user
Request Body: { name, email, role }
Responses:
  - 201: User created successfully
  - 400: Invalid input
  - 409: Email already exists
  - 500: Server error
```

**Output**:
```javascript
// Jest + Supertest
const request = require('supertest');
const app = require('../app');
const { User } = require('../models');

describe('POST /api/users', () => {
  beforeEach(async () => {
    // Clean up database before each test
    await User.deleteMany({});
  });

  describe('Successful User Creation', () => {
    it('should create user with valid data and return 201', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201)
        .expect('Content-Type', /json/);

      expect(response.body).toMatchObject({
        id: expect.any(String),
        name: userData.name,
        email: userData.email,
        role: userData.role,
        createdAt: expect.any(String)
      });

      // Verify user was saved to database
      const user = await User.findById(response.body.id);
      expect(user).toBeTruthy();
      expect(user.email).toBe(userData.email);
    });

    it('should create admin user when role is admin', async () => {
      const userData = {
        name: 'Admin User',
        email: 'admin@example.com',
        role: 'admin'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.role).toBe('admin');
    });
  });

  describe('Validation Errors (400)', () => {
    it('should return 400 when name is missing', async () => {
      const userData = {
        email: 'john@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.stringContaining('name')
      });
    });

    it('should return 400 when email is missing', async () => {
      const userData = {
        name: 'John Doe',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.stringContaining('email')
      });
    });

    it('should return 400 when email format is invalid', async () => {
      const userData = {
        name: 'John Doe',
        email: 'invalid-email',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.stringContaining('email')
      });
    });

    it('should return 400 when role is invalid', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'superuser'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);

      expect(response.body).toMatchObject({
        error: expect.stringContaining('role')
      });
    });

    it('should return 400 when request body is empty', async () => {
      await request(app)
        .post('/api/users')
        .send({})
        .expect(400);
    });
  });

  describe('Duplicate Email (409)', () => {
    it('should return 409 when email already exists', async () => {
      // Create user first
      await User.create({
        name: 'Existing User',
        email: 'existing@example.com',
        role: 'user'
      });

      // Try to create user with same email
      const userData = {
        name: 'New User',
        email: 'existing@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(409);

      expect(response.body).toMatchObject({
        error: expect.stringContaining('email already exists')
      });
    });
  });

  describe('Edge Cases', () => {
    it('should trim whitespace from name and email', async () => {
      const userData = {
        name: '  John Doe  ',
        email: '  john@example.com  ',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.name).toBe('John Doe');
      expect(response.body.email).toBe('john@example.com');
    });

    it('should handle very long names', async () => {
      const userData = {
        name: 'A'.repeat(255),
        email: 'john@example.com',
        role: 'user'
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);
    });

    it('should reject name exceeding maximum length', async () => {
      const userData = {
        name: 'A'.repeat(256),
        email: 'john@example.com',
        role: 'user'
      };

      await request(app)
        .post('/api/users')
        .send(userData)
        .expect(400);
    });

    it('should handle unicode characters in name', async () => {
      const userData = {
        name: '山田太郎',
        email: 'yamada@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.name).toBe('山田太郎');
    });
  });

  describe('Security', () => {
    it('should not expose sensitive data in response', async () => {
      const userData = {
        name: 'John Doe',
        email: 'john@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body).not.toHaveProperty('password');
      expect(response.body).not.toHaveProperty('passwordHash');
    });

    it('should sanitize XSS attempts in name', async () => {
      const userData = {
        name: '<script>alert("xss")</script>',
        email: 'john@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(userData)
        .expect(201);

      expect(response.body.name).not.toContain('<script>');
    });
  });
});
```

## Reference Documentation

- [Test Frameworks](references/frameworks.md) - Comprehensive guide to supported testing frameworks
- [TDD Workflow](references/tdd-workflow.md) - Detailed TDD process and best practices
- [Test Patterns](references/test-patterns.md) - Common test patterns and anti-patterns
- [Test Templates](assets/templates/) - Ready-to-use test templates for various languages

## TDD Workflow

### 1. Red Phase - Write Failing Test
```
Read requirement → Generate test case → Write test → Run (should fail)
```

### 2. Green Phase - Make Test Pass
```
Write minimal code → Run test → Passes → Move to next test
```

### 3. Refactor Phase - Improve Code
```
Improve implementation → Keep tests passing → Enhance test coverage
```

## Limitations

- Cannot generate tests for code that doesn't have clear requirements
- May need human review for complex business logic edge cases
- Test quality depends on clarity of input specifications
- Some framework-specific features may require manual adjustment
- Cannot automatically determine all possible edge cases without domain knowledge

## Best Practices Applied

- **Arrange-Act-Assert (AAA)** pattern for test structure
- **Descriptive test names** that explain what is being tested
- **One assertion per test** (when practical)
- **Test isolation** - each test is independent
- **Clear test data** - fixtures and factories for reusable data
- **Edge case coverage** - boundary conditions, null/empty values
- **Error path testing** - verify error handling works correctly
- **Mocking/stubbing** - isolate unit under test from dependencies

## Troubleshooting

### Issue: Generated tests don't match my testing framework
**Solution**: Specify the framework and version in your request: "Generate pytest 7.x tests for..."

### Issue: Tests are too detailed/verbose
**Solution**: Request specific test granularity: "Generate high-level integration tests..." or "Generate detailed unit tests..."

### Issue: Missing edge cases
**Solution**: Provide more context about the domain: "Consider these business rules..." or "Include tests for these edge cases..."

### Issue: Test setup is too complex
**Solution**: Request fixture/factory patterns: "Use pytest fixtures for test data" or "Create factory functions for test objects"

## Related Skills

- **skill-creator** - Create new testing skills for specific frameworks
- **github-workflow** - Set up CI/CD for automated test running

## Version History

- **1.0.0** (2024-12-20) - Initial release
  - Multi-language test generation
  - Plan-to-test conversion
  - TDD workflow support
  - Common framework templates

## Contributing

Contributions welcome! To add support for new testing frameworks or improve test generation:
1. Add framework documentation to `references/frameworks.md`
2. Create templates in `assets/templates/`
3. Submit PR with examples

See [CONTRIBUTING.md](../../../CONTRIBUTING.md) for guidelines.

## License

This skill is licensed under the MIT License - see [LICENSE.txt](LICENSE.txt) for details.

## Resources

- [Test-Driven Development by Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530) - Kent Beck
- [Growing Object-Oriented Software, Guided by Tests](http://www.growing-object-oriented-software.com/) - Steve Freeman
- [pytest Documentation](https://docs.pytest.org/)
- [Jest Documentation](https://jestjs.io/)
- [JUnit 5 User Guide](https://junit.org/junit5/docs/current/user-guide/)
