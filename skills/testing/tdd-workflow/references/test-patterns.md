# Test Patterns and Anti-Patterns

Common patterns for writing effective tests and anti-patterns to avoid.

## Test Patterns

### 1. Arrange-Act-Assert (AAA)

**Purpose**: Structure tests clearly

**Pattern**:
```javascript
test('descriptive name', () => {
  // Arrange: Set up test data and conditions
  const input = setupTestData();

  // Act: Execute the code under test
  const result = performAction(input);

  // Assert: Verify the outcome
  expect(result).toBe(expected);
});
```

**Benefits**:
- Clear test structure
- Easy to read and understand
- Separates concerns

### 2. Object Mother

**Purpose**: Create test objects with default values

**Pattern**:
```javascript
// Object Mother
class UserMother {
  static createDefault() {
    return {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user',
      active: true
    };
  }

  static createAdmin() {
    return {
      ...this.createDefault(),
      role: 'admin'
    };
  }

  static createInactive() {
    return {
      ...this.createDefault(),
      active: false
    };
  }
}

// Usage in tests
test('should process active user', () => {
  const user = UserMother.createDefault();
  // test implementation
});
```

**Benefits**:
- Reduces test data duplication
- Makes tests more maintainable
- Clear test intent

### 3. Builder Pattern

**Purpose**: Fluently create complex test objects

**Pattern**:
```javascript
class UserBuilder {
  constructor() {
    this.user = {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      role: 'user'
    };
  }

  withName(name) {
    this.user.name = name;
    return this;
  }

  withEmail(email) {
    this.user.email = email;
    return this;
  }

  asAdmin() {
    this.user.role = 'admin';
    return this;
  }

  build() {
    return this.user;
  }
}

// Usage
test('should handle admin user', () => {
  const admin = new UserBuilder()
    .withEmail('admin@example.com')
    .asAdmin()
    .build();

  expect(processUser(admin)).toBeTruthy();
});
```

**Benefits**:
- Flexible test data creation
- Readable and expressive
- Only specify what matters for the test

### 4. Test Fixture

**Purpose**: Share setup code across multiple tests

**Pattern**:
```python
import pytest

@pytest.fixture
def database():
    """Create test database"""
    db = Database(':memory:')
    db.setup_schema()
    yield db
    db.teardown()

@pytest.fixture
def sample_users(database):
    """Create sample users in database"""
    users = [
        User(name='Alice', email='alice@example.com'),
        User(name='Bob', email='bob@example.com')
    ]
    for user in users:
        database.save(user)
    return users

def test_find_user(database, sample_users):
    user = database.find_by_email('alice@example.com')
    assert user.name == 'Alice'
```

**Benefits**:
- Reusable setup code
- Automatic cleanup
- Dependency injection

### 5. Parameterized Tests

**Purpose**: Test multiple inputs with same logic

**Pattern**:
```python
# Python (pytest)
@pytest.mark.parametrize("input,expected", [
    (0, False),
    (1, True),
    (-1, False),
    (100, True),
])
def test_is_positive(input, expected):
    assert is_positive(input) == expected
```

```javascript
// JavaScript (Jest)
test.each([
  [0, false],
  [1, true],
  [-1, false],
  [100, true],
])('is_positive(%i) should return %s', (input, expected) => {
  expect(isPositive(input)).toBe(expected);
});
```

**Benefits**:
- Reduces test duplication
- Easy to add new test cases
- Clear what inputs are being tested

### 6. Test Double Patterns

#### Dummy
Objects passed around but never actually used.

```javascript
test('should process payment without logger', () => {
  const dummyLogger = null; // Not used in this test
  const processor = new PaymentProcessor(dummyLogger);
  processor.process(payment);
});
```

#### Stub
Provides canned answers to calls.

```javascript
const userRepositoryStub = {
  findById: () => ({ id: 1, name: 'John' })
};
```

#### Spy
Records information about calls.

```javascript
const emailSpy = jest.fn();
service.sendWelcomeEmail = emailSpy;

service.registerUser(userData);

expect(emailSpy).toHaveBeenCalledWith(userData.email);
```

#### Mock
Pre-programmed with expectations.

```javascript
const paymentGateway = {
  charge: jest.fn().mockResolvedValue({ success: true })
};

await processOrder(order, paymentGateway);

expect(paymentGateway.charge).toHaveBeenCalledWith(
  expect.objectContaining({
    amount: 100,
    currency: 'USD'
  })
);
```

