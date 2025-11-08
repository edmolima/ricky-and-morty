import type { GetCharactersResponse } from '@/lib/apollo';
import { GET_CHARACTERS } from '@/lib/apollo';
import type { MockedResponse } from '@apollo/client/testing';
import { renderHook, waitFor } from '@testing-library/react';
import { createApolloWrapper } from '@tests/utils/test-utils';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useCharactersByLocation } from './useCharactersByLocation';

const mockQueryFn = vi.fn();
vi.mock('@/lib/apollo', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/lib/apollo')>();
  return {
    ...actual,
    getClient: () => ({
      query: mockQueryFn,
    }),
  };
});

const mockSinglePageResponse: GetCharactersResponse = {
  characters: {
    info: {
      count: 3,
      pages: 1,
      next: null,
      prev: null,
    },
    results: [
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
          name: 'Earth (C-137)',
          type: 'Planet',
          dimension: 'Dimension C-137',
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
    ],
  },
};

describe('useCharactersByLocation', () => {
  beforeEach(() => {
    mockQueryFn.mockReset();
    mockQueryFn.mockResolvedValue({ data: {} });
  });

  it('should return initial loading state', () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockSinglePageResponse },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation(), {
      wrapper: createApolloWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
    expect(result.current.error).toBeUndefined();
  });

  it('should aggregate characters by location', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockSinglePageResponse },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBeGreaterThan(0);

    const earthLocation = result.current.data.find((loc) => loc.location === 'Earth (C-137)');
    expect(earthLocation).toBeDefined();
    expect(earthLocation?.count).toBe(2);

    const citadelLocation = result.current.data.find((loc) => loc.location === 'Citadel of Ricks');
    expect(citadelLocation).toBeDefined();
    expect(citadelLocation?.count).toBe(1);
  });

  it('should sort locations by count in descending order', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockSinglePageResponse },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    for (let i = 0; i < result.current.data.length - 1; i++) {
      expect(result.current.data[i].count).toBeGreaterThanOrEqual(result.current.data[i + 1].count);
    }
  });

  it('should respect limit parameter', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockSinglePageResponse },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation({ limit: 1 }), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data.length).toBeLessThanOrEqual(1);
  });

  it('should handle unknown locations correctly', async () => {
    const mockWithUnknown: GetCharactersResponse = {
      characters: {
        info: {
          count: 2,
          pages: 1,
          next: null,
          prev: null,
        },
        results: [
          {
            id: '1',
            name: 'Character 1',
            status: 'Alive',
            species: 'Human',
            type: '',
            gender: 'Male',
            image: 'https://rickandmortyapi.com/api/character/avatar/1.jpeg',
            created: '2017-11-04T18:48:46.250Z',
            location: null,
          },
          {
            id: '2',
            name: 'Character 2',
            status: 'Alive',
            species: 'Human',
            type: '',
            gender: 'Female',
            image: 'https://rickandmortyapi.com/api/character/avatar/2.jpeg',
            created: '2017-11-04T18:50:21.651Z',
            location: {
              id: '1',
              name: null,
              type: 'Planet',
              dimension: 'unknown',
            },
          },
        ],
      },
    };

    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockWithUnknown },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    const unknownLocation = result.current.data.find((loc) => loc.location === 'Unknown');
    expect(unknownLocation).toBeDefined();
    expect(unknownLocation?.count).toBe(2);
  });

  it('should return correctly structured location data', async () => {
    const mocks: MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1 },
        },
        result: { data: mockSinglePageResponse },
      },
    ];

    const { result } = renderHook(() => useCharactersByLocation({ limit: 10 }), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    result.current.data.forEach((item) => {
      expect(item).toHaveProperty('location');
      expect(item).toHaveProperty('count');
      expect(typeof item.location).toBe('string');
      expect(typeof item.count).toBe('number');
      expect(item.count).toBeGreaterThan(0);
    });
  });
});
