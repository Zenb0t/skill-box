# Testing Frameworks Reference

Comprehensive guide to supported testing frameworks across different programming languages.

## JavaScript / TypeScript

### Jest

**Website**: https://jestjs.io/

**Installation**:
```bash
npm install --save-dev jest
# For TypeScript
npm install --save-dev @types/jest ts-jest
```

**Configuration**:
```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'node',
  coveragePathIgnorePatterns: ['/node_modules/'],
  testMatch: ['**/__tests__/**/*.test.js'],
};
```

**Test Structure**:
```javascript
describe('Feature', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something', () => {
    expect(result).toBe(expected);
  });

  afterEach(() => {
    // Cleanup
  });
});
```

**Assertions**:
- `expect(value).toBe(expected)` - Strict equality
- `expect(value).toEqual(expected)` - Deep equality
- `expect(value).toBeNull()` - Null check
- `expect(value).toBeDefined()` - Defined check
- `expect(array).toContain(item)` - Array contains
- `expect(fn).toThrow(error)` - Function throws

### Vitest

**Website**: https://vitest.dev/

**Installation**:
```bash
npm install --save-dev vitest
```

**Configuration**:
```javascript
// vitest.config.js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
  },
});
```

**Features**:
- Drop-in replacement for Jest
- Faster test execution
- Native ESM support
- Vite integration

### Testing Library

**Website**: https://testing-library.com/

**Installation**:
```bash
npm install --save-dev @testing-library/react
npm install --save-dev @testing-library/jest-dom
```

**Best for**: Component testing, user-centric tests

**Example**:
```javascript
import { render, screen, fireEvent } from '@testing-library/react';

test('button click increments counter', () => {
  render(<Counter />);
  const button = screen.getByRole('button');
  fireEvent.click(button);
  expect(screen.getByText('1')).toBeInTheDocument();
});
```

## Python

### pytest

**Website**: https://pytest.org/

**Installation**:
```bash
pip install pytest
```

**Test Discovery**: Files matching `test_*.py` or `*_test.py`

**Test Structure**:
```python
import pytest

@pytest.fixture
def sample_data():
    return {"key": "value"}

def test_something(sample_data):
    assert sample_data["key"] == "value"

class TestFeature:
    def test_method(self):
        assert True
```

**Assertions**:
- `assert value == expected`
- `assert value is None`
- `assert value in collection`
- `with pytest.raises(Exception):`

**Fixtures**: Powerful dependency injection system

**Plugins**:
- `pytest-cov` - Coverage reporting
- `pytest-mock` - Mocking support
- `pytest-asyncio` - Async test support

### unittest

**Website**: https://docs.python.org/3/library/unittest.html

**Built-in**: Part of Python standard library

**Test Structure**:
```python
import unittest

class TestFeature(unittest.TestCase):
    def setUp(self):
        # Run before each test
        pass

    def test_something(self):
        self.assertEqual(actual, expected)

    def tearDown(self):
        # Run after each test
        pass

if __name__ == '__main__':
    unittest.main()
```

**Assertions**:
- `self.assertEqual(a, b)`
- `self.assertTrue(x)`
- `self.assertIn(a, b)`
- `self.assertRaises(Exception)`

## Java

### JUnit 5

**Website**: https://junit.org/junit5/

**Maven Dependency**:
```xml
<dependency>
    <groupId>org.junit.jupiter</groupId>
    <artifactId>junit-jupiter</artifactId>
    <version>5.9.0</version>
    <scope>test</scope>
</dependency>
```

**Test Structure**:
```java
import org.junit.jupiter.api.*;
import static org.junit.jupiter.api.Assertions.*;

class FeatureTest {
    @BeforeEach
    void setUp() {
        // Setup
    }

    @Test
    void testSomething() {
        assertEquals(expected, actual);
    }

    @Test
    @DisplayName("Custom test name")
    void customName() {
        assertTrue(condition);
    }

    @AfterEach
    void tearDown() {
        // Cleanup
    }
}
```

**Annotations**:
- `@Test` - Mark test method
- `@BeforeEach` - Run before each test
- `@AfterEach` - Run after each test
- `@BeforeAll` - Run once before all tests
- `@AfterAll` - Run once after all tests
- `@Disabled` - Skip test
- `@ParameterizedTest` - Data-driven tests

### Mockito

**Website**: https://site.mockito.org/

**Purpose**: Mocking framework for Java

**Example**:
```java
import static org.mockito.Mockito.*;

@Test
void testWithMock() {
    List mockList = mock(List.class);
    when(mockList.get(0)).thenReturn("first");

    assertEquals("first", mockList.get(0));
    verify(mockList).get(0);
}
```

## Go

### testing (built-in)

**Documentation**: https://pkg.go.dev/testing

**Test File**: `*_test.go` in same package

**Test Structure**:
```go
package mypackage

import "testing"

func TestFeature(t *testing.T) {
    result := MyFunction()
    expected := "value"

    if result != expected {
        t.Errorf("got %v, want %v", result, expected)
    }
}

func BenchmarkFeature(b *testing.B) {
    for i := 0; i < b.N; i++ {
        MyFunction()
    }
}
```

