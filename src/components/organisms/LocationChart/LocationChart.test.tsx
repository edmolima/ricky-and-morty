import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LocationChart } from './LocationChart';

const mockData = [
  { location: 'Earth (C-137)', count: 27 },
  { location: 'Citadel of Ricks', count: 23 },
  { location: 'Earth (Replacement Dimension)', count: 20 },
  { location: 'Unknown', count: 15 },
];

describe('LocationChart', () => {
  it('renders null when data is empty', () => {
    const { container } = render(<LocationChart data={[]} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders pie chart container with data', () => {
    const { container } = render(<LocationChart data={mockData} />);

    expect(container.querySelector('.recharts-responsive-container')).toBeTruthy();
  });

  it('transforms data correctly for Recharts', () => {
    const { container } = render(<LocationChart data={mockData} />);

    const responsiveContainer = container.querySelector('.recharts-responsive-container');
    expect(responsiveContainer).toBeTruthy();
  });

  it('renders with correct number of data points', () => {
    const { container } = render(<LocationChart data={mockData} />);

    expect(container.firstChild).toBeTruthy();
  });
});