#### Fake
Working implementation, but simplified.

```javascript
class InMemoryUserRepository {
  constructor() {
    this.users = [];
  }

  save(user) {
    this.users.push(user);
  }

  findById(id) {
    return this.users.find(u => u.id === id);
  }
}
```

### 7. Golden Master Testing

**Purpose**: Capture known-good output and compare future runs

**Pattern**:
```python
def test_report_generation(snapshot):
    report = generate_complex_report(data)
    snapshot.assert_match(report, 'report.json')
```

**Benefits**:
- Useful for refactoring legacy code
- Catches unexpected changes
- Works for complex outputs

### 8. Contract Testing

**Purpose**: Verify integrations between services

**Pattern**:
```javascript
// Consumer test
test('should fetch user from API', async () => {
  const provider = new PactV3({
    consumer: 'UserService',
    provider: 'UserAPI'
  });

  await provider
    .given('user exists')
    .uponReceiving('a request for user')
    .withRequest({
      method: 'GET',
      path: '/users/1'
    })
    .willRespondWith({
      status: 200,
      body: { id: 1, name: 'John' }
    });

  await provider.executeTest(async (mockServer) => {
    const client = new UserAPIClient(mockServer.url);
    const user = await client.getUser(1);
    expect(user.name).toBe('John');
  });
});
```

**Benefits**:
- Ensures service compatibility
- Catches breaking changes early
- Documents API contracts

## Anti-Patterns

### 1. Testing Implementation Details

❌ **Bad**:
```javascript
test('should use quicksort algorithm', () => {
  const spy = jest.spyOn(algorithm, 'quicksort');
  sortArray([3, 1, 2]);
  expect(spy).toHaveBeenCalled();
});
```

✅ **Good**:
```javascript
test('should sort array in ascending order', () => {
  const result = sortArray([3, 1, 2]);
  expect(result).toEqual([1, 2, 3]);
});
```

**Why**: Tests should verify behavior, not how it's implemented.

### 2. Overly Complex Tests

❌ **Bad**:
```javascript
test('complex scenario', () => {
  const users = [];
  for (let i = 0; i < 10; i++) {
    users.push({ id: i, active: i % 2 === 0 });
  }
  const active = users.filter(u => u.active);
  const result = processUsers(active);
  const expected = active.map(u => ({ ...u, processed: true }));
  expect(result).toEqual(expected);
});
```

✅ **Good**:
```javascript
test('should mark active users as processed', () => {
  const users = [
    { id: 1, active: true },
    { id: 2, active: true }
  ];

  const result = processUsers(users);

  expect(result[0].processed).toBe(true);
  expect(result[1].processed).toBe(true);
});
```

**Why**: Simple tests are easier to understand and maintain.

### 3. Hidden Test Dependencies

❌ **Bad**:
```javascript
let globalCart; // Shared state!

test('should add item', () => {
  globalCart.addItem(item);
  expect(globalCart.items).toHaveLength(1);
});

test('should calculate total', () => {
  // Depends on previous test!
  const total = globalCart.getTotal();
  expect(total).toBeGreaterThan(0);
});
```

✅ **Good**:
```javascript
describe('ShoppingCart', () => {
  let cart;

  beforeEach(() => {
    cart = new ShoppingCart();
  });

  test('should add item', () => {
    cart.addItem(item);
    expect(cart.items).toHaveLength(1);
  });

  test('should calculate total', () => {
    cart.addItem({ price: 10 });
    const total = cart.getTotal();
    expect(total).toBe(10);
  });
});
```

**Why**: Tests must be independent and runnable in any order.

### 4. Unclear Test Names

❌ **Bad**:
```javascript
test('test1', () => { ... });
test('it works', () => { ... });
test('user', () => { ... });
```

✅ **Good**:
```javascript
test('should reject invalid email format', () => { ... });
test('should calculate discount for premium users', () => { ... });
test('should throw error when user not found', () => { ... });
```

**Why**: Test names document behavior and help debugging.

### 5. Multiple Assertions Without Context

❌ **Bad**:
```javascript
test('registration', () => {
  const user = registerUser(data);
  expect(user.id).toBeDefined();
  expect(user.email).toBe('test@example.com');
  expect(user.active).toBe(true);
  expect(user.role).toBe('user');
  expect(user.createdAt).toBeDefined();
  // Which assertion failed?
});
```

