// Jest Test Template
// Copy and modify this template for your tests

describe('{{FeatureName}}', () => {
  // Setup code that runs before each test
  beforeEach(() => {
    // Initialize test data
    // Reset mocks
    // Setup environment
  });

  // Cleanup code that runs after each test
  afterEach(() => {
    // Clean up resources
    // Restore mocks
  });

  describe('{{SubFeatureName}}', () => {
    it('should {{expectedBehavior}}', () => {
      // Arrange: Set up test data and conditions
      const input = {};
      const expected = {};

      // Act: Execute the code under test
      const result = functionUnderTest(input);

      // Assert: Verify the outcome
      expect(result).toEqual(expected);
    });

    it('should handle {{edgeCase}}', () => {
      // Arrange
      const invalidInput = null;

      // Act & Assert
      expect(() => functionUnderTest(invalidInput))
        .toThrow('Expected error message');
    });
  });

  describe('{{AnotherSubFeature}}', () => {
    it('should {{expectedBehavior}} when {{condition}}', async () => {
      // Arrange
      const mockDependency = jest.fn().mockResolvedValue({ data: 'value' });

      // Act
      const result = await asyncFunction(mockDependency);

      // Assert
      expect(result).toBeDefined();
      expect(mockDependency).toHaveBeenCalledWith(expect.any(Object));
    });
  });
});

// Parameterized test example
describe.each([
  { input: 1, expected: 2 },
  { input: 2, expected: 4 },
  { input: 3, expected: 6 }
])('{{FunctionName}} with different inputs', ({ input, expected }) => {
  it(`should return ${expected} when input is ${input}`, () => {
    expect(double(input)).toBe(expected);
  });
});
