import { GET_CHARACTERS } from '@/lib/apollo';
import { MockLink } from '@apollo/client/testing';
import {
  mockCharactersPage2Response,
  mockCharactersResponse,
  mockFilteredCharactersResponse,
} from '@tests/mocks/data';
import { createApolloWrapper } from '@tests/utils/test-utils';
import { renderHook, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { useCharacters } from './useCharacters';

describe('useCharacters', () => {
  it('should return initial loading state', () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toEqual([]);
  });

  it('should load characters successfully', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.data[0].name).toBe('Rick Sanchez');
    expect(result.current.data[1].name).toBe('Morty Smith');
  });

  it('should provide correct pagination info', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasNextPage).toBe(true);
    expect(result.current.info?.pages).toBe(42);
    expect(result.current.info?.count).toBe(826);
  });

  it('should filter characters by name', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: { name: 'Rick' } },
        },
        result: { data: mockFilteredCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useCharacters({ searchName: 'Rick' }), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(1);
    expect(result.current.data[0].name).toBe('Rick Sanchez');
  });

  it('should indicate no next page when on last page', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockFilteredCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasNextPage).toBe(false);
  });

  it('should fetch and append next page results', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 2, filter: undefined },
        },
        result: { data: mockCharactersPage2Response },
      },
    ];

    const { result } = renderHook(() => useCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.data).toHaveLength(2);

    result.current.fetchNextPage();

    await waitFor(() => expect(result.current.data).toHaveLength(3));
    expect(result.current.data[2].name).toBe('Summer Smith');
  });
});
