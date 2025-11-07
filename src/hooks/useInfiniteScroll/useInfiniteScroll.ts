import { useEffect, useRef } from 'react';

type UseInfiniteScrollInput = {
  hasNextPage: boolean;
  isLoading: boolean;
  onLoadMore: () => void;
  rootMargin?: string;
};

export const useInfiniteScroll = <T extends HTMLElement = HTMLDivElement>({
  hasNextPage,
  isLoading,
  onLoadMore,
  rootMargin = '200px',
}: UseInfiniteScrollInput) => {
  const sentinelRef = useRef<T>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasNextPage || isLoading) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          onLoadMore();
        }
      },
      { rootMargin }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasNextPage, isLoading, onLoadMore, rootMargin]);

  return sentinelRef;
};