"""
pytest Test Template
Copy and modify this template for your tests
"""

import pytest
from {{module}} import {{FunctionOrClass}}


# Fixtures for reusable test data
@pytest.fixture
def sample_data():
    """Provide sample data for tests"""
    return {
        'key': 'value',
        'count': 42
    }


@pytest.fixture
def mock_dependency(mocker):
    """Create mock for external dependency"""
    mock = mocker.Mock()
    mock.method.return_value = 'expected_value'
    return mock


class Test{{FeatureName}}:
    """Test suite for {{FeatureName}} functionality"""

    def test_{{expectedBehavior}}(self, sample_data):
        """Should {{description of expected behavior}}"""
        # Arrange
        input_value = sample_data['key']

        # Act
        result = function_under_test(input_value)

        # Assert
        assert result == 'expected_value'
        assert isinstance(result, str)

    def test_{{edgeCase}}_raises_error(self):
        """Should raise ValueError when {{condition}}"""
        # Arrange
        invalid_input = None

        # Act & Assert
        with pytest.raises(ValueError, match="Expected error message"):
            function_under_test(invalid_input)

    def test_{{featureWithMock}}(self, mock_dependency):
        """Should {{behavior}} using mocked dependency"""
        # Arrange
        input_data = {'param': 'value'}

        # Act
        result = function_with_dependency(input_data, mock_dependency)

        # Assert
        assert result is not None
        mock_dependency.method.assert_called_once_with(input_data)


class Test{{AnotherFeature}}:
    """Test suite for {{AnotherFeature}} functionality"""

    @pytest.fixture(autouse=True)
    def setup(self):
        """Setup that runs before each test in this class"""
        self.instance = {{ClassName}}()
        yield
        # Teardown code here if needed

    def test_{{method}}_returns_{{expected}}(self):
        """Should return {{expected}} when {{condition}}"""
        # Arrange
        self.instance.property = 'value'

        # Act
        result = self.instance.method()

        # Assert
        assert result == 'expected'


# Parametrized test example
@pytest.mark.parametrize("input_value,expected", [
    (0, False),
    (1, True),
    (-1, False),
    (100, True),
])
def test_{{functionName}}_with_various_inputs(input_value, expected):
    """Should return correct value for various inputs"""
    assert {{functionName}}(input_value) == expected


# Async test example
@pytest.mark.asyncio
async def test_{{asyncFunction}}():
    """Should handle async operation correctly"""
    # Arrange
    input_data = {'key': 'value'}

    # Act
    result = await async_function(input_data)

    # Assert
    assert result is not None
    assert result.status == 'success'


# Integration test example
@pytest.mark.integration
def test_{{integrationScenario}}(database, sample_data):
    """Should {{behavior}} in integrated system"""
    # Arrange
    database.insert(sample_data)

    # Act
    result = query_database(database, sample_data['key'])

    # Assert
    assert result == sample_data
