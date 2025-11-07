import type { Character, Location } from '@/lib/apollo';

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
  },
];