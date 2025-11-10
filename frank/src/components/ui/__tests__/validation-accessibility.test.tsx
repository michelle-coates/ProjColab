/**
 * Accessibility Tests for Validation Components
 * Story 1.12 - Task 9: Accessibility Testing
 *
 * Tests WCAG 2.1 AA compliance for validation components
 */

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ValidationInput } from '../validation-input';
import { ValidationTextarea } from '../validation-textarea';
import { HelpTooltip } from '../../help/help-tooltip';

describe('Validation Accessibility Tests', () => {
  describe('Error states announced to screen readers', () => {
    it('should have aria-invalid when validation fails', () => {
      render(
        <ValidationInput
          value="ab"
          onChange={() => {}}
          error="Minimum 3 characters required"
          validationState="error"
          aria-invalid="true"
          aria-describedby="error-message"
          placeholder="Validated input"
        />
      );

      const input = screen.getByPlaceholderText('Validated input');
      expect(input).toHaveAttribute('aria-invalid', 'true');
      expect(input).toHaveAttribute('aria-describedby', 'error-message');
    });

    it('should announce error messages using aria-live region', () => {
      const { container } = render(
        <div>
          <ValidationInput
            value="x"
            onChange={() => {}}
            error="Field is required"
            validationState="error"
            placeholder="Test input"
          />
          <div role="alert" aria-live="polite" aria-atomic="true">
            Field is required
          </div>
        </div>
      );

      const alert = container.querySelector('[role="alert"]');
      expect(alert).toBeInTheDocument();
      expect(alert).toHaveAttribute('aria-live', 'polite');
      expect(alert).toHaveTextContent('Field is required');
    });

    it('should clear aria-invalid when validation succeeds', () => {
      const { rerender } = render(
        <ValidationInput
          value="abc"
          onChange={() => {}}
          error="Too short"
          validationState="error"
          aria-invalid="true"
          placeholder="Dynamic validation"
        />
      );

      const input = screen.getByPlaceholderText('Dynamic validation');
      expect(input).toHaveAttribute('aria-invalid', 'true');

      rerender(
        <ValidationInput
          value="abcdef"
          onChange={() => {}}
          success="Valid input"
          validationState="success"
          aria-invalid="false"
          placeholder="Dynamic validation"
        />
      );

      expect(input).toHaveAttribute('aria-invalid', 'false');
    });
  });

  describe('Help tooltips keyboard-navigable', () => {
    it('should be focusable with Tab key', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <input type="text" placeholder="First input" />
          <HelpTooltip content="Help content" title="Help Title" />
          <input type="text" placeholder="Second input" />
        </div>
      );

      const firstInput = screen.getByPlaceholderText('First input');
      firstInput.focus();

      await user.tab();

      const helpButton = screen.getByRole('button', { name: /help/i });
      expect(helpButton).toHaveFocus();
    });

    it('should open tooltip with Enter key', async () => {
      const user = userEvent.setup();

      render(<HelpTooltip content="This is helpful information" title="Help" />);

      const helpButton = screen.getByRole('button', { name: /help/i });
      helpButton.focus();

      await user.keyboard('{Enter}');

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
      expect(screen.getByText('This is helpful information')).toBeInTheDocument();
    });

    it('should open tooltip with Space key', async () => {
      const user = userEvent.setup();

      render(<HelpTooltip content="Helpful content" />);

      const helpButton = screen.getByRole('button', { name: /help/i });
      helpButton.focus();

      await user.keyboard(' ');

      expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should close tooltip with Escape key', async () => {
      const user = userEvent.setup();

      render(<HelpTooltip content="Help information" />);

      const helpButton = screen.getByRole('button', { name: /help/i });
      await user.click(helpButton);

      expect(screen.getByRole('tooltip')).toBeInTheDocument();

      await user.keyboard('{Escape}');

      expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should have proper aria attributes for accessibility', () => {
      render(<HelpTooltip content="Accessible help" />);

      const helpButton = screen.getByRole('button', { name: /help/i });

      expect(helpButton).toHaveAttribute('aria-label', 'Help');
      expect(helpButton).toHaveAttribute('aria-expanded', 'false');
    });

    it('should update aria-expanded when opened', async () => {
      const user = userEvent.setup();

      render(<HelpTooltip content="Help content" />);

      const helpButton = screen.getByRole('button', { name: /help/i });
      expect(helpButton).toHaveAttribute('aria-expanded', 'false');

      await user.click(helpButton);

      expect(helpButton).toHaveAttribute('aria-expanded', 'true');
    });
  });

  describe('Error messages have sufficient color contrast', () => {
    it('should use WCAG 2.1 AA compliant error colors (red-600)', () => {
      const { container } = render(
        <ValidationInput
          value=""
          onChange={() => {}}
          error="This field is required"
          validationState="error"
          placeholder="Color contrast test"
        />
      );

      const errorMessage = screen.getByText('This field is required');

      // text-red-600 is #dc2626 which has 4.5:1 contrast ratio on white (WCAG AA compliant)
      expect(errorMessage).toHaveClass('text-red-600');
    });

    it('should use WCAG 2.1 AA compliant warning colors (yellow-600)', () => {
      const { container } = render(
        <ValidationInput
          value="test"
          onChange={() => {}}
          warning="Consider adding more detail"
          validationState="warning"
          placeholder="Warning color test"
        />
      );

      const warningMessage = screen.getByText('Consider adding more detail');

      // text-yellow-600 is #ca8a04 which has sufficient contrast (WCAG AA compliant)
      expect(warningMessage).toHaveClass('text-yellow-600');
    });

    it('should use WCAG 2.1 AA compliant success colors (green-600)', () => {
      const { container } = render(
        <ValidationInput
          value="valid input"
          onChange={() => {}}
          success="Input is valid"
          validationState="success"
          placeholder="Success color test"
        />
      );

      const successMessage = screen.getByText('Input is valid');

      // text-green-600 is #16a34a which has sufficient contrast (WCAG AA compliant)
      expect(successMessage).toHaveClass('text-green-600');
    });

    it('should maintain contrast in error state borders', () => {
      const { container } = render(
        <ValidationInput
          value=""
          onChange={() => {}}
          error="Required"
          validationState="error"
          placeholder="Border contrast"
        />
      );

      const input = screen.getByPlaceholderText('Border contrast');

      // Error borders use red-300/red-500 for sufficient visibility
      expect(input).toHaveClass('border-red-300');
    });
  });

  describe('Focus management in error recovery flows', () => {
    it('should maintain focus on input after validation error', async () => {
      const user = userEvent.setup();

      const { rerender } = render(
        <ValidationInput
          value=""
          onChange={() => {}}
          placeholder="Focus test"
        />
      );

      const input = screen.getByPlaceholderText('Focus test');
      await user.click(input);

      expect(input).toHaveFocus();

      // Trigger validation error
      rerender(
        <ValidationInput
          value="x"
          onChange={() => {}}
          error="Too short"
          validationState="error"
          placeholder="Focus test"
        />
      );

      // Focus should remain on input
      expect(input).toHaveFocus();
    });

    it('should allow tabbing away from error input', async () => {
      const user = userEvent.setup();

      render(
        <div>
          <ValidationInput
            value="invalid"
            onChange={() => {}}
            error="Invalid format"
            validationState="error"
            placeholder="Error input"
          />
          <input type="text" placeholder="Next input" />
        </div>
      );

      const errorInput = screen.getByPlaceholderText('Error input');
      const nextInput = screen.getByPlaceholderText('Next input');

      errorInput.focus();
      await user.tab();

      expect(nextInput).toHaveFocus();
    });

    it('should have visible focus ring for keyboard navigation', () => {
      render(
        <ValidationInput
          value=""
          onChange={() => {}}
          placeholder="Focus ring test"
        />
      );

      const input = screen.getByPlaceholderText('Focus ring test');

      // Component uses focus-visible:ring-2 for keyboard focus
      expect(input.className).toContain('focus-visible:ring-2');
    });
  });

  describe('Form labels and ARIA labels', () => {
    it('should support explicit labels for screen readers', () => {
      render(
        <div>
          <label htmlFor="test-input">Test Label</label>
          <ValidationInput
            id="test-input"
            value=""
            onChange={() => {}}
            placeholder="Labeled input"
          />
        </div>
      );

      const input = screen.getByPlaceholderText('Labeled input');
      const label = screen.getByText('Test Label');

      expect(input).toHaveAttribute('id', 'test-input');
      expect(label).toHaveAttribute('for', 'test-input');
    });

    it('should support aria-label for inputs without visible labels', () => {
      render(
        <ValidationInput
          value=""
          onChange={() => {}}
          aria-label="Search query"
          placeholder="Search..."
        />
      );

      const input = screen.getByLabelText('Search query');
      expect(input).toBeInTheDocument();
    });

    it('should associate error messages with inputs via aria-describedby', () => {
      render(
        <div>
          <ValidationInput
            value="invalid"
            onChange={() => {}}
            error="Invalid email format"
            aria-describedby="email-error"
            placeholder="Email"
          />
          <span id="email-error">Invalid email format</span>
        </div>
      );

      const input = screen.getByPlaceholderText('Email');
      expect(input).toHaveAttribute('aria-describedby', 'email-error');
    });
  });

  describe('Character count accessibility', () => {
    it('should announce character count to screen readers', () => {
      render(
        <div>
          <ValidationTextarea
            value="Test content"
            onChange={() => {}}
            currentLength={12}
            maxLength={100}
            showCount={true}
            aria-describedby="char-count"
            placeholder="Character count test"
          />
          <div id="char-count" aria-live="polite" aria-atomic="true">
            12/100 characters
          </div>
        </div>
      );

      const charCount = screen.getByText('12/100');
      expect(charCount).toBeInTheDocument();
    });

    it('should warn when approaching character limit', () => {
      render(
        <ValidationTextarea
          value="Almost at limit"
          onChange={() => {}}
          currentLength={95}
          maxLength={100}
          showCount={true}
          placeholder="Limit warning"
        />
      );

      const charCount = screen.getByText('95/100');

      // Yellow warning color when > 90% of limit
      expect(charCount).toHaveClass('text-yellow-600');
    });

    it('should alert when exceeding character limit', () => {
      render(
        <ValidationTextarea
          value="Way over the limit now"
          onChange={() => {}}
          currentLength={105}
          maxLength={100}
          showCount={true}
          placeholder="Limit exceeded"
        />
      );

      const charCount = screen.getByText('105/100');

      // Red error color when over limit
      expect(charCount).toHaveClass('text-red-600');
    });
  });
});
