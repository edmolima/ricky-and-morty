import { renderHook } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { useInfiniteScroll } from './useInfiniteScroll';

describe('useInfiniteScroll', () => {
  it('returns ref object', () => {
    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isLoading: false,
        onLoadMore: vi.fn(),
      })
    );

    expect(result.current).toHaveProperty('current');
    expect(result.current.current).toBeNull();
  });

  it('accepts configuration options', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isLoading: false,
        onLoadMore,
        rootMargin: '200px',
      })
    );

    expect(result.current).toBeDefined();
  });

  it('handles disabled state when no next page', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: false,
        isLoading: false,
        onLoadMore,
      })
    );

    expect(result.current).toBeDefined();
  });

  it('handles loading state', () => {
    const onLoadMore = vi.fn();

    const { result } = renderHook(() =>
      useInfiniteScroll({
        hasNextPage: true,
        isLoading: true,
        onLoadMore,
      })
    );

    expect(result.current).toBeDefined();
  });
});