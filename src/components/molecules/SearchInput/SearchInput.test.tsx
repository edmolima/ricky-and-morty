import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { SearchInput } from './SearchInput';

describe('SearchInput', () => {
  it('renders search input with placeholder', () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} placeholder="Search..." />);
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();
  });

  it('displays current value', () => {
    render(<SearchInput value="Rick" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.getByDisplayValue('Rick')).toBeInTheDocument();
  });

  it('calls onChange when user types', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(<SearchInput value="" onChange={handleChange} onClear={vi.fn()} />);

    const input = screen.getByRole('textbox');
    await user.type(input, 'Morty');

    expect(handleChange).toHaveBeenCalled();
  });

  it('hides clear button when input is empty', () => {
    render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('renders with search functionality', () => {
    const { container } = render(<SearchInput value="" onChange={vi.fn()} onClear={vi.fn()} />);

    // SearchInput should render
    expect(container.firstChild).toBeInTheDocument();
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });
});