import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { useTheme } from './useTheme';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: query === '(prefers-color-scheme: dark)',
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

describe('useTheme', () => {
  const mockLocalStorage = (() => {
    let store: Record<string, string> = {};
    return {
      getItem: (key: string) => store[key] || null,
      setItem: (key: string, value: string) => {
        store[key] = value;
      },
      clear: () => {
        store = {};
      },
    };
  })();

  beforeEach(() => {
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
    mockLocalStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  it('initializes with dark theme by default', () => {
    const { result } = renderHook(() => useTheme());

    expect(result.current.theme).toBe('dark');
  });

  it('sets mounted to true', async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });
  });

  it('toggles theme', async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    const initialTheme = result.current.theme;

    act(() => {
      result.current.toggleTheme();
    });

    expect(result.current.theme).not.toBe(initialTheme);
  });

  it('persists theme to localStorage', async () => {
    const { result } = renderHook(() => useTheme());

    await waitFor(() => {
      expect(result.current.mounted).toBe(true);
    });

    act(() => {
      result.current.toggleTheme();
    });

    const storedTheme = mockLocalStorage.getItem('theme');
    expect(storedTheme).toBeTruthy();
    expect(['light', 'dark']).toContain(storedTheme);
  });
});