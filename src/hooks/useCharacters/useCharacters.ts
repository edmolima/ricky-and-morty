import { GET_CHARACTERS, type Character, type GetCharactersResponse, type Info } from '@/lib/apollo';
import { logger } from '@/lib/logger';
import { useQuery } from '@apollo/client/react';
import { useCallback, useEffect, useMemo, useRef } from 'react';

export type UseCharactersInput = {
  searchName?: string;
};

export type UseCharactersOutput = {
  data: Character[];
  info: Info | undefined;
  loading: boolean;
  error: Error | undefined;
  hasNextPage: boolean;
  fetchNextPage: () => void;
};

export const useCharacters = (options?: UseCharactersInput): UseCharactersOutput => {
  const filter = useMemo(
    () => (options?.searchName ? { name: options.searchName } : undefined),
    [options]
  );
  const filterRef = useRef(filter);

  useEffect(() => {
    filterRef.current = filter;
  }, [filter]);

  const { data, loading, error, fetchMore } = useQuery<GetCharactersResponse>(GET_CHARACTERS, {
    variables: { page: 1, filter },
    notifyOnNetworkStatusChange: true,
  });

  if (error) {
    logger.error('[useCharacters] Query failed', { message: error.message });
  }

  const nextPage = data?.characters?.info?.next;
  const hasNextPage = Boolean(nextPage);

  const fetchNextPage = useCallback(() => {
    if (!hasNextPage || loading || !nextPage) return;

    fetchMore({
      variables: { page: nextPage, filter: filterRef.current },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prev;

        return {
          characters: {
            ...fetchMoreResult.characters,
            results: [...prev.characters.results, ...fetchMoreResult.characters.results],
          },
        };
      },
    });
  }, [fetchMore, hasNextPage, loading, nextPage]);

  return {
    data: data?.characters?.results ?? [],
    info: data?.characters?.info,
    loading,
    error,
    hasNextPage,
    fetchNextPage,
  };
};