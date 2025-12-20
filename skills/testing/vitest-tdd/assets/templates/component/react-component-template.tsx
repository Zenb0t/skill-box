import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { {{ComponentName}} } from './{{ComponentName}}'

describe('{{ComponentName}}', () => {
  describe('Rendering', () => {
    it('should render without crashing', () => {
      render(<{{ComponentName}} />)

      expect(screen.getByRole('{{role}}')).toBeInTheDocument()
    })

    it('should render with props', () => {
      const props = {
        {{propName}}: {{propValue}}
      }

      render(<{{ComponentName}} {...props} />)

      expect(screen.getByText({{expectedText}})).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      const { container } = render(
        <{{ComponentName}} className="custom-class" />
      )

      expect(container.firstChild).toHaveClass('custom-class')
    })
  })

  describe('User Interactions', () => {
    it('should handle click event', async () => {
      // Arrange
      const handleClick = vi.fn()
      const user = userEvent.setup()

      render(<{{ComponentName}} onClick={handleClick} />)

      // Act
      await user.click(screen.getByRole('button', { name: /{{buttonText}}/i }))

      // Assert
      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('should handle input change', async () => {
      // Arrange
      const handleChange = vi.fn()
      const user = userEvent.setup()

      render(<{{ComponentName}} onChange={handleChange} />)

      // Act
      const input = screen.getByRole('textbox')
      await user.type(input, 'test value')

      // Assert
      expect(handleChange).toHaveBeenCalled()
      expect(input).toHaveValue('test value')
    })

    it('should handle form submission', async () => {
      // Arrange
      const handleSubmit = vi.fn((e) => e.preventDefault())
      const user = userEvent.setup()

      render(<{{ComponentName}} onSubmit={handleSubmit} />)

      // Act
      await user.click(screen.getByRole('button', { name: /submit/i }))

      // Assert
      expect(handleSubmit).toHaveBeenCalledTimes(1)
    })
  })

  describe('State Management', () => {
    it('should update state on interaction', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<{{ComponentName}} />)

      // Act
      await user.click(screen.getByRole('button', { name: /increment/i }))

      // Assert
      expect(screen.getByText(/count: 1/i)).toBeInTheDocument()
    })

    it('should reset state', async () => {
      // Arrange
      const user = userEvent.setup()
      render(<{{ComponentName}} initialValue={5} />)

      // Act
      await user.click(screen.getByRole('button', { name: /reset/i }))

      // Assert
      expect(screen.getByText(/count: 5/i)).toBeInTheDocument()
    })
  })

  describe('Async Behavior', () => {
    it('should show loading state', async () => {
      // Arrange
      const slowPromise = new Promise((resolve) =>
        setTimeout(() => resolve({ data: 'test' }), 100)
      )

      render(<{{ComponentName}} fetchData={() => slowPromise} />)

      // Assert - Loading state
      expect(screen.getByText(/loading/i)).toBeInTheDocument()

      // Wait for async operation
      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument()
      })
    })

    it('should display fetched data', async () => {
      // Arrange
      const mockData = { id: 1, name: 'Test' }
      const fetchData = vi.fn().mockResolvedValue(mockData)

      render(<{{ComponentName}} fetchData={fetchData} />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(mockData.name)).toBeInTheDocument()
      })

      expect(fetchData).toHaveBeenCalledTimes(1)
    })

    it('should handle fetch error', async () => {
      // Arrange
      const fetchData = vi.fn().mockRejectedValue(new Error('Fetch failed'))

      render(<{{ComponentName}} fetchData={fetchData} />)

      // Assert
      await waitFor(() => {
        expect(screen.getByText(/error/i)).toBeInTheDocument()
      })
    })
  })

  describe('Conditional Rendering', () => {
    it('should render when condition is true', () => {
      render(<{{ComponentName}} shouldShow={true} />)

      expect(screen.getByText(/{{conditionalText}}/i)).toBeInTheDocument()
    })

    it('should not render when condition is false', () => {
      render(<{{ComponentName}} shouldShow={false} />)

      expect(screen.queryByText(/{{conditionalText}}/i)).not.toBeInTheDocument()
    })
  })

  describe('Accessibility', () => {
    it('should have accessible labels', () => {
      render(<{{ComponentName}} />)

      expect(screen.getByLabelText(/{{labelText}}/i)).toBeInTheDocument()
    })

    it('should have proper ARIA attributes', () => {
      render(<{{ComponentName}} />)

      const element = screen.getByRole('{{role}}')
      expect(element).toHaveAttribute('aria-label', '{{ariaLabel}}')
    })

    it('should be keyboard navigable', async () => {
      const user = userEvent.setup()
      render(<{{ComponentName}} />)

      const button = screen.getByRole('button')

      // Tab to button
      await user.tab()
      expect(button).toHaveFocus()

      // Activate with Enter
      await user.keyboard('{Enter}')
      // Assert expected behavior
    })
  })

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      render(<{{ComponentName}} data={undefined} />)

      // Component should render without crashing
      expect(screen.getByRole('{{role}}')).toBeInTheDocument()
    })

    it('should handle empty array', () => {
      render(<{{ComponentName}} items={[]} />)

      expect(screen.getByText(/no items/i)).toBeInTheDocument()
    })

    it('should handle very long text', () => {
      const longText = 'A'.repeat(1000)

      render(<{{ComponentName}} text={longText} />)

      expect(screen.getByText(longText)).toBeInTheDocument()
    })
  })
})

// Snapshot tests
describe('{{ComponentName}} Snapshots', () => {
  it('should match snapshot', () => {
    const { container } = render(<{{ComponentName}} />)

    expect(container).toMatchSnapshot()
  })

  it('should match inline snapshot', () => {
    const { container } = render(<{{ComponentName}} title="Test" />)

    expect(container.querySelector('.title')?.textContent)
      .toMatchInlineSnapshot('"Test"')
  })
})
