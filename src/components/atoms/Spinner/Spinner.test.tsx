import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Spinner } from './Spinner';

describe('Spinner', () => {
  it('renders with default label', () => {
    render(<Spinner />);
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders with custom label', () => {
    render(<Spinner label="Loading characters..." />);
    expect(screen.getByText(/loading characters/i)).toBeInTheDocument();
  });

  it('has proper accessibility attributes', () => {
    render(<Spinner />);
    const spinner = screen.getByRole('status');

    expect(spinner).toHaveAttribute('aria-live', 'polite');
    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });

  it('renders without label when empty string provided', () => {
    render(<Spinner label="" />);
    const spinner = screen.getByRole('status');

    expect(spinner).toBeInTheDocument();
    expect(spinner.querySelector(`.label`)).not.toBeInTheDocument();
  });
});