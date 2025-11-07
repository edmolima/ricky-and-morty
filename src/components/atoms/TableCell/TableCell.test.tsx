import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TableCell } from './TableCell';

describe('TableCell', () => {
  it('renders children content', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Test content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('cell')).toHaveTextContent('Test content');
  });

  it('renders standard table cell correctly', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell>Standard Cell</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('cell')).toHaveTextContent('Standard Cell');
  });

  it('applies custom className', () => {
    render(
      <table>
        <tbody>
          <tr>
            <TableCell className="custom-class">Content</TableCell>
          </tr>
        </tbody>
      </table>
    );

    expect(screen.getByRole('cell')).toHaveClass('custom-class');
  });
});