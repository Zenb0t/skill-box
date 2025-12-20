package {{package}}

import (
	"testing"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

// Test{{FunctionName}} tests the {{FunctionName}} function
func Test{{FunctionName}}(t *testing.T) {
	// Arrange
	input := "test input"
	expected := "expected output"

	// Act
	result := {{FunctionName}}(input)

	// Assert
	assert.Equal(t, expected, result)
	assert.NotNil(t, result)
}

// Test{{FunctionName}}_Error tests error handling
func Test{{FunctionName}}_Error(t *testing.T) {
	// Arrange
	invalidInput := ""

	// Act
	result, err := {{FunctionName}}(invalidInput)

	// Assert
	assert.Error(t, err)
	assert.Nil(t, result)
	assert.Contains(t, err.Error(), "invalid input")
}

// Table-driven test example
func Test{{FunctionName}}_TableDriven(t *testing.T) {
	tests := []struct {
		name     string
		input    string
		expected string
		wantErr  bool
	}{
		{
			name:     "valid input",
			input:    "test",
			expected: "result",
			wantErr:  false,
		},
		{
			name:     "empty input",
			input:    "",
			expected: "",
			wantErr:  true,
		},
		{
			name:     "special characters",
			input:    "test!@#",
			expected: "test",
			wantErr:  false,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			// Act
			result, err := {{FunctionName}}(tt.input)

			// Assert
			if tt.wantErr {
				assert.Error(t, err)
			} else {
				assert.NoError(t, err)
				assert.Equal(t, tt.expected, result)
			}
		})
	}
}

// Benchmark test example
func Benchmark{{FunctionName}}(b *testing.B) {
	input := "test input"

	for i := 0; i < b.N; i++ {
		{{FunctionName}}(input)
	}
}

// Example test (appears in documentation)
func Example{{FunctionName}}() {
	result := {{FunctionName}}("example")
	fmt.Println(result)
	// Output: expected output
}

// Test with setup and teardown
func Test{{FeatureName}}_WithSetup(t *testing.T) {
	// Setup
	instance := &{{StructName}}{
		field: "value",
	}
	defer instance.Close() // Teardown

	// Test
	result := instance.Method()

	// Assert
	require.NotNil(t, result)
	assert.True(t, result.IsValid())
}

// Subtest example
func Test{{FeatureName}}_Subtests(t *testing.T) {
	t.Run("SubFeature1", func(t *testing.T) {
		// Test sub-feature 1
		result := SubFeature1()
		assert.NotNil(t, result)
	})

	t.Run("SubFeature2", func(t *testing.T) {
		// Test sub-feature 2
		result := SubFeature2()
		assert.True(t, result)
	})
}

// Parallel test example
func Test{{FunctionName}}_Parallel(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name  string
		input int
	}{
		{"test1", 1},
		{"test2", 2},
		{"test3", 3},
	}

	for _, tt := range tests {
		tt := tt // Capture range variable
		t.Run(tt.name, func(t *testing.T) {
			t.Parallel()
			result := {{FunctionName}}(tt.input)
			assert.NotNil(t, result)
		})
	}
}