**Table-Driven Tests**:
```go
func TestMultipleCases(t *testing.T) {
    tests := []struct {
        name     string
        input    int
        expected int
    }{
        {"positive", 5, 10},
        {"negative", -5, -10},
        {"zero", 0, 0},
    }

    for _, tt := range tests {
        t.Run(tt.name, func(t *testing.T) {
            result := double(tt.input)
            if result != tt.expected {
                t.Errorf("got %d, want %d", result, tt.expected)
            }
        })
    }
}
```

### testify

**Website**: https://github.com/stretchr/testify

**Installation**:
```bash
go get github.com/stretchr/testify
```

**Features**: Assertions, mocking, suites

**Example**:
```go
import (
    "testing"
    "github.com/stretchr/testify/assert"
)

func TestFeature(t *testing.T) {
    assert.Equal(t, expected, actual, "should be equal")
    assert.NotNil(t, object)
    assert.Contains(t, slice, element)
}
```

## Rust

### Built-in Testing

**Documentation**: https://doc.rust-lang.org/book/ch11-00-testing.html

**Test Structure**:
```rust
#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_feature() {
        let result = my_function();
        assert_eq!(result, expected);
    }

    #[test]
    #[should_panic]
    fn test_panic() {
        panic_function();
    }

    #[test]
    fn test_result() -> Result<(), String> {
        if 2 + 2 == 4 {
            Ok(())
        } else {
            Err(String::from("two plus two != four"))
        }
    }
}
```

**Assertions**:
- `assert!(condition)` - Boolean assertion
- `assert_eq!(a, b)` - Equality
- `assert_ne!(a, b)` - Inequality

## Ruby

### RSpec

**Website**: https://rspec.info/

**Installation**:
```bash
gem install rspec
```

**Test Structure**:
```ruby
RSpec.describe MyClass do
  before(:each) do
    # Setup
  end

  describe '#method' do
    it 'does something' do
      expect(result).to eq(expected)
    end

    context 'when condition' do
      it 'behaves differently' do
        expect(result).to be_truthy
      end
    end
  end
end
```

**Matchers**:
- `expect(x).to eq(y)`
- `expect(x).to be_nil`
- `expect(array).to include(item)`
- `expect { block }.to raise_error(Error)`

## C#

### xUnit

**Website**: https://xunit.net/

**NuGet Package**:
```bash
dotnet add package xunit
dotnet add package xunit.runner.visualstudio
```

**Test Structure**:
```csharp
using Xunit;

public class FeatureTests
{
    [Fact]
    public void TestMethod()
    {
        Assert.Equal(expected, actual);
    }

    [Theory]
    [InlineData(1, 2, 3)]
    [InlineData(2, 3, 5)]
    public void TestWithData(int a, int b, int expected)
    {
        Assert.Equal(expected, Add(a, b));
    }
}
```

**Assertions**:
- `Assert.Equal(expected, actual)`
- `Assert.True(condition)`
- `Assert.Null(object)`
- `Assert.Throws<Exception>(() => method())`

## PHP

### PHPUnit

**Website**: https://phpunit.de/

**Installation**:
```bash
composer require --dev phpunit/phpunit
```

**Test Structure**:
```php
<?php
use PHPUnit\Framework\TestCase;

class FeatureTest extends TestCase
{
    protected function setUp(): void
    {
        // Setup
    }

    public function testSomething()
    {
        $this->assertEquals($expected, $actual);
    }

    /**
     * @dataProvider dataProvider
     */
    public function testWithData($input, $expected)
    {
        $this->assertEquals($expected, process($input));
    }

    public function dataProvider()
    {
        return [
            [1, 2],
            [2, 4],
            [3, 6],
        ];
    }
}
```

## Comparison Matrix

| Framework | Language | Async Support | Parallel | Mocking | Snapshots |
|-----------|----------|---------------|----------|---------|-----------|
| Jest | JS/TS | ✅ | ✅ | ✅ | ✅ |
| Vitest | JS/TS | ✅ | ✅ | ✅ | ✅ |
| pytest | Python | ✅ | ✅ | Plugin | ❌ |
| unittest | Python | ✅ | ❌ | Built-in | ❌ |
| JUnit 5 | Java | ❌ | ✅ | Mockito | ❌ |
| Go testing | Go | ✅ | ✅ | testify | ❌ |
| Rust | Rust | ✅ | ✅ | Built-in | ❌ |
| RSpec | Ruby | ❌ | ✅ | Built-in | ❌ |
| xUnit | C# | ✅ | ✅ | Moq | ❌ |
| PHPUnit | PHP | ❌ | ✅ | Built-in | ❌ |

## Choosing a Framework

### For JavaScript/TypeScript Projects:
- **Jest**: Most popular, great ecosystem, good defaults
- **Vitest**: Modern, faster, Vite integration
- **Testing Library**: Best for React/component testing

### For Python Projects:
- **pytest**: Most flexible, great plugins, modern syntax
- **unittest**: Standard library, no dependencies

### For Java Projects:
- **JUnit 5**: Industry standard, rich features
- **TestNG**: Alternative with more features

### For Go Projects:
- **testing**: Built-in, simple, table-driven tests
- **testify**: Enhanced assertions and mocking

### For Other Languages:
- Use built-in framework when available
- Choose framework with active community
- Consider IDE integration
