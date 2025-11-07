import type { Character } from '@/lib/apollo';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { CharacterTable } from './CharacterTable';

const mockCharacters: Character[] = [
  {
    id: '1',
    name: 'Rick Sanchez',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
    created: '2017-11-04T18:48:46.250Z',
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
      type: 'Planet',
      dimension: 'Replacement Dimension',
    },
  },
  {
    id: '2',
    name: 'Morty Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Male',
    image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
    created: '2017-11-04T18:50:21.651Z',
    location: {
      id: '20',
      name: 'Earth (Replacement Dimension)',
      type: 'Planet',
      dimension: 'Replacement Dimension',
    },
  },
];

describe('CharacterTable', () => {
  it('renders table with headers when has characters', () => {
    render(<CharacterTable characters={mockCharacters} />);

    expect(screen.getByRole('columnheader', { name: /avatar/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /name/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /status/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /species/i })).toBeInTheDocument();
    expect(screen.getByRole('columnheader', { name: /location/i })).toBeInTheDocument();
  });

  it('renders character data', () => {
    render(<CharacterTable characters={mockCharacters} />);

    expect(screen.getByText('Rick Sanchez')).toBeInTheDocument();
    expect(screen.getByText('Morty Smith')).toBeInTheDocument();
    expect(screen.getAllByText('Alive')).toHaveLength(2);
    expect(screen.getAllByText('Human')).toHaveLength(2);
  });

  it('renders character images with alt text', () => {
    render(<CharacterTable characters={mockCharacters} />);

    const rickImage = screen.getByAltText('Rick Sanchez');
    const mortyImage = screen.getByAltText('Morty Smith');

    expect(rickImage).toBeInTheDocument();
    expect(mortyImage).toBeInTheDocument();
  });

  it('displays location names', () => {
    render(<CharacterTable characters={mockCharacters} />);

    expect(screen.getAllByText('Earth (Replacement Dimension)')).toHaveLength(2);
  });

  it('returns null when no characters', () => {
    const { container } = render(<CharacterTable characters={[]} />);

    expect(container.firstChild).toBeNull();
  });

  it('renders table with proper semantic structure', () => {
    render(<CharacterTable characters={mockCharacters} />);

    expect(screen.getByRole('table')).toBeInTheDocument();
    // 1 header + 2 data rows
    expect(screen.getAllByRole('row')).toHaveLength(3);
  });
});