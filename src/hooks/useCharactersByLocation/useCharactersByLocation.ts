import { GET_CHARACTERS, type GetCharactersResponse, getClient } from '@/lib/apollo';
import { logger } from '@/lib/logger';
import { useQuery } from '@apollo/client/react';
import { useEffect, useMemo, useRef, useState } from 'react';

type LocationCount = {
  location: string;
  count: number;
};

type UseCharactersByLocationInput = {
  limit?: number;
  sampleSize?: number;
};

type UseCharactersByLocationOutput = {
  data: LocationCount[];
  loading: boolean;
  error: Error | undefined;
};

const BATCH_SIZE = 5;
const DEFAULT_SAMPLE_SIZE = 10;

const fetchSamplePages = async (
  totalPages: number,
  sampleSize: number,
  signal?: AbortSignal
): Promise<GetCharactersResponse[]> => {
  const client = getClient();
  const pagesToFetch = Math.min(sampleSize, totalPages);
  const results: GetCharactersResponse[] = [];
  const errors: Error[] = [];

  for (let i = 0; i < pagesToFetch; i += BATCH_SIZE) {
    if (signal?.aborted) {
      throw new Error('Fetch aborted');
    }

    const batchCount = Math.min(BATCH_SIZE, pagesToFetch - i);

    const batch = Array.from({ length: batchCount }, (_, index) =>
      client
        .query<GetCharactersResponse>({
          query: GET_CHARACTERS,
          variables: { page: i + index + 2 },
          context: { fetchOptions: { signal } },
        })
        .then((result) => result.data!)
        .catch((error: Error) => {
          if (error.name === 'AbortError') throw error;
          errors.push(error);
          logger.error('[useCharactersByLocation] Page fetch failed', {
            page: i + index + 2,
            error: error.message,
          });
          return null;
        })
    );

    const batchResults = await Promise.all(batch);
    results.push(...batchResults.filter((r: GetCharactersResponse | null): r is GetCharactersResponse => r !== null));
  }

  if (errors.length > 0) {
    logger.warn(`Failed to fetch ${errors.length} pages, continuing with available data`);
  }

  return results;
};


export const useCharactersByLocation = (options?: UseCharactersByLocationInput): UseCharactersByLocationOutput => {
  const limit = options?.limit ?? 10;
  const sampleSize = options?.sampleSize ?? DEFAULT_SAMPLE_SIZE;
  const [fetchedPages, setFetchedPages] = useState<GetCharactersResponse[]>([]);
  const [error, setError] = useState<Error>();
  const abortControllerRef = useRef<AbortController | null>(null);

  const { data: firstPageData, loading } = useQuery<GetCharactersResponse>(GET_CHARACTERS, {
    variables: { page: 1 },
  });

  useEffect(() => {
    if (!firstPageData) return;

    // Cancel previous fetch
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    let cancelled = false;

    const fetchAndProcess = async () => {
      try {
        const totalPages = firstPageData.characters.info.pages;
        if (totalPages <= 1) {
          setFetchedPages([]);
          return;
        }

        const pages = await fetchSamplePages(totalPages - 1, sampleSize, abortControllerRef.current?.signal);

        if (!cancelled) {
          setFetchedPages(pages);
          setError(undefined);
        }
      } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
          return; // Ignore aborted requests
        }
        if (!cancelled) {
          setError(error instanceof Error ? error : new Error('Unknown error'));
        }
      }
    };

    fetchAndProcess();

    return () => {
      cancelled = true;
      abortControllerRef.current?.abort();
    };
  }, [firstPageData, sampleSize]);

  const topLocations = useMemo(() => {
    if (!firstPageData) return [];

    const counts = new Map<string, number>();
    for (const page of [firstPageData, ...fetchedPages]) {
      for (const character of page.characters.results) {
        const location = character.location?.name || 'Unknown';
        counts.set(location, (counts.get(location) || 0) + 1);
      }
    }

    return Array.from(counts, ([location, count]) => ({ location, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
  }, [firstPageData, fetchedPages, limit]);

  return {
    data: topLocations,
    loading,
    error,
  };
};