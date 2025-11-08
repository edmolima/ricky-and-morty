import { MockedProvider } from '@apollo/client/testing/react';
import { MockLink } from '@apollo/client/testing';
import { render, renderHook, type RenderOptions } from '@testing-library/react';
import type { ReactElement, ReactNode } from 'react';

type CustomRenderOptions = Omit<RenderOptions, 'wrapper'> & {
  mocks?: MockLink.MockedResponse[];
};

export function renderWithProviders(
  ui: ReactElement,
  { mocks = [], ...options }: CustomRenderOptions = {}
) {
  function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  }

  return render(ui, { wrapper: Wrapper, ...options });
}

export function createApolloWrapper(mocks: MockLink.MockedResponse[] = []) {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <MockedProvider mocks={mocks}>{children}</MockedProvider>;
  };
}

export function renderHookWithApollo<TProps, TResult>(
  hook: (props: TProps) => TResult,
  mocks: MockLink.MockedResponse[] = [],
  initialProps?: TProps
) {
  return renderHook(hook, {
    wrapper: createApolloWrapper(mocks),
    initialProps,
  });
}

export * from '@testing-library/react';