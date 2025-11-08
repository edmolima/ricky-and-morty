import type { Character, GetCharactersResponse, Location } from '@/lib/apollo';

export const mockLocation: Location = {
  id: '3',
  name: 'Citadel of Ricks',
  type: 'Space station',
  dimension: 'unknown',
};

export const mockCharacter: Character = {
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
    name: 'Earth (C-137)',
    type: 'Planet',
    dimension: 'Dimension C-137',
  },
};

export const mockCharacters: Character[] = [
  mockCharacter,
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
      name: 'Earth (C-137)',
      type: 'Planet',
      dimension: 'Dimension C-137',
    },
  },
  {
    id: '3',
    name: 'Summer Smith',
    status: 'Alive',
    species: 'Human',
    type: '',
    gender: 'Female',
    image: 'https://rickandmortyapi.com/api/character/avatar/3.jpeg',
    created: '2017-11-04T19:09:56.428Z',
    location: {
      id: '3',
      name: 'Citadel of Ricks',
      type: 'Space station',
      dimension: 'unknown',
    },
  },
];

// GraphQL Query Responses
export const mockCharactersResponse: GetCharactersResponse = {
  characters: {
    info: {
      count: 826,
      pages: 42,
      next: 2,
      prev: null,
    },
    results: mockCharacters.slice(0, 2),
  },
};

export const mockCharactersPage2Response: GetCharactersResponse = {
  characters: {
    info: {
      count: 826,
      pages: 42,
      next: 3,
      prev: 1,
    },
    results: [mockCharacters[2]],
  },
};

export const mockFilteredCharactersResponse: GetCharactersResponse = {
  characters: {
    info: {
      count: 1,
      pages: 1,
      next: null,
      prev: null,
    },
    results: [mockCharacter],
  },
};

export const mockEmptyCharactersResponse: GetCharactersResponse = {
  characters: {
    info: {
      count: 0,
      pages: 0,
      next: null,
      prev: null,
    },
    results: [],
  },
};