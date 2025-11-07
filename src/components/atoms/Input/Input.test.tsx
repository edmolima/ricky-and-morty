import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Input } from './Input';

describe('Input', () => {
  it('renders input with placeholder', () => {
    render(<Input placeholder="Enter text..." />);
    expect(screen.getByPlaceholderText(/enter text/i)).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input onChange={handleChange} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Rick');

    expect(handleChange).toHaveBeenCalled();
    expect(input).toHaveValue('Rick');
  });

  it('can be focused and blurred', async () => {
    const user = userEvent.setup();

    render(<Input placeholder="Test" />);

    const input = screen.getByRole('textbox');

    await user.click(input);
    expect(input).toHaveFocus();

    await user.tab();
    expect(input).not.toHaveFocus();
  });

  it('respects disabled state', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<Input onChange={handleChange} disabled />);

    const input = screen.getByRole('textbox');

    await user.type(input, 'test');

    expect(handleChange).not.toHaveBeenCalled();
    expect(input).toBeDisabled();
  });

  it('renders as input element', () => {
    render(<Input placeholder="Test" />);

    const input = screen.getByRole('textbox');
    expect(input.tagName).toBe('INPUT');
  });
});