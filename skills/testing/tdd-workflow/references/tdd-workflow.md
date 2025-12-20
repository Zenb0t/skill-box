# TDD Workflow Guide

Comprehensive guide to the Test-Driven Development process and best practices.

## The TDD Cycle

Test-Driven Development follows a strict cycle known as **Red-Green-Refactor**:

```
┌─────────────────────────────────────┐
│                                     │
│  1. RED: Write a Failing Test       │
│     ↓                               │
│  2. GREEN: Make the Test Pass       │
│     ↓                               │
│  3. REFACTOR: Improve the Code      │
│     ↓                               │
│  (Repeat)                           │
│                                     │
└─────────────────────────────────────┘
```

## Phase 1: RED - Write a Failing Test

### Goal
Write a test that fails because the functionality doesn't exist yet.

### Steps

1. **Read the requirement**
   ```
   Requirement: Users should be able to add items to their cart
   ```

2. **Write the test FIRST**
   ```javascript
   test('should add item to empty cart', () => {
     const cart = new ShoppingCart();
     const item = { id: 1, name: 'Widget', price: 9.99 };

     cart.addItem(item);

     expect(cart.items).toHaveLength(1);
     expect(cart.items[0]).toEqual(item);
   });
   ```

3. **Run the test - it should FAIL**
   ```
   ✗ ShoppingCart is not defined
   ```

### Why This Matters

- Ensures the test can actually fail (validates test quality)
- Defines the API before implementation
- Clarifies requirements through concrete examples
- Creates a safety net before writing code

### Common Mistakes

❌ **Writing implementation before test**
```javascript
// DON'T DO THIS
class ShoppingCart {
  constructor() {
    this.items = [];
  }
  addItem(item) {
    this.items.push(item);
  }
}
// Then write tests
```

✅ **Write test first**
```javascript
// DO THIS
test('should add item to cart', () => {
  // Test defines what we want
  const cart = new ShoppingCart();
  cart.addItem(item);
  expect(cart.items).toContain(item);
});
// Now implement
```

## Phase 2: GREEN - Make the Test Pass

### Goal
Write the **minimal** code necessary to make the test pass.

### Steps

1. **Write the simplest implementation**
   ```javascript
   class ShoppingCart {
     constructor() {
       this.items = [];
     }

     addItem(item) {
       this.items.push(item);
     }
   }
   ```

2. **Run the test - it should PASS**
   ```
   ✓ should add item to empty cart
   ```

3. **Resist the urge to add extra features**

### The Minimal Implementation Rule

Write only enough code to make the current test pass.

❌ **Over-engineering**
```javascript
class ShoppingCart {
  constructor() {
    this.items = [];
    this.total = 0; // Not needed yet!
    this.discount = 0; // Not needed yet!
  }

  addItem(item) {
    this.validateItem(item); // Not needed yet!
    this.items.push(item);
    this.updateTotal(); // Not needed yet!
  }
}
```

✅ **Minimal implementation**
```javascript
class ShoppingCart {
  constructor() {
    this.items = [];
  }

  addItem(item) {
    this.items.push(item);
  }
}
```

### Fake It 'Til You Make It

Sometimes, return a hard-coded value to make the test pass, then generalize:

```javascript
// First test
test('should return true for positive numbers', () => {
  expect(isPositive(5)).toBe(true);
});

// Simplest implementation (fake it)
function isPositive(n) {
  return true; // Hard-coded!
}

// Second test forces real implementation
test('should return false for negative numbers', () => {
  expect(isPositive(-5)).toBe(false);
});

// Now we need real logic
function isPositive(n) {
  return n > 0;
}
```

## Phase 3: REFACTOR - Improve the Code

### Goal
Improve code quality while keeping all tests green.

### What to Refactor

1. **Remove duplication**
2. **Improve names**
3. **Extract methods**
4. **Simplify logic**
5. **Improve performance** (if needed)

### Steps

1. **Look for code smells**
   ```javascript
   // Before refactoring
   class ShoppingCart {
     addItem(item) {
       this.items.push(item);
     }

     getTotalPrice() {
       let total = 0;
       for (let i = 0; i < this.items.length; i++) {
         total += this.items[i].price * this.items[i].quantity;
       }
       return total;
     }

     getTotalWithTax() {
       let total = 0;
       for (let i = 0; i < this.items.length; i++) {
         total += this.items[i].price * this.items[i].quantity;
       }
       return total * 1.1;
     }
   }
   ```

2. **Refactor to remove duplication**
   ```javascript
   // After refactoring
   class ShoppingCart {
     addItem(item) {
       this.items.push(item);
     }

     getTotalPrice() {
       return this.items.reduce((sum, item) =>
         sum + (item.price * item.quantity), 0
       );
     }

     getTotalWithTax(taxRate = 0.1) {
       return this.getTotalPrice() * (1 + taxRate);
     }
   }
   ```

3. **Run ALL tests - they must still pass**
   ```
   ✓ should add item to cart
   ✓ should calculate total price
   ✓ should calculate total with tax
   ```

### Refactoring Rules

1. **Never refactor without tests**
2. **Make one change at a time**
3. **Run tests after each change**
4. **If tests fail, revert the change**
5. **Don't add new features during refactoring**

### Common Refactorings

#### Extract Method
```javascript
// Before
function processOrder(order) {
  let total = 0;
  for (const item of order.items) {
    total += item.price * item.quantity;
  }
  const tax = total * 0.1;
  const shipping = total > 100 ? 0 : 10;
  return total + tax + shipping;
}

// After
function processOrder(order) {
  const subtotal = calculateSubtotal(order.items);
  const tax = calculateTax(subtotal);
  const shipping = calculateShipping(subtotal);
  return subtotal + tax + shipping;
}

function calculateSubtotal(items) {
  return items.reduce((sum, item) =>
    sum + item.price * item.quantity, 0
  );
}

function calculateTax(subtotal) {
  return subtotal * 0.1;
}

function calculateShipping(subtotal) {
  return subtotal > 100 ? 0 : 10;
}
```

#### Replace Magic Numbers with Constants
```javascript
// Before
function calculateShipping(total) {
  return total > 100 ? 0 : 10;
}

// After
const FREE_SHIPPING_THRESHOLD = 100;
const STANDARD_SHIPPING_COST = 10;

function calculateShipping(total) {
  return total > FREE_SHIPPING_THRESHOLD ? 0 : STANDARD_SHIPPING_COST;
}
```

## Complete TDD Example

### Requirement
Create a password validator that checks:
- Minimum 8 characters
- At least one uppercase letter
- At least one lowercase letter
- At least one number

### Iteration 1: Length Validation

**RED - Write failing test**
```javascript
test('should reject password shorter than 8 characters', () => {
  expect(validatePassword('Pass1')).toBe(false);
});
```

**GREEN - Make it pass**
```javascript
function validatePassword(password) {
  return password.length >= 8;
}
```

**REFACTOR** - Nothing to refactor yet

### Iteration 2: Uppercase Validation

**RED - Write failing test**
```javascript
test('should reject password without uppercase', () => {
  expect(validatePassword('password1')).toBe(false);
});
```

**GREEN - Make it pass**
```javascript
function validatePassword(password) {
  const hasMinLength = password.length >= 8;
  const hasUppercase = /[A-Z]/.test(password);
  return hasMinLength && hasUppercase;
}
```

**REFACTOR** - Extract validation logic
```javascript
function validatePassword(password) {
  return hasMinLength(password) && hasUppercase(password);
}

function hasMinLength(password) {
  return password.length >= 8;
}

function hasUppercase(password) {
  return /[A-Z]/.test(password);
}
```

### Iteration 3: Lowercase Validation

**RED - Write failing test**
```javascript
test('should reject password without lowercase', () => {
  expect(validatePassword('PASSWORD1')).toBe(false);
});
```

**GREEN - Make it pass**
```javascript
function validatePassword(password) {
  return hasMinLength(password) &&
         hasUppercase(password) &&
         hasLowercase(password);
}

function hasLowercase(password) {
  return /[a-z]/.test(password);
}
```

### Iteration 4: Number Validation

**RED - Write failing test**
```javascript
test('should reject password without number', () => {
  expect(validatePassword('Password')).toBe(false);
});
```

**GREEN - Make it pass**
```javascript
function validatePassword(password) {
  return hasMinLength(password) &&
         hasUppercase(password) &&
         hasLowercase(password) &&
         hasNumber(password);
}

function hasNumber(password) {
  return /[0-9]/.test(password);
}
```

**REFACTOR** - Final cleanup
```javascript
const PASSWORD_MIN_LENGTH = 8;
const UPPERCASE_REGEX = /[A-Z]/;
const LOWERCASE_REGEX = /[a-z]/;
const NUMBER_REGEX = /[0-9]/;

function validatePassword(password) {
  const validations = [
    hasMinLength,
    hasUppercase,
    hasLowercase,
    hasNumber
  ];

  return validations.every(validation => validation(password));
}

function hasMinLength(password) {
  return password.length >= PASSWORD_MIN_LENGTH;
}

function hasUppercase(password) {
  return UPPERCASE_REGEX.test(password);
}

function hasLowercase(password) {
  return LOWERCASE_REGEX.test(password);
}

function hasNumber(password) {
  return NUMBER_REGEX.test(password);
}
```

### Final Test Suite

```javascript
describe('Password Validator', () => {
  test('should accept valid password', () => {
    expect(validatePassword('Password1')).toBe(true);
  });

  test('should reject password shorter than 8 characters', () => {
    expect(validatePassword('Pass1')).toBe(false);
  });

  test('should reject password without uppercase', () => {
    expect(validatePassword('password1')).toBe(false);
  });

  test('should reject password without lowercase', () => {
    expect(validatePassword('PASSWORD1')).toBe(false);
  });

  test('should reject password without number', () => {
    expect(validatePassword('Password')).toBe(false);
  });

  test('should reject empty password', () => {
    expect(validatePassword('')).toBe(false);
  });
});
```

## TDD Best Practices

### 1. Test Behavior, Not Implementation

❌ **Testing implementation**
```javascript
test('should use Array.push to add item', () => {
  const spy = jest.spyOn(Array.prototype, 'push');
  cart.addItem(item);
  expect(spy).toHaveBeenCalled();
});
```

✅ **Testing behavior**
```javascript
test('should contain item after adding', () => {
  cart.addItem(item);
  expect(cart.items).toContain(item);
});
```

### 2. One Assertion Per Test (Generally)

❌ **Multiple assertions**
```javascript
test('should handle user registration', () => {
  const user = registerUser('test@example.com', 'Password1');
  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@example.com');
  expect(user.active).toBe(true);
  expect(user.createdAt).toBeDefined();
});
```

✅ **Focused tests**
```javascript
test('should assign unique id to registered user', () => {
  const user = registerUser('test@example.com', 'Password1');
  expect(user.id).toBeDefined();
});

test('should set email for registered user', () => {
  const user = registerUser('test@example.com', 'Password1');
  expect(user.email).toBe('test@example.com');
});

test('should activate newly registered user', () => {
  const user = registerUser('test@example.com', 'Password1');
  expect(user.active).toBe(true);
});
```

### 3. Use Descriptive Test Names

❌ **Vague names**
```javascript
test('test1', () => { ... });
test('addItem', () => { ... });
test('works', () => { ... });
```

✅ **Descriptive names**
```javascript
test('should add item to empty cart', () => { ... });
test('should reject duplicate items', () => { ... });
test('should calculate total with multiple items', () => { ... });
```

### 4. Follow AAA Pattern

**Arrange** - Set up test data
**Act** - Execute the code under test
**Assert** - Verify the results

```javascript
test('should calculate total price', () => {
  // Arrange
  const cart = new ShoppingCart();
  const item1 = { price: 10, quantity: 2 };
  const item2 = { price: 5, quantity: 1 };

  // Act
  cart.addItem(item1);
  cart.addItem(item2);
  const total = cart.getTotalPrice();

  // Assert
  expect(total).toBe(25);
});
```

### 5. Keep Tests Fast

- Use in-memory databases for testing
- Mock external dependencies
- Avoid thread.sleep() or setTimeout()
- Run unit tests in parallel

### 6. Make Tests Independent

Each test should be able to run in isolation.

❌ **Tests depend on each other**
```javascript
let cart;

test('should create cart', () => {
  cart = new ShoppingCart();
  expect(cart).toBeDefined();
});

test('should add item', () => {
  cart.addItem(item); // Depends on previous test!
  expect(cart.items).toHaveLength(1);
});
```

✅ **Independent tests**
```javascript
describe('ShoppingCart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart(); // Fresh cart for each test
  });

  test('should be empty when created', () => {
    expect(cart.items).toHaveLength(0);
  });

  test('should add item', () => {
    cart.addItem(item);
    expect(cart.items).toHaveLength(1);
  });
});
```

## TDD Anti-Patterns

### 1. Testing Private Methods

Focus on public API, not internal implementation.

### 2. Over-Mocking

Mock only external dependencies, not internal code.

### 3. Flaky Tests

Tests that sometimes pass and sometimes fail. Usually due to:
- Race conditions
- Non-deterministic code (random, timestamps)
- Shared state between tests
- External dependencies

### 4. Slow Tests

If tests take too long, developers won't run them frequently.

### 5. Testing Framework Code

Don't test that the framework works—test your code.

## TDD Metrics

### Code Coverage

Aim for high coverage, but 100% isn't always necessary.

```bash
# Jest
npm test -- --coverage

# pytest
pytest --cov=myapp tests/

# Go
go test -cover ./...
```

**Good Coverage**: 80-90%
**Excellent Coverage**: 90%+

### Mutation Testing

Tests whether your tests can detect bugs.

```bash
# JavaScript (Stryker)
npx stryker run

# Python (mutmut)
mutmut run
```

## Resources

- **Books**:
  - "Test-Driven Development by Example" - Kent Beck
  - "Growing Object-Oriented Software, Guided by Tests" - Freeman & Pryce

- **Online**:
  - [TDD Kata](http://www.codekatas.org/)
  - [Exercism](https://exercism.io/) - Practice TDD

- **Videos**:
  - "TDD, Where Did It All Go Wrong" - Ian Cooper
  - "The Transformation Priority Premise" - Uncle Bob
