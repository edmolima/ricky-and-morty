import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from './Button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick} disabled>Click me</Button>);

    await user.click(screen.getByRole('button'));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it('is keyboard accessible', async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Click me</Button>);

    const button = screen.getByRole('button');
    button.focus();

    expect(button).toHaveFocus();

    await user.keyboard('{Enter}');
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders with different sizes', () => {
    render(<Button size="small">Small</Button>);
    expect(screen.getByRole('button', { name: /small/i })).toBeInTheDocument();

    render(<Button size="medium">Medium</Button>);
    expect(screen.getByRole('button', { name: /medium/i })).toBeInTheDocument();

    render(<Button size="large">Large</Button>);
    expect(screen.getByRole('button', { name: /large/i })).toBeInTheDocument();
  });
});