import { GET_CHARACTERS } from '@/lib/apollo';
import { MockLink } from '@apollo/client/testing';
import { act, renderHook, waitFor } from '@testing-library/react';
import {
  mockCharactersResponse,
  mockEmptyCharactersResponse,
  mockFilteredCharactersResponse,
} from '@tests/mocks/data';
import { createApolloWrapper } from '@tests/utils/test-utils';
import { describe, expect, it } from 'vitest';
import { useSearchCharacters } from './useSearchCharacters';

describe('useSearchCharacters', () => {
  it('should initialize with empty search', () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    expect(result.current.search).toBe('');
    expect(result.current.isEmpty).toBe(true);
    expect(result.current.isSearching).toBe(false);
  });

  it('should load all characters when search is empty', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.data).toHaveLength(2);
    expect(result.current.isEmpty).toBe(true);
  });

  it('should update search value when setSearch is called', () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    act(() => {
      result.current.setSearch('Rick');
    });

    expect(result.current.search).toBe('Rick');
    expect(result.current.isEmpty).toBe(false);
  });

  it('should filter characters by search term', async () => {
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
          variables: { page: 1, filter: { name: 'Rick' } },
        },
        result: { data: mockFilteredCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearch('Rick');
    });

    await waitFor(() => expect(result.current.data).toHaveLength(1));

    expect(result.current.data[0].name).toBe('Rick Sanchez');
    expect(result.current.isEmpty).toBe(false);
  });

  it('should detect when search returns no results', async () => {
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
          variables: { page: 1, filter: { name: 'NonExistent' } },
        },
        result: { data: mockEmptyCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearch('NonExistent');
    });

    await waitFor(() => expect(result.current.hasNoResults).toBe(true));

    expect(result.current.data).toHaveLength(0);
    expect(result.current.isEmpty).toBe(false);
  });

  it('should ignore whitespace-only search', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    act(() => {
      result.current.setSearch('   ');
    });

    expect(result.current.isEmpty).toBe(true);
  });

  it('should provide pagination functionality from useCharacters', async () => {
    const mocks: MockLink.MockedResponse[] = [
      {
        request: {
          query: GET_CHARACTERS,
          variables: { page: 1, filter: undefined },
        },
        result: { data: mockCharactersResponse },
      },
    ];

    const { result } = renderHook(() => useSearchCharacters(), {
      wrapper: createApolloWrapper(mocks),
    });

    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.hasNextPage).toBeDefined();
    expect(result.current.info).toBeDefined();
    expect(typeof result.current.fetchNextPage).toBe('function');
  });
});
