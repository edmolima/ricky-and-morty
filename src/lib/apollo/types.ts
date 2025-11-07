export const CharacterStatus = {
  Alive: 'Alive',
  Dead: 'Dead',
  Unknown: 'Unknown',
} as const;

export const CharacterGender = {
  Female: 'Female',
  Male: 'Male',
  Genderless: 'Genderless',
  Unknown: 'Unknown',
} as const;

export type CharacterStatus = (typeof CharacterStatus)[keyof typeof CharacterStatus];
export type CharacterGender = (typeof CharacterGender)[keyof typeof CharacterGender];

export type Location = {
  id: string | null;
  name: string | null;
  type: string | null;
  dimension: string | null;
};

export type Episode = {
  id: string;
  name: string;
  episode: string;
};

export type Info = {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
};

type CharacterBase = {
  id: string;
  name: string;
  status: CharacterStatus;
  species: string;
  type: string;
  gender: CharacterGender;
  image: string;
  created: string;
};

export type Character = CharacterBase & {
  location?: Location | null;
};

export type CharacterDetail = CharacterBase & {
  origin: Location | null;
  location: Location | null;
  episode: Episode[];
};

export type GetCharactersResponse = {
  characters: {
    info: Info;
    results: Character[];
  };
};

export type GetCharacterResponse = {
  character: CharacterDetail;
};

export type FilterCharacter = {
  name?: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
};