✅ **Good**:
```javascript
describe('User Registration', () => {
  test('should assign unique id', () => {
    const user = registerUser(data);
    expect(user.id).toBeDefined();
  });

  test('should set provided email', () => {
    const user = registerUser(data);
    expect(user.email).toBe(data.email);
  });

  test('should activate user by default', () => {
    const user = registerUser(data);
    expect(user.active).toBe(true);
  });
});
```

**Why**: Focused tests are easier to debug.

### 6. Testing Too Much

❌ **Bad**:
```javascript
test('should handle entire user lifecycle', () => {
  const user = createUser(data);
  updateUser(user.id, updates);
  const updated = getUser(user.id);
  deactivateUser(user.id);
  const deactivated = getUser(user.id);
  deleteUser(user.id);
  expect(() => getUser(user.id)).toThrow();
});
```

✅ **Good**:
```javascript
test('should create user with provided data', () => {
  const user = createUser(data);
  expect(user).toMatchObject(data);
});

test('should update user fields', () => {
  const user = createUser(data);
  const updated = updateUser(user.id, updates);
  expect(updated).toMatchObject(updates);
});

test('should throw when deleting non-existent user', () => {
  expect(() => deleteUser(999)).toThrow();
});
```

**Why**: Tests should be focused on one behavior.

### 7. Ignoring Test Failures

❌ **Bad**:
```javascript
test.skip('broken test', () => {
  // TODO: Fix this later
});
```

✅ **Good**:
```javascript
test('should handle edge case', () => {
  // Fix the code or remove the test
  const result = handleEdgeCase(data);
  expect(result).toBeDefined();
});
```

**Why**: Skipped tests = broken windows. Fix or delete them.

### 8. Over-Mocking

❌ **Bad**:
```javascript
test('should calculate total', () => {
  const mockAdd = jest.fn((a, b) => a + b);
  const mockMultiply = jest.fn((a, b) => a * b);
  // Mocking basic operations is overkill!

  const result = calculate(mockAdd, mockMultiply);
  expect(result).toBe(expected);
});
```

✅ **Good**:
```javascript
test('should calculate total', () => {
  const result = calculate(items);
  expect(result).toBe(expected);
});
```

**Why**: Only mock external dependencies, not internal logic.

### 9. Flaky Tests

Tests that sometimes pass and sometimes fail.

**Common Causes**:
- Race conditions
- Non-deterministic code (Date.now(), Math.random())
- External dependencies
- Shared state

❌ **Bad**:
```javascript
test('should timestamp user creation', () => {
  const user = createUser(data);
  expect(user.createdAt).toBe(Date.now()); // Flaky!
});
```

✅ **Good**:
```javascript
test('should timestamp user creation', () => {
  const beforeCreation = Date.now();
  const user = createUser(data);
  const afterCreation = Date.now();

  expect(user.createdAt).toBeGreaterThanOrEqual(beforeCreation);
  expect(user.createdAt).toBeLessThanOrEqual(afterCreation);
});

// Or better: inject time dependency
test('should use provided timestamp', () => {
  const fixedTime = new Date('2024-01-01');
  const clock = { now: () => fixedTime };

  const user = createUser(data, clock);

  expect(user.createdAt).toEqual(fixedTime);
});
```

### 10. Testing the Framework

❌ **Bad**:
```javascript
test('should store data in array', () => {
  const arr = [];
  arr.push('item');
  expect(arr[0]).toBe('item'); // Testing JavaScript!
});
```

✅ **Good**:
```javascript
test('should add item to user wishlist', () => {
  user.addToWishlist(item);
  expect(user.wishlist).toContain(item);
});
```

**Why**: Test your code, not the language or framework.

## Test Smell Checklist

- [ ] Test is longer than the code it tests
- [ ] Test name doesn't describe what's being tested
- [ ] Test has more than one reason to fail
- [ ] Test depends on another test running first
- [ ] Test fails randomly
- [ ] Test requires manual setup before running
- [ ] Test takes a long time to run
- [ ] Test is commented out or skipped
- [ ] Test uses production data
- [ ] Test has no assertions

If you checked any boxes, refactor that test!

## Resources

- [xUnit Test Patterns](http://xunitpatterns.com/) - Gerard Meszaros
- [Test Desiderata](https://kentbeck.github.io/TestDesiderata/) - Kent Beck
- [JavaScript Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